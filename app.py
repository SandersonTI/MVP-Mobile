from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import hashlib
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Caminho do banco de dados
DATABASE = 'users.db'

# ─── Administrador padrão ──────
ADMIN_USER = 'Administrador'
ADMIN_PASS = 'adminadmin'

def init_db():
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()

    # Tabela de usuários — agora com campo 'tipo'
    c.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
        telefone TEXT NOT NULL, username TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL,
        tipo TEXT NOT NULL DEFAULT 'turista',  -- turista|guia|admin
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')

    colunas_users = [coluna[1] for coluna in c.execute("PRAGMA table_info(users)").fetchall()]
    if 'tipo' not in colunas_users:
        c.execute("ALTER TABLE users ADD COLUMN tipo TEXT NOT NULL DEFAULT 'turista'")
    # Novas colunas para guias
    for col, defval in [
        ('foto_base64',  'NULL'),
        ('instagram',    "''"),
        ('linkedin',     "''"),
        ('facebook',     "''"),
        ('status_guia',  "'ativo'"),   # ativo | pendente | reprovado
        ('justificativa_guia', 'NULL'),
        ('servico',      "''"),
    ]:
        if col not in colunas_users:
            try:
                c.execute(f"ALTER TABLE users ADD COLUMN {col} TEXT DEFAULT {defval}")
            except: pass
        
    # Sugestões de passeios enviadas por turistas/guias
    c.execute('''CREATE TABLE IF NOT EXISTS sugestoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL, nome_local TEXT NOT NULL,
        descricao TEXT NOT NULL, dificuldade TEXT NOT NULL,
        local TEXT DEFAULT '',
        link TEXT DEFAULT '',
        foto_base64 TEXT,
        status TEXT NOT NULL DEFAULT 'pendente',
        justificativa TEXT,
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id))''')
    # Migração: adicionar colunas se já existir tabela sem elas
    try:
        c.execute("ALTER TABLE sugestoes ADD COLUMN local TEXT DEFAULT ''")
    except: pass
    try:
        c.execute("ALTER TABLE sugestoes ADD COLUMN link TEXT DEFAULT ''")
    except: pass

    # Inscrições de guias em trilhas/passeios
    c.execute('''CREATE TABLE IF NOT EXISTS inscricoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guia_id INTEGER NOT NULL, trilha_id TEXT NOT NULL,
        data_inscricao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(guia_id, trilha_id),
        FOREIGN KEY (guia_id) REFERENCES users(id))''')

    # Eventos gerenciados pelo admin
    c.execute('''CREATE TABLE IF NOT EXISTS eventos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL, data_evento TEXT NOT NULL,
        local TEXT NOT NULL, descricao TEXT NOT NULL,
        imagem_url TEXT, link TEXT,
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')

    # Tabela de passeios gerenciados pelo admin
    c.execute('''CREATE TABLE IF NOT EXISTS passeios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descricao TEXT NOT NULL,
        dificuldade TEXT NOT NULL,
        local TEXT NOT NULL,
        imagem_url TEXT,
        link TEXT,
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
    
    # Status das trilhas estáticas (ativo/pausado)
    c.execute('''CREATE TABLE IF NOT EXISTS trilhas_status (
        trilha_id TEXT PRIMARY KEY,
        pausada   INTEGER NOT NULL DEFAULT 0
    )''')

    # Admin padrão — INSERT OR IGNORE evita erro se já existir
    c.execute('''INSERT OR IGNORE INTO users
                 (nome,email,telefone,username,senha,tipo)
                 VALUES(?,?,?,?,?,?)''',
              ('Administrador','admin@tereverde.com','(00) 00000-0000',
               ADMIN_USER, hash_password(ADMIN_PASS), 'admin'))

    c.execute("UPDATE users SET tipo = 'admin' WHERE username = ?", (ADMIN_USER,))

    conn.commit()
    conn.close()
    print('Banco inicializado. Admin: usuario="Administrador" / senha="adminadmin"')    

# Função para criptografar senha
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Verificar se conexão ao DB está OK
def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/api/cadastro', methods=['POST'])
def cadastro():
    conn = None
    try:
        data = request.get_json()
        
        # Validar campos obrigatórios
        nome = data.get('nome', '').strip()
        email = data.get('email', '').strip()
        telefone = data.get('telefone', '').strip()
        username = data.get('username', '').strip()
        senha = data.get('senha', '').strip()
        confirmar_senha = data.get('confirmar_senha', '').strip()
        tipo = data.get('tipo', 'turista').strip()
        foto_base64  = data.get('foto_base64', '')
        instagram    = data.get('instagram', '').strip()
        linkedin     = data.get('linkedin', '').strip()
        facebook     = data.get('facebook', '').strip()
        servico      = data.get('servico', '').strip()
        # Guias começam com status pendente até aprovação do admin
        status_guia  = 'pendente' if tipo == 'guia' else 'ativo'
        # Garante que ninguém passe 'admin' via cadastro público
        if tipo not in ('turista', 'guia'):
            tipo = 'turista'
        
        # Validações
        if not all([nome, email, telefone, username, senha, confirmar_senha]):
            return jsonify({'sucesso': False, 'mensagem': 'Todos os campos são obrigatórios'}), 400
        
        if senha != confirmar_senha:
            return jsonify({'sucesso': False, 'mensagem': 'As senhas não coincidem'}), 400
        
        if len(senha) < 6:
            return jsonify({'sucesso': False, 'mensagem': 'A senha deve ter no mínimo 6 caracteres'}), 400
        
        if '@' not in email:
            return jsonify({'sucesso': False, 'mensagem': 'Email inválido'}), 400
        
        # Criptografar senha
        senha_criptografada = hash_password(senha)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO users
              (nome, email, telefone, username, senha, tipo,
               foto_base64, instagram, linkedin, facebook, servico, status_guia)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (nome, email, telefone, username, senha_criptografada, tipo,
              foto_base64, instagram, linkedin, facebook, servico, status_guia))
        
        conn.commit()
        
        msg = ('Cadastro enviado! Aguarde aprovação do administrador.' 
               if tipo == 'guia' else 
               'Cadastro realizado com sucesso! Agora faça login.')
        return jsonify({'sucesso': True, 'mensagem': msg}), 201
            
    except sqlite3.IntegrityError as e:
        if 'email' in str(e):
            return jsonify({'sucesso': False, 'mensagem': 'Este email já está cadastrado'}), 400
        elif 'username' in str(e):
            return jsonify({'sucesso': False, 'mensagem': 'Este usuário já existe'}), 400
        else:
            return jsonify({'sucesso': False, 'mensagem': 'Erro ao cadastrar usuário'}), 400
            
    except Exception as e:
        return jsonify({'sucesso': False, 'mensagem': f'Erro no servidor: {str(e)}'}), 500
        
    finally:
        # Fecha a conexão aconteça o que acontecer
        if conn:
            conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    conn = None
    try:
        data = request.get_json()
        
        username = data.get('username', '').strip()
        senha = data.get('senha', '').strip()
        
        if not username or not senha:
            return jsonify({'sucesso': False, 'mensagem': 'Usuário e senha são obrigatórios'}), 400
        
        senha_criptografada = hash_password(senha)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, nome, email, username, tipo,
                   status_guia, justificativa_guia
            FROM users
            WHERE username = ? AND senha = ?
        ''', (username, senha_criptografada))
        
        user = cursor.fetchone()
        
        if user:
            # Bloqueia guias não aprovados
            if user['tipo'] == 'guia':
                sg = user['status_guia'] or 'ativo'
                if sg == 'pendente':
                    return jsonify({
                        'sucesso': False,
                        'bloqueado': True,
                        'motivo': 'pendente',
                        'mensagem': '⏳ Seu cadastro está aguardando aprovação do administrador. Você será notificado em breve!'
                    }), 403
                elif sg == 'reprovado':
                    just = user['justificativa_guia'] or 'Sem justificativa informada.'
                    return jsonify({
                        'sucesso': False,
                        'bloqueado': True,
                        'motivo': 'reprovado',
                        'usuario_id': user['id'],
                        'mensagem': f'❌ Seu cadastro foi reprovado.\n💬 Feedback: {just}'
                    }), 403
            return jsonify({
                'sucesso': True,
                'mensagem': 'Login realizado com sucesso!',
                'usuario': {
                    'id':       user['id'],
                    'nome':     user['nome'],
                    'email':    user['email'],
                    'username': user['username'],
                    'tipo':     user['tipo']
                }
            }), 200
        else:
            return jsonify({'sucesso': False, 'mensagem': 'Usuário ou senha incorretos'}), 401
            
    except Exception as e:
        return jsonify({'sucesso': False, 'mensagem': f'Erro no servidor: {str(e)}'}), 500
        
    finally:
        if conn:
            conn.close()

@app.route('/api/usuarios', methods=['GET'])
def listar_usuarios():
    """Endpoint para debugging - listar todos os usuários (remover em produção)"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT id, nome, email, username, data_criacao FROM users')
        users = cursor.fetchall()
        conn.close()
        
        return jsonify({
            'sucesso': True,
            'total': len(users),
            'usuarios': [dict(u) for u in users]
        }), 200
    except Exception as e:
        return jsonify({'sucesso': False, 'mensagem': f'Erro: {str(e)}'}), 500

# ── GET /api/guias/pendentes — lista guias aguardando aprovação ──
@app.route('/api/guias/pendentes', methods=['GET'])
def guias_pendentes():
    try:
        conn = get_db_connection()
        rows = conn.execute(
            """SELECT id, nome, username, email, telefone, servico,
                      foto_base64, instagram, linkedin, facebook,
                      status_guia, justificativa_guia, data_criacao
               FROM users WHERE tipo='guia'
               ORDER BY data_criacao DESC"""
        ).fetchall()
        conn.close()
        return jsonify({'sucesso': True, 'guias': [dict(r) for r in rows]}), 200
    except Exception as e:
        return jsonify({'sucesso': False, 'mensagem': f'Erro: {e}'}), 500

# ── POST /api/guia/<id>/revisar — admin aprova ou reprova guia ──
@app.route('/api/guia/<int:uid>/revisar', methods=['POST'])
def revisar_guia(uid):
    conn = None
    try:
        d = request.get_json()
        decisao = d.get('decisao', '').strip()  # 'ativo' | 'reprovado'
        just    = d.get('justificativa', '').strip()
        if decisao not in ('ativo', 'reprovado'):
            return jsonify({'sucesso': False, 'mensagem': 'decisao deve ser ativo ou reprovado'}), 400
        conn = get_db_connection()
        r = conn.execute(
            'UPDATE users SET status_guia=?, justificativa_guia=? WHERE id=? AND tipo=?',
            (decisao, just, uid, 'guia')
        )
        conn.commit()
        if r.rowcount == 0:
            return jsonify({'sucesso': False, 'mensagem': 'Guia não encontrado'}), 404
        return jsonify({'sucesso': True, 'mensagem': f'Guia {decisao}!'}), 200
    except Exception as e:
        return jsonify({'sucesso': False, 'mensagem': f'Erro: {e}'}), 500
    finally:
        if conn: conn.close()

# ── GET /api/guias/aprovados — lista guias aprovados para a aba pública ──
@app.route('/api/guias/aprovados', methods=['GET'])
def guias_aprovados():
    try:
        conn = get_db_connection()
        rows = conn.execute(
            """SELECT id, nome, username, email, telefone, servico,
                      foto_base64, instagram, linkedin, facebook
               FROM users WHERE tipo='guia' AND status_guia='ativo'
               ORDER BY nome"""
        ).fetchall()
        conn.close()
        return jsonify({'sucesso': True, 'guias': [dict(r) for r in rows]}), 200
    except Exception as e:
        return jsonify({'sucesso': False, 'mensagem': f'Erro: {e}'}), 500

@app.route('/api/usuario/<int:user_id>', methods=['DELETE'])
def excluir_usuario_reprovado(user_id):
    """Permite que guia reprovado exclua a própria conta para refazer cadastro."""
    conn = None
    try:
        conn = get_db_connection()
        c = conn.cursor()
        user = c.execute(
            "SELECT id, tipo, status_guia FROM users WHERE id=?", (user_id,)
        ).fetchone()
        if not user:
            return jsonify({'sucesso': False, 'mensagem': 'Usuário não encontrado'}), 404
        # Só permite excluir guias reprovados (segurança)
        if user['tipo'] != 'guia' or user['status_guia'] != 'reprovado':
            return jsonify({'sucesso': False, 'mensagem': 'Ação não permitida'}), 403
        c.execute("DELETE FROM inscricoes WHERE guia_id=?", (user_id,))
        c.execute("DELETE FROM users WHERE id=?", (user_id,))
        conn.commit()
        return jsonify({'sucesso': True, 'mensagem': 'Conta excluída. Você pode refazer o cadastro.'}), 200
    except Exception as e:
        return jsonify({'sucesso': False, 'mensagem': str(e)}), 500
    finally:
        if conn: conn.close()

# ── POST /api/sugestao — turista/guia envia sugestão ──────────────
@app.route('/api/sugestao', methods=['POST'])
def criar_sugestao():
    conn = None
    try:
        d = request.get_json()
        user_id     = d.get('user_id')
        nome_local  = d.get('nome_local','').strip()
        descricao   = d.get('descricao','').strip()
        dificuldade = d.get('dificuldade','').strip()
        foto_base64 = d.get('foto_base64','')
        local       = d.get('local','').strip()
        link        = d.get('link','').strip()
        if not all([user_id, nome_local, descricao, dificuldade]):
            return jsonify({'sucesso':False,'mensagem':'Campos obrigatórios faltando'}), 400
        conn = get_db_connection()
        u = conn.execute('SELECT tipo FROM users WHERE id=?',(user_id,)).fetchone()
        if not u or u['tipo'] == 'admin':
            return jsonify({'sucesso':False,'mensagem':'Apenas turistas/guias podem sugerir'}), 403
        conn.execute(
            'INSERT INTO sugestoes (user_id,nome_local,descricao,dificuldade,local,link,foto_base64) VALUES(?,?,?,?,?,?,?)',
            (user_id,nome_local,descricao,dificuldade,local,link,foto_base64))
        conn.commit()
        return jsonify({'sucesso':True,'mensagem':'Sugestão enviada!'}), 201
    except Exception as e:
        return jsonify({'sucesso':False,'mensagem':f'Erro: {e}'}), 500
    finally:
        if conn: conn.close()

# ── GET /api/sugestoes — admin lista todas as sugestões ───────────
@app.route('/api/sugestoes', methods=['GET'])
def listar_sugestoes():
    try:
        status = request.args.get('status')   # ?status=pendente|aprovada|reprovada
        conn = get_db_connection()
        q = '''SELECT s.*,u.nome as autor_nome,u.username as autor_username,u.tipo as autor_tipo
               FROM sugestoes s JOIN users u ON u.id=s.user_id'''
        params = ()
        if status: q += ' WHERE s.status=?'; params=(status,)
        q += ' ORDER BY s.data_criacao DESC'
        rows = conn.execute(q, params).fetchall()
        conn.close()
        return jsonify({'sucesso':True,'sugestoes':[dict(r) for r in rows]}), 200
    except Exception as e:
        return jsonify({'sucesso':False,'mensagem':f'Erro: {e}'}), 500

# ── POST /api/sugestao/<id>/revisar — admin aprova/reprova ─────────
@app.route('/api/sugestao/<int:sid>/revisar', methods=['POST'])
def revisar_sugestao(sid):
    conn = None
    try:
        d = request.get_json()
        decisao = d.get('decisao','').strip()        # 'aprovada'|'reprovada'
        just    = d.get('justificativa','').strip()
        if decisao not in ('aprovada','reprovada'):
            return jsonify({'sucesso':False,'mensagem':'Decisão inválida'}), 400
        if decisao == 'reprovada' and not just:
            return jsonify({'sucesso':False,'mensagem':'Justificativa obrigatória para reprovação'}), 400
        conn = get_db_connection()
        r = conn.execute('UPDATE sugestoes SET status=?,justificativa=? WHERE id=?',(decisao,just,sid))
        conn.commit()
        if r.rowcount == 0: return jsonify({'sucesso':False,'mensagem':'Sugestão não encontrada'}), 404
        # Se aprovada, copia automaticamente para a tabela passeios
        if decisao == 'aprovada':
            sug = conn.execute('SELECT * FROM sugestoes WHERE id=?',(sid,)).fetchone()
            if sug:
                conn.execute(
                    '''INSERT OR IGNORE INTO passeios
                       (titulo, descricao, dificuldade, local, imagem_url)
                       VALUES (?, ?, ?, ?, ?)''',
                    (sug['nome_local'], sug['descricao'], sug['dificuldade'],
                     'Sugestão da Comunidade', sug['foto_base64'] or ''))
                conn.commit()
        return jsonify({'sucesso':True,'mensagem':f'Sugestão {decisao}!'}), 200
    except Exception as e:
        return jsonify({'sucesso':False,'mensagem':f'Erro: {e}'}), 500
    finally:
        if conn: conn.close()

# ── GET /api/sugestoes/minhas — usuário vê suas sugestões/feedbacks
@app.route('/api/sugestoes/minhas', methods=['GET'])
def minhas_sugestoes():
    try:
        uid = request.args.get('user_id')
        if not uid: return jsonify({'sucesso':False,'mensagem':'user_id obrigatório'}), 400
        conn = get_db_connection()
        rows = conn.execute('SELECT * FROM sugestoes WHERE user_id=? ORDER BY data_criacao DESC',(uid,)).fetchall()
        conn.close()
        return jsonify({'sucesso':True,'sugestoes':[dict(r) for r in rows]}), 200
    except Exception as e:
        return jsonify({'sucesso':False,'mensagem':f'Erro: {e}'}), 500

# ── DELETE /api/sugestao/<id> — usuário exclui própria sugestão pendente ──
@app.route('/api/sugestao/<int:sid>', methods=['DELETE'])
def deletar_sugestao(sid):
    conn = None
    try:
        d = request.get_json(silent=True) or {}
        user_id = d.get('user_id')
        if not user_id:
            return jsonify({'sucesso': False, 'mensagem': 'user_id obrigatório'}), 400
        conn = get_db_connection()
        # Verifica se a sugestão pertence ao usuário e ainda está pendente
        sug = conn.execute(
            'SELECT id, status FROM sugestoes WHERE id=? AND user_id=?',
            (sid, user_id)
        ).fetchone()
        if not sug:
            return jsonify({'sucesso': False, 'mensagem': 'Sugestão não encontrada ou sem permissão'}), 404
        if sug['status'] != 'pendente':
            return jsonify({'sucesso': False, 'mensagem': 'Só é possível excluir sugestões pendentes'}), 400
        conn.execute('DELETE FROM sugestoes WHERE id=?', (sid,))
        conn.commit()
        return jsonify({'sucesso': True, 'mensagem': 'Sugestão excluída!'}), 200
    except Exception as e:
        return jsonify({'sucesso': False, 'mensagem': f'Erro: {e}'}), 500
    finally:
        if conn: conn.close()

# ── GET /api/inscricoes/<trilha_id> — guias inscritos em uma trilha ──
@app.route('/api/inscricoes/<trilha_id>', methods=['GET'])
def guias_inscritos(trilha_id):
    try:
        conn = get_db_connection()
        rows = conn.execute(
            '''SELECT u.id,u.nome,u.username,u.telefone FROM inscricoes i
               JOIN users u ON u.id=i.guia_id WHERE i.trilha_id=?''',(trilha_id,)
        ).fetchall()
        conn.close()
        return jsonify({'sucesso':True,'guias':[dict(r) for r in rows]}), 200
    except Exception as e:
        return jsonify({'sucesso':False,'mensagem':f'Erro: {e}'}), 500

@app.route('/api/guia/<int:guia_id>/inscricoes', methods=['GET'])
def inscricoes_do_guia(guia_id):
    """Retorna todas as trilhas/passeios em que o guia está inscrito."""
    conn = None
    try:
        conn = get_db_connection()
        rows = conn.execute(
            'SELECT trilha_id FROM inscricoes WHERE guia_id=?', (guia_id,)
        ).fetchall()
        return jsonify({'sucesso': True, 'trilhas': [r['trilha_id'] for r in rows]}), 200
    except Exception as e:
        return jsonify({'sucesso': False, 'mensagem': str(e)}), 500
    finally:
        if conn: conn.close()

# ── POST /api/inscricao — guia se inscreve em um passeio ──────────
@app.route('/api/inscricao', methods=['POST'])
def inscrever_guia():
    conn = None
    try:
        d = request.get_json()
        guia_id = d.get('guia_id'); trilha_id = d.get('trilha_id','').strip()
        if not guia_id or not trilha_id:
            return jsonify({'sucesso':False,'mensagem':'guia_id e trilha_id obrigatórios'}), 400
        conn = get_db_connection()
        u = conn.execute('SELECT tipo FROM users WHERE id=?',(guia_id,)).fetchone()
        if not u or u['tipo'] != 'guia':
            return jsonify({'sucesso':False,'mensagem':'Apenas guias podem se inscrever'}), 403
        conn.execute('INSERT INTO inscricoes (guia_id,trilha_id) VALUES(?,?)',(guia_id,trilha_id))
        conn.commit()
        return jsonify({'sucesso':True,'mensagem':'Inscrição realizada!'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'sucesso':False,'mensagem':'Já inscrito neste passeio'}), 400
    except Exception as e:
        return jsonify({'sucesso':False,'mensagem':f'Erro: {e}'}), 500
    finally:
        if conn: conn.close()

# ── DELETE /api/inscricao — guia se desincreve ────────────────────
@app.route('/api/inscricao', methods=['DELETE'])
def desinscrever_guia():
    conn = None
    try:
        d = request.get_json()
        conn = get_db_connection()
        r = conn.execute('DELETE FROM inscricoes WHERE guia_id=? AND trilha_id=?',
                         (d.get('guia_id'), d.get('trilha_id','')))
        conn.commit()
        if r.rowcount == 0: return jsonify({'sucesso':False,'mensagem':'Inscrição não encontrada'}), 404
        return jsonify({'sucesso':True,'mensagem':'Desinscrição realizada!'}), 200
    except Exception as e:
        return jsonify({'sucesso':False,'mensagem':f'Erro: {e}'}), 500
    finally:
        if conn: conn.close()

# ── GET /api/inscricoes/guia/<id> — inscrições de um guia específico
@app.route('/api/inscricoes/guia/<int:guia_id>', methods=['GET'])
def inscricoes_do_guia_por_rota_antiga(guia_id):
    try:
        conn = get_db_connection()
        rows = conn.execute('SELECT trilha_id FROM inscricoes WHERE guia_id=?',(guia_id,)).fetchall()
        conn.close()
        return jsonify({'sucesso':True,'inscricoes':[dict(r) for r in rows]}), 200
    except Exception as e:
        return jsonify({'sucesso':False,'mensagem':f'Erro: {e}'}), 500
    
@app.route('/api/eventos', methods=['GET'])
def listar_eventos():
    try:
        conn = get_db_connection()
        rows = conn.execute('SELECT * FROM eventos ORDER BY data_criacao DESC').fetchall()
        conn.close()
        return jsonify({'sucesso':True,'eventos':[dict(r) for r in rows]}), 200
    except Exception as e:
        return jsonify({'sucesso':False,'mensagem':f'Erro: {e}'}), 500

@app.route('/api/eventos', methods=['POST'])
def criar_evento():
    conn = None
    try:
        d = request.get_json()
        if not all([d.get('titulo'), d.get('data_evento'), d.get('local'), d.get('descricao')]):
            return jsonify({'sucesso':False,'mensagem':'Campos obrigatórios faltando'}), 400
        conn = get_db_connection()
        cur = conn.execute('INSERT INTO eventos (titulo,data_evento,local,descricao,imagem_url,link) VALUES(?,?,?,?,?,?)',
                           (d['titulo'],d['data_evento'],d['local'],d['descricao'],d.get('imagem_url',''),d.get('link','')))
        conn.commit()
        return jsonify({'sucesso':True,'mensagem':'Evento criado!','id':cur.lastrowid}), 201
    except Exception as e:
        return jsonify({'sucesso':False,'mensagem':f'Erro: {e}'}), 500
    finally:
        if conn: conn.close()

@app.route('/api/eventos/<int:eid>', methods=['PUT'])
def editar_evento(eid):
    conn = None
    try:
        d = request.get_json()
        conn = get_db_connection()
        r = conn.execute('UPDATE eventos SET titulo=?,data_evento=?,local=?,descricao=?,imagem_url=?,link=? WHERE id=?',
                         (d.get('titulo'),d.get('data_evento'),d.get('local'),d.get('descricao'),d.get('imagem_url',''),d.get('link',''),eid))
        conn.commit()
        if r.rowcount == 0: return jsonify({'sucesso':False,'mensagem':'Evento não encontrado'}), 404
        return jsonify({'sucesso':True,'mensagem':'Evento atualizado!'}), 200
    except Exception as e:
        return jsonify({'sucesso':False,'mensagem':f'Erro: {e}'}), 500
    finally:
        if conn: conn.close()

@app.route('/api/eventos/<int:eid>', methods=['DELETE'])
def deletar_evento(eid):
    conn = None
    try:
        conn = get_db_connection()
        r = conn.execute('DELETE FROM eventos WHERE id=?',(eid,))
        conn.commit()
        if r.rowcount == 0: return jsonify({'sucesso':False,'mensagem':'Evento não encontrado'}), 404
        return jsonify({'sucesso':True,'mensagem':'Evento removido!'}), 200
    except Exception as e:
        return jsonify({'sucesso':False,'mensagem':f'Erro: {e}'}), 500
    finally:
        if conn: conn.close()

# ── GET /api/passeios ──────────────────────────────────────────
@app.route('/api/passeios', methods=['GET'])
def listar_passeios():
    try:
        conn = get_db_connection()
        rows = conn.execute('SELECT * FROM passeios ORDER BY data_criacao DESC').fetchall()
        conn.close()
        return jsonify({'sucesso': True, 'passeios': [dict(r) for r in rows]}), 200
    except Exception as e:
        return jsonify({'sucesso': False, 'mensagem': f'Erro: {e}'}), 500

# ── POST /api/passeios ─────────────────────────────────────────
@app.route('/api/passeios', methods=['POST'])
def criar_passeio():
    conn = None
    try:
        d = request.get_json()
        if not all([d.get('titulo'), d.get('descricao'), d.get('dificuldade'), d.get('local')]):
            return jsonify({'sucesso': False, 'mensagem': 'Campos obrigatórios faltando'}), 400
        conn = get_db_connection()
        cur = conn.execute(
            'INSERT INTO passeios (titulo,descricao,dificuldade,local,imagem_url,link) VALUES(?,?,?,?,?,?)',
            (d['titulo'], d['descricao'], d['dificuldade'], d['local'],
             d.get('imagem_url', ''), d.get('link', '')))
        conn.commit()
        return jsonify({'sucesso': True, 'mensagem': 'Passeio criado!', 'id': cur.lastrowid}), 201
    except Exception as e:
        return jsonify({'sucesso': False, 'mensagem': f'Erro: {e}'}), 500
    finally:
        if conn: conn.close()

# ── PUT /api/passeios/<id> ───────────────────────────────────────
@app.route('/api/passeios/<int:pid>', methods=['PUT'])
def editar_passeio(pid):
    conn = None
    try:
        d = request.get_json()
        conn = get_db_connection()
        r = conn.execute(
            'UPDATE passeios SET titulo=?,descricao=?,dificuldade=?,local=?,imagem_url=?,link=? WHERE id=?',
            (d.get('titulo'), d.get('descricao'), d.get('dificuldade'), d.get('local'),
             d.get('imagem_url', ''), d.get('link', ''), pid))
        conn.commit()
        if r.rowcount == 0:
            return jsonify({'sucesso': False, 'mensagem': 'Passeio não encontrado'}), 404
        return jsonify({'sucesso': True, 'mensagem': 'Passeio atualizado!'}), 200
    except Exception as e:
        return jsonify({'sucesso': False, 'mensagem': f'Erro: {e}'}), 500
    finally:
        if conn: conn.close()

# ── DELETE /api/passeios/<id> ──────────────────────────────────────
@app.route('/api/passeios/<int:pid>', methods=['DELETE'])
def deletar_passeio(pid):
    conn = None
    try:
        conn = get_db_connection()
        r = conn.execute('DELETE FROM passeios WHERE id=?', (pid,))
        conn.commit()
        if r.rowcount == 0:
            return jsonify({'sucesso': False, 'mensagem': 'Passeio não encontrado'}), 404
        return jsonify({'sucesso': True, 'mensagem': 'Passeio removido!'}), 200
    except Exception as e:
        return jsonify({'sucesso': False, 'mensagem': f'Erro: {e}'}), 500
    finally:
        if conn: conn.close()

# ── GET /api/trilhas/status — retorna quais estão pausadas ──────
@app.route('/api/trilhas/status', methods=['GET'])
def status_trilhas():
    try:
        conn = get_db_connection()
        rows = conn.execute('SELECT trilha_id, pausada FROM trilhas_status').fetchall()
        conn.close()
        return jsonify({'sucesso': True, 'trilhas': {r['trilha_id']: bool(r['pausada']) for r in rows}}), 200
    except Exception as e:
        return jsonify({'sucesso': False, 'mensagem': f'Erro: {e}'}), 500

# ── POST /api/trilha/<id>/pausar — admin pausa ou reativa trilha ──
@app.route('/api/trilha/<trilha_id>/pausar', methods=['POST'])
def pausar_trilha(trilha_id):
    conn = None
    try:
        d      = request.get_json()
        pausar = 1 if d.get('pausar') else 0
        conn   = get_db_connection()
        conn.execute(
            'INSERT OR REPLACE INTO trilhas_status (trilha_id, pausada) VALUES (?, ?)',
            (trilha_id, pausar)
        )
        conn.commit()
        acao = 'pausada' if pausar else 'reativada'
        return jsonify({'sucesso': True, 'mensagem': f'Trilha {acao}!'}), 200
    except Exception as e:
        return jsonify({'sucesso': False, 'mensagem': f'Erro: {e}'}), 500
    finally:
        if conn: conn.close()

# ── GET /api/passeios/<id>/guias — guias inscritos num passeio ──
@app.route('/api/passeios/<int:pid>/guias', methods=['GET'])
def guias_do_passeio(pid):
    try:
        conn = get_db_connection()
        rows = conn.execute(
            '''SELECT u.id, u.nome, u.username, u.telefone
               FROM inscricoes i
               JOIN users u ON u.id = i.guia_id
               WHERE i.trilha_id = ?''',
            (str(pid),)
        ).fetchall()
        conn.close()
        return jsonify({'sucesso': True, 'guias': [dict(r) for r in rows]}), 200
    except Exception as e:
        return jsonify({'sucesso': False, 'mensagem': f'Erro: {e}'}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'message': 'Servidor rodando'}), 200

if __name__ == '__main__':
    init_db()
    print("\nIniciando servidor Flask...")
    print("Acesse: http://localhost:5000")
    print(" API de Cadastro: POST /api/cadastro")
    print(" API de Login: POST /api/login")
    print(" Listar Usuários: GET /api/usuarios\n")
    app.run(debug=True, port=5000, host='0.0.0.0')
