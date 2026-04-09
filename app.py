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

# Criar banco de dados e tabela se não existirem
def init_db():
    if not os.path.exists(DATABASE):
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                telefone TEXT NOT NULL,
                username TEXT NOT NULL UNIQUE,
                senha TEXT NOT NULL,
                data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
        conn.close()
        print("✓ Banco de dados criado com sucesso!")

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
    try:
        data = request.get_json()
        
        # Validar campos obrigatórios
        nome = data.get('nome', '').strip()
        email = data.get('email', '').strip()
        telefone = data.get('telefone', '').strip()
        username = data.get('username', '').strip()
        senha = data.get('senha', '').strip()
        confirmar_senha = data.get('confirmar_senha', '').strip()
        
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
        
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO users (nome, email, telefone, username, senha)
                VALUES (?, ?, ?, ?, ?)
            ''', (nome, email, telefone, username, senha_criptografada))
            
            conn.commit()
            conn.close()
            
            return jsonify({
                'sucesso': True, 
                'mensagem': 'Cadastro realizado com sucesso! Agora faça login.'
            }), 201
            
        except sqlite3.IntegrityError as e:
            if 'email' in str(e):
                return jsonify({'sucesso': False, 'mensagem': 'Este email já está cadastrado'}), 400
            elif 'username' in str(e):
                return jsonify({'sucesso': False, 'mensagem': 'Este usuário já existe'}), 400
            else:
                return jsonify({'sucesso': False, 'mensagem': 'Erro ao cadastrar usuário'}), 400
                
    except Exception as e:
        return jsonify({'sucesso': False, 'mensagem': f'Erro no servidor: {str(e)}'}), 500

@app.route('/api/login', methods=['POST'])
def login():
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
            SELECT id, nome, email, username FROM users
            WHERE username = ? AND senha = ?
        ''', (username, senha_criptografada))
        
        user = cursor.fetchone()
        conn.close()
        
        if user:
            return jsonify({
                'sucesso': True,
                'mensagem': 'Login realizado com sucesso!',
                'usuario': {
                    'id': user['id'],
                    'nome': user['nome'],
                    'email': user['email'],
                    'username': user['username']
                }
            }), 200
        else:
            return jsonify({'sucesso': False, 'mensagem': 'Usuário ou senha incorretos'}), 401
            
    except Exception as e:
        return jsonify({'sucesso': False, 'mensagem': f'Erro no servidor: {str(e)}'}), 500

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

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'message': 'Servidor rodando'}), 200

if __name__ == '__main__':
    init_db()
    print("\n🚀 Iniciando servidor Flask...")
    print("📍 Acesse: http://localhost:5000")
    print("🔗 API de Cadastro: POST /api/cadastro")
    print("🔗 API de Login: POST /api/login")
    print("🔗 Listar Usuários: GET /api/usuarios\n")
    app.run(debug=True, port=5000, host='0.0.0.0')
