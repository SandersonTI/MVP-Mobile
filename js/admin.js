/**
 * admin.js — TerêVerde Online
 * Painel exclusivo do Administrador.
 * Funcionalidades:
 *  - Gerenciar Eventos (criar, editar, remover)
 *  - Revisar Sugestões (aprovar / reprovar com justificativa)
 */
// ── Renderização do Painel Admin ──────────────────────────────────
/**
 * Monta o HTML completo do painel e injeta no #admin-container.
 * Chamado por script.js quando a aba Admin é aberta (Passo 13).
 */
function renderizarPainelAdmin() {
    const container = document.getElementById('admin-container');
    if (!container) return;
    // Verifica se o usuário logado é realmente admin
    // getUsuarioLogado() → definida em login.js
    const usuario = getUsuarioLogado();
    if (!usuario || usuario.tipo !== 'admin') {
        container.innerHTML = '<p style="color:red;">Acesso restrito ao administrador.</p>';
        return;
    }
    // Injeta o HTML do painel com duas abas internas: Eventos e Sugestões
    container.innerHTML = `
    <div class="admin-painel">
        <h2 style="color:var(--secundary); margin-bottom:1.5rem;">
            ⚙️ Painel do Administrador
        </h2>
        <!-- Abas internas: Eventos | Sugestões -->
        <div class="admin-tabs">
            <button class="admin-tab-btn active"
                    onclick="mostrarSecaoAdmin('eventos', this)">
                📅 Eventos
            </button>
            <button class="admin-tab-btn"
                    onclick="mostrarSecaoAdmin('sugestoes', this)">
                💡 Sugestões
            </button>
        </div>
        <!-- Seção Eventos (visível por padrão) -->
        <div id="admin-sec-eventos" class="admin-secao">
            <div class="admin-card-form">
                <h3>Adicionar Novo Evento</h3>
                <div class="admin-form-grid">
                    <input id="ev-titulo" type="text"
                           placeholder="Título do evento *" class="admin-input">
                    <input id="ev-data" type="text"
                           placeholder="Data (ex: 12 a 28 de Julho) *" class="admin-input">
                    <input id="ev-local" type="text"
                           placeholder="Local *" class="admin-input">
                    <input id="ev-imagem" type="text"
                           placeholder="URL da imagem (opcional)" class="admin-input">
                    <input id="ev-link" type="text"
                           placeholder="Link externo (opcional)" class="admin-input">
                    <textarea id="ev-descricao"
                              placeholder="Descrição do evento *"
                              class="admin-input admin-textarea"></textarea>
                </div>
                <button class="btn-admin-acao"
                        onclick="criarEvento()">✚ Criar Evento</button>
            </div>
            <h3 style="margin:1.5rem 0 0.75rem; color:var(--secundary);">
                Eventos Cadastrados
            </h3>
            <!-- Preenchida por carregarEventosAdmin() -->
            <div id="admin-lista-eventos" class="admin-lista">
                <p style="color:#ccc;">Carregando eventos...</p>
            </div>
        </div>
        <!-- Seção Sugestões (oculta por padrão) -->
        <div id="admin-sec-sugestoes" class="admin-secao" style="display:none;">
            <!-- Filtros por status -->
            <div class="admin-filtros">
                <button class="btn-filtro active"
                        onclick="filtrarSugestoes('pendente', this)">⏳ Pendentes</button>
                <button class="btn-filtro"
                        onclick="filtrarSugestoes('aprovada', this)">✅ Aprovadas</button>
                <button class="btn-filtro"
                        onclick="filtrarSugestoes('reprovada', this)">❌ Reprovadas</button>
                <button class="btn-filtro"
                        onclick="filtrarSugestoes('', this)">📋 Todas</button>
            </div>
            <!-- Preenchida por carregarSugestoesAdmin() -->
            <div id="admin-lista-sugestoes" class="admin-lista">
                <p style="color:#ccc;">Carregando sugestões...</p>
            </div>
        </div>
    </div>`;
    // Carrega dados de ambas as seções ao abrir o painel
    carregarEventosAdmin();
   carregarSugestoesAdmin('pendente');
}

/**
 * Alterna a seção visível dentro do painel admin.
 * @param {string}      secao  'eventos' | 'sugestoes'
 * @param {HTMLElement} btn    Botão clicado (recebe classe 'active')
 */
function mostrarSecaoAdmin(secao, btn) {
    // Oculta todas as seções
    document.querySelectorAll('.admin-secao')
            .forEach(el => el.style.display = 'none');
    // Remove destaque de todos os botões de aba
    document.querySelectorAll('.admin-tab-btn')
            .forEach(b => b.classList.remove('active'));
    // Exibe a seção escolhida e destaca o botão
    const alvo = document.getElementById(`admin-sec-${secao}`);
    if (alvo) alvo.style.display = 'block';
    if (btn)  btn.classList.add('active');
}

// ── Eventos ──────────────────────────────────────────────────────
/** Busca e renderiza eventos do BD no painel admin. */
async function carregarEventosAdmin() {
    const lista = document.getElementById('admin-lista-eventos');
    if (!lista) return;
    try {
        const res  = await fetch(`${API_URL}/eventos`);
        const data = await res.json();
        if (!data.sucesso || data.eventos.length === 0) {
            lista.innerHTML = '<p style="color:#ccc;">Nenhum evento ainda.</p>';
            return;
        }
        // Para cada evento cria um card com botões Editar e Remover
        lista.innerHTML = data.eventos.map(ev => `
            <div class="admin-item-card" id="ev-item-${ev.id}">
                <div class="admin-item-info">
                    <strong>${ev.titulo}</strong>
                    <span class="admin-item-detalhe">
                        📅 ${ev.data_evento} · 📍 ${ev.local}
                    </span>
                    <p>${ev.descricao}</p>
                    ${ev.link
                        ? `<a href="${ev.link}" target="_blank"
                              rel="noopener" class="admin-link">🔗 Link</a>`
                        : ''}
                </div>
                <div class="admin-item-acoes">
                    <button class="btn-admin-editar"
                            onclick="iniciarEdicaoEvento(${ev.id})">
                        ✏️ Editar
                    </button>
                    <button class="btn-admin-remover"
                            onclick="removerEvento(${ev.id})">
                        🗑️ Remover
                    </button>
                </div>
            </div>`
        ).join('');
    } catch (e) {
        lista.innerHTML = '<p style="color:#c0392b;">Erro ao carregar eventos.</p>';
    }
}
/** Lê o formulário e envia POST /api/eventos para criar evento. */
async function criarEvento() {
    const titulo    = document.getElementById('ev-titulo').value.trim();
    const data_ev   = document.getElementById('ev-data').value.trim();
    const local     = document.getElementById('ev-local').value.trim();
    const descricao = document.getElementById('ev-descricao').value.trim();
    const imagem    = document.getElementById('ev-imagem').value.trim();
    const link      = document.getElementById('ev-link').value.trim();
    // Validação mínima antes de chamar a API
    if (!titulo || !data_ev || !local || !descricao) {
        alert('⚠️ Preencha: título, data, local e descrição.');
        return;
    }
    try {
        const res  = await fetch(`${API_URL}/eventos`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                titulo,
                data_evento: data_ev,
                local,
                descricao,
                imagem_url: imagem,
                link
            })
        });
        const data = await res.json();
        if (data.sucesso) {
            alert('✓ ' + data.mensagem);
            // Limpa os campos do formulário
            ['ev-titulo','ev-data','ev-local','ev-descricao','ev-imagem','ev-link']
                .forEach(id => document.getElementById(id).value = '');
            // Atualiza lista no painel admin
            carregarEventosAdmin();
            // Atualiza também a aba pública de Eventos
            if (typeof carregarEventosDinamicos === 'function') carregarEventosDinamicos();
        } else {
            alert('✗ ' + data.mensagem);
        }
    } catch (e) {
        alert('Erro ao conectar ao servidor.');
    }
}
/**
 * Substitui o card do evento por um formulário de edição inline.
 * @param {number} eventoId  ID do evento a editar
 */
async function iniciarEdicaoEvento(eventoId) {
    // Busca dados atuais do evento diretamente do backend
    const res  = await fetch(`${API_URL}/eventos`);
    const data = await res.json();
    const ev   = data.eventos.find(e => e.id === eventoId);
    if (!ev) return;
    // Referencia o card pelo ID dinâmico: "ev-item-{id}"
    const card = document.getElementById(`ev-item-${eventoId}`);
    if (!card) return;
    // Substitui o conteúdo do card pelo formulário de edição
    card.innerHTML = `
        <div class="admin-form-edicao">
            <input id="edit-titulo-${ev.id}" value="${ev.titulo}"
                   class="admin-input" placeholder="Título">
            <input id="edit-data-${ev.id}" value="${ev.data_evento}"
                   class="admin-input" placeholder="Data">
            <input id="edit-local-${ev.id}" value="${ev.local}"
                   class="admin-input" placeholder="Local">
            <input id="edit-imagem-${ev.id}" value="${ev.imagem_url || ''}"
                   class="admin-input" placeholder="URL imagem">
            <input id="edit-link-${ev.id}" value="${ev.link || ''}"
                   class="admin-input" placeholder="Link">
            <textarea id="edit-desc-${ev.id}"
                      class="admin-input admin-textarea">${ev.descricao}</textarea>
            <div style="display:flex; gap:.5rem; margin-top:.5rem;">
                <button class="btn-admin-acao"
                        onclick="salvarEdicaoEvento(${ev.id})">💾 Salvar</button>
                <button class="btn-admin-remover"
                        onclick="carregarEventosAdmin()">✕ Cancelar</button>
            </div>
        </div>`;
}
/**
 * Coleta os campos do formulário inline e envia PUT /api/eventos/id.
 * @param {number} eventoId
 */
async function salvarEdicaoEvento(eventoId) {
    const body = {
        titulo:      document.getElementById(`edit-titulo-${eventoId}`).value.trim(),
        data_evento: document.getElementById(`edit-data-${eventoId}`).value.trim(),
        local:       document.getElementById(`edit-local-${eventoId}`).value.trim(),
        descricao:   document.getElementById(`edit-desc-${eventoId}`).value.trim(),
        imagem_url:  document.getElementById(`edit-imagem-${eventoId}`).value.trim(),
        link:        document.getElementById(`edit-link-${eventoId}`).value.trim()
    };
    try {
        const res  = await fetch(`${API_URL}/eventos/${eventoId}`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(body)
        });
        const data = await res.json();
        alert(data.sucesso ? '✓ ' + data.mensagem : '✗ ' + data.mensagem);
        carregarEventosAdmin();   // atualiza painel
        if (typeof carregarEventosDinamicos === 'function') carregarEventosDinamicos();
    } catch (e) { alert('Erro ao salvar evento.'); }
}
/**
 * Remove evento após confirmação. Chama DELETE /api/eventos/id.
 * @param {number} eventoId
 */
async function removerEvento(eventoId) {
    if (!confirm('Remover este evento?')) return;
    try {
        const res  = await fetch(`${API_URL}/eventos/${eventoId}`, { method: 'DELETE' });
        const data = await res.json();
        alert(data.sucesso ? '✓ ' + data.mensagem : '✗ ' + data.mensagem);
        carregarEventosAdmin();
        if (typeof carregarEventosDinamicos === 'function') carregarEventosDinamicos();
    } catch (e) { alert('Erro ao remover evento.'); }
}

// ── Sugestões ─────────────────────────────────────────────────────
/**
 * Busca sugestões do BD e renderiza na lista admin.
 * @param {string} status 'pendente'|'aprovada'|'reprovada'|'' (todas)
 */
async function carregarSugestoesAdmin(status = 'pendente') {
    const lista = document.getElementById('admin-lista-sugestoes');
    if (!lista) return;
    lista.innerHTML = '<p style="color:#ccc;">Carregando...</p>';
    try {
        // Monta a URL com filtro opcional: ?status=pendente
        const url  = status ? `${API_URL}/sugestoes?status=${status}` : `${API_URL}/sugestoes`;
        const res  = await fetch(url);
        const data = await res.json();
        if (!data.sucesso || data.sugestoes.length === 0) {
            lista.innerHTML = `<p style="color:#ccc;">Nenhuma sugestão encontrada.</p>`;
            return;
        }
        lista.innerHTML = data.sugestoes.map(s => {
            // Cor do badge de status
            const corStatus = {
                pendente:  '#f1c40f',
                aprovada:  '#27ae60',
                reprovada: '#c0392b'
            }[s.status] || '#aaa';
            // Foto da sugestão ou placeholder
            const fotoHtml = s.foto_base64
                ? `<img src="${s.foto_base64}" class="sugestao-foto">`
                : '<span class="sem-foto">Sem foto</span>';
            // Botões Aprovar / Reprovar — só aparecem para status 'pendente'
            const botoesRevisao = s.status === 'pendente' ? `
                <div class="revisao-form">
                    <button class="btn-aprovar"
                            onclick="aprovarSugestao(${s.id})">✅ Aprovar</button>
                    <div class="reprovar-area">
                        <!-- Campo obrigatório para reprovar -->
                        <textarea id="just-${s.id}"
                                  class="admin-input admin-textarea-sm"
                                  placeholder="Justificativa obrigatória..."></textarea>
                        <button class="btn-reprovar"
                                onclick="reprovarSugestao(${s.id})">❌ Reprovar</button>
                    </div>
                </div>` : '';
            // Justificativa visível apenas quando status = 'reprovada'
            const justHtml = s.justificativa
                ? `<p class="justificativa-admin">
                       <strong>Justificativa:</strong> ${s.justificativa}</p>`
                : '';
            return `
            <div class="admin-item-card sugestao-card" id="sug-item-${s.id}">
                <div class="sugestao-header">
                    ${fotoHtml}
                    <div class="sugestao-meta">
                        <strong class="sugestao-nome">${s.nome_local}</strong>
                        <span class="badge-dificuldade-admin">${s.dificuldade}</span>
                        <span style="background:${corStatus}; color:#fff;
                               padding:2px 8px; border-radius:12px; font-size:.8em;">
                            ${s.status.toUpperCase()}
                        </span>
                    </div>
                </div>
                <p class="sugestao-desc">${s.descricao}</p>
                <p class="sugestao-autor">
                    Enviado por: <strong>${s.autor_nome}</strong>
                    (@${s.autor_username}) — ${s.autor_tipo}
                    &nbsp;·&nbsp;
                    ${new Date(s.data_criacao).toLocaleDateString('pt-BR')}
                </p>
                ${justHtml}
                ${botoesRevisao}
            </div>`;
        }).join('');
    } catch (e) {
        lista.innerHTML = '<p style="color:#c0392b;">Erro ao carregar sugestões.</p>';
    }
}
/** Atualiza filtro ativo e recarrega sugestões com o status escolhido. */
function filtrarSugestoes(status, btn) {
    document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    carregarSugestoesAdmin(status);
}
/** Aprova sugestão — POST /api/sugestao/id/revisar {decisao:'aprovada'} */
async function aprovarSugestao(sugestaoId) {
    if (!confirm('Aprovar esta sugestão?')) return;
    try {
        const res  = await fetch(`${API_URL}/sugestao/${sugestaoId}/revisar`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ decisao: 'aprovada', justificativa: '' })
        });
        const data = await res.json();
        alert(data.sucesso ? '✅ ' + data.mensagem : '✗ ' + data.mensagem);
        carregarSugestoesAdmin('pendente');  // volta para aba de pendentes
    } catch (e) { alert('Erro ao aprovar sugestão.'); }
}
/**
 * Reprova sugestão com justificativa obrigatória.
 * O autor verá a justificativa na aba Sugestões (sugestaoCards.js).
 */
async function reprovarSugestao(sugestaoId) {
    // Lê o campo de justificativa pelo ID dinâmico: "just-{id}"
    const justEl = document.getElementById(`just-${sugestaoId}`);
    const just   = justEl ? justEl.value.trim() : '';
    // Bloqueia reprovação sem justificativa
    if (!just) {
        alert('⚠️ A justificativa é obrigatória para reprovar. O autor será notificado.');
        return;
    }
    if (!confirm('Reprovar e notificar o autor?')) return;
    try {
        const res  = await fetch(`${API_URL}/sugestao/${sugestaoId}/revisar`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ decisao: 'reprovada', justificativa: just })
        });
        const data = await res.json();
        alert(data.sucesso ? '❌ ' + data.mensagem : '✗ ' + data.mensagem);
        carregarSugestoesAdmin('pendente');
    } catch (e) { alert('Erro ao reprovar sugestão.'); }
}