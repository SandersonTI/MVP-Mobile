/**
 * sugestaoCards.js — TerêVerde Online
 * Permite turistas e guias enviarem sugestões de passeios
 * e visualizarem o feedback do administrador.
 */
// Variável global que armazena a foto em base64
// enquanto o formulário está aberto
let fotoBase64Sugestao = '';
/**
 * Monta e injeta o formulário + lista de sugestões do usuário.
 * Chamada por script.js ao abrir a aba "Sugestões".
 */
function renderizarSugestoes() {
    const container = document.getElementById('sugestoes-container');
    if (!container) return;
    const usuario = getUsuarioLogado();
    // Admin não acessa esta aba; usuário deslogado também não
    if (!usuario || usuario.tipo === 'admin') {
        container.innerHTML = `
            <div class="sugestao-aviso">
                <p>🔒 Faça login como <strong>turista</strong> ou
                   <strong>guia</strong> para enviar sugestões.</p>
                <button class="btn acessobtn"
                        onclick="abrirModalLogin()">Fazer Login</button>
            </div>`;
        return;
    }
    // Monta formulário + seção "Minhas Sugestões"
    container.innerHTML = `
    <div class="sugestao-wrapper">
        <!-- Formulário de envio de sugestão -->
        <div class="sugestao-form-card">
            <h3>💡 Sugerir Novo Passeio</h3>
            <p class="sugestao-instrucao">
                Conhece um local incrível que ainda não está no Terê Verde?
                Envie abaixo para avaliação do administrador!
            </p>
            <div class="sugestao-form-campos">
                <label>Nome do Local *</label>
                <input id="sug-nome" type="text" class="admin-input"
                       placeholder="Ex: Cachoeira do Segredo">
                <label>Nível de Dificuldade *</label>
                <select id="sug-dificuldade" class="admin-input">
                    <option value="">-- Selecione --</option>
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                </select>
                <label>Localização / Como Chegar *</label>
                <input id="sug-local" type="text" class="admin-input"
                       placeholder="Ex: Estrada da Granja, km 3">
                <label>Descrição *</label>
                <textarea id="sug-descricao" class="admin-input admin-textarea"
                          placeholder="Descreva o local: acesso, atrativos..."
                          style="min-height:100px; resize:vertical;"></textarea>
                <label>Link externo (opcional)</label>
                <input id="sug-link" type="text" class="admin-input"
                       placeholder="https://...">
                <label>Foto do Local (opcional)</label>
                <input type="file" id="sug-foto" accept="image/*" class="admin-input"
                       onchange="processarFotoSugestao(this)">
                <div id="sug-preview" class="foto-preview"></div>
            </div>
            <button class="btn-admin-acao" onclick="enviarSugestao()">
                📤 Enviar Sugestão
            </button>
        </div>
        <!-- Lista de sugestões do usuário com feedbacks -->
        <div class="minhas-sugestoes-section">
            <h3>📋 Minhas Sugestões</h3>
            <!-- Preenchida por carregarMinhasSugestoes() -->
            <div id="lista-minhas-sugestoes">
                <p style="color:#888;">Carregando...</p>
            </div>
        </div>
    </div>`;
    // Carrega as sugestões do usuário assim que o formulário aparece
    carregarMinhasSugestoes(usuario.id);
}

/**
 * Lê o arquivo de imagem e converte para string base64.
 * Chamada pelo onchange do input file (linha 64).
 * @param {HTMLInputElement} input
 */
function processarFotoSugestao(input) {
    const preview = document.getElementById('sug-preview');
    // Se nenhum arquivo foi selecionado, limpa tudo
    if (!input.files || !input.files[0]) {
        fotoBase64Sugestao = '';
        preview.innerHTML  = '';
        return;
   }
   const reader = new FileReader();
   // Quando terminar de ler o arquivo:
   reader.onload = function (e) {
       // e.target.result = "data:image/png;base64,iVBORw0..."
       fotoBase64Sugestao = e.target.result;
       // Mostra preview da imagem escolhida
       preview.innerHTML = `<img src="${fotoBase64Sugestao}"
                                 alt="Preview" class="foto-preview-img">`;
   };
   reader.readAsDataURL(input.files[0]);
}

/** Coleta o formulário e envia POST /api/sugestao. */
async function enviarSugestao() {
    const usuario     = getUsuarioLogado();
  const nome_local  = document.getElementById('sug-nome').value.trim();
    const dificuldade = document.getElementById('sug-dificuldade').value;
    const descricao   = document.getElementById('sug-descricao').value.trim();
    const local       = document.getElementById('sug-local') ? document.getElementById('sug-local').value.trim() : '';
    const link        = document.getElementById('sug-link')  ? document.getElementById('sug-link').value.trim()  : '';
    if (!nome_local || !dificuldade || !descricao) {
        alert('⚠️ Preencha todos os campos obrigatórios.');
        return;
    }
    try {
        const res = await fetch(`${API_URL}/sugestao`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id:     usuario.id,
                nome_local,
                descricao,
                dificuldade,
                local,
                link,
                foto_base64: fotoBase64Sugestao
            })
        });
        const data = await res.json();
        if (data.sucesso) {
            alert('✓ ' + data.mensagem);
            // Limpa o formulário após envio
            document.getElementById('sug-nome').value        = '';
            document.getElementById('sug-dificuldade').value = '';
            document.getElementById('sug-descricao').value   = '';
            document.getElementById('sug-foto').value        = '';
            document.getElementById('sug-preview').innerHTML = '';
            fotoBase64Sugestao = '';  // reseta a variável global
            // Recarrega a lista de sugestões para mostrar a nova
            carregarMinhasSugestoes(usuario.id);
        } else {
            alert('✗ ' + data.mensagem);
        }
    } catch (e) {
        alert('Erro ao conectar ao servidor: ' + e.message);
    }
}

/**
 * Busca as sugestões do usuário logado e exibe o feedback do admin.
 * O campo 'justificativa' aparece quando status === 'reprovada'.
 * @param {number} userId  ID do usuário logado
 */
async function carregarMinhasSugestoes(userId) {
    const lista = document.getElementById('lista-minhas-sugestoes');
    if (!lista) return;
    try {
        const res  = await fetch(`${API_URL}/sugestoes/minhas?user_id=${userId}`);
        const data = await res.json();
        if (!data.sucesso || data.sugestoes.length === 0) {
            lista.innerHTML = '<p style="color:#888;">Nenhuma sugestão enviada ainda.</p>';
            return;
        }
        lista.innerHTML = data.sugestoes.map(s => {
            // Cor e ícone por status
            const corStatus = {
                pendente:  '#f1c40f',   // amarelo
                aprovada:  '#27ae60',   // verde
                reprovada: '#c0392b'    // vermelho
            }[s.status] || '#aaa';
            const iconeStatus = {
                pendente:  '⏳',
                aprovada:  '✅',
                reprovada: '❌'
            }[s.status] || '•';
            // Caixa de feedback: aparece quando o admin reprovA e preenche justificativa
            const feedbackHtml = s.justificativa
                ? `<div class="feedback-admin">
                       <strong>💬 Feedback do Administrador:</strong>
                       <p>${s.justificativa}</p>
                   </div>`
                : '';  // nenhuma mensagem se não há justificativa
            // Preview da foto, se o usuário enviou uma
            const fotoHtml = s.foto_base64
                ? `<img src="${s.foto_base64}" alt="${s.nome_local}"
                         class="sugestao-foto-mini">`
                : '';
            // Botão de exclusão — só para sugestões pendentes
            const btnExcluir = s.status === 'pendente' ? `
                <button onclick="excluirSugestao(${s.id})"
                    style="margin-top:.6rem; background:#c0392b; color:#fff;
                           border:none; border-radius:6px; padding:.35rem .9rem;
                           cursor:pointer; font-size:.82rem;">
                    🗑️ Excluir
                </button>` : '';

            return `
            <div class="minha-sugestao-card">
                <div class="minha-sug-header">
                    ${fotoHtml}
                    <div class="minha-sug-meta">
                        <strong>${s.nome_local}</strong>
                        <span class="badge-dificuldade" style="margin-left:.5rem;">${s.dificuldade}</span>
                        <span style="background:${corStatus}; color:#fff;
                               padding:2px 8px; border-radius:12px;
                               font-size:.8em; margin-left:.5rem;">
                            ${iconeStatus} ${s.status.toUpperCase()}
                        </span>
                    </div>
                </div>
                <p class="minha-sug-desc">${s.descricao}</p>
                <small style="color:#b0d48a;">
                    Enviado em: ${new Date(s.data_criacao).toLocaleDateString('pt-BR')}
                </small>
                ${feedbackHtml}
                ${btnExcluir}
            </div>`;
        }).join('');
    } catch (e) {
        lista.innerHTML = '<p style="color:#c0392b;">Erro ao carregar sugestões.</p>';
    }
}

/** Exclui sugestão pendente do usuário logado */
async function excluirSugestao(sugestaoId) {
    if (!confirm('Excluir esta sugestão?')) return;
    const usuario = getUsuarioLogado();
    if (!usuario) return;
    try {
        const res  = await fetch(`${API_URL}/sugestao/${sugestaoId}`, {
            method:  'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ user_id: usuario.id })
        });
        const data = await res.json();
        if (data.sucesso) {
            alert('✓ ' + data.mensagem);
            carregarMinhasSugestoes(usuario.id);
        } else {
            alert('✗ ' + data.mensagem);
        }
    } catch (e) {
        alert('Erro ao conectar ao servidor: ' + e.message);
    }
}