// Base64 da foto de evento carregada via input file
let fotoBase64Evento = '';

/**
 * admin.js — TerêVerde Online
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
            <button class="admin-tab-btn active" onclick="mostrarSecaoAdmin('eventos', this)">📅 Eventos</button>
            <button class="admin-tab-btn" onclick="mostrarSecaoAdmin('passeios', this)">🥾 Passeios</button>
            <button class="admin-tab-btn" onclick="mostrarSecaoAdmin('guias', this)">🧭 Guias</button>
            <button class="admin-tab-btn" onclick="mostrarSecaoAdmin('trilhas', this)">🗺️ Trilhas</button>
            <button class="admin-tab-btn" onclick="mostrarSecaoAdmin('sugestoes', this)">💡 Sugestões</button>
        </div>
        <!-- Seção Eventos (visível por padrão) -->
        <div id="admin-sec-eventos" class="admin-secao">
            <div class="admin-card-form">
            <!-- Cabeçalho com logo — igual ao modal de login -->
            <div style="text-align:center; margin-bottom:1.2rem;">
                <img src="img/identidade_visual/Icone-TereVerde2.svg"
                     alt="Logo" style="width:60px; height:60px;">
                <h3 style="color:var(--secundary); margin-top:.5rem;">Adicionar Novo Evento</h3>
            </div>
            <div class="admin-form-grid">
                <input id="ev-titulo" type="text"
                       placeholder="Título do evento *" class="admin-input">
                <input id="ev-data" type="text"
                       placeholder="Data (ex: 12 a 28 de Julho) *" class="admin-input">
                <input id="ev-local" type="text"
                       placeholder="Local *" class="admin-input">
                <!-- Opção de URL OU upload de foto -->
                <label style="color:#ccc; font-size:.85rem;">Imagem — URL ou carregue um arquivo:</label>
                <input id="ev-imagem" type="text"
                       placeholder="URL da imagem (opcional)" class="admin-input"
                       oninput="document.getElementById('ev-foto').value=''">
                <input id="ev-foto" type="file" accept="image/*" class="admin-input"
                       onchange="processarFotoEvento(this)">
                <div id="ev-foto-preview" class="foto-preview"></div>
                <input id="ev-link" type="text"
                       placeholder="Link externo (opcional)" class="admin-input">
                <!-- Descrição maior -->
                <textarea id="ev-descricao"
                          placeholder="Descrição do evento *"
                          class="admin-input admin-textarea"
                          style="min-height:120px; resize:vertical;"></textarea>
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

        <!-- Seção Passeios (oculta por padrão) -->
        <div id="admin-sec-passeios" class="admin-secao" style="display:none;">
            <div class="admin-card-form">
                <div style="text-align:center; margin-bottom:1.2rem;">
                    <img src="img/identidade_visual/Icone-TereVerde2.svg"
                         alt="Logo" style="width:60px; height:60px;">
                    <h3 style="color:var(--secundary); margin-top:.5rem;">Adicionar Novo Passeio</h3>
                </div>
                <div class="admin-form-grid">
                    <input id="ps-titulo" type="text" placeholder="Título do passeio *" class="admin-input">
                    <select id="ps-dificuldade" class="admin-input">
                        <option value="">-- Dificuldade *--</option>
                        <option value="Baixa">Baixa</option>
                        <option value="Média">Média</option>
                        <option value="Alta">Alta</option>
                    </select>
                    <input id="ps-local" type="text" placeholder="Local *" class="admin-input">
                    <label style="color:#ccc; font-size:.85rem;">Imagem — URL ou carregue um arquivo:</label>
                    <input id="ps-imagem" type="text" placeholder="URL da imagem (opcional)" class="admin-input">
                    <input id="ps-foto" type="file" accept="image/*" class="admin-input"
                           onchange="processarFotoPasseio(this)">
                    <div id="ps-foto-preview" class="foto-preview"></div>
                    <input id="ps-link" type="text" placeholder="Link externo (opcional)" class="admin-input">
                    <textarea id="ps-descricao" placeholder="Descrição do passeio *"
                              class="admin-input admin-textarea" style="min-height:120px; resize:vertical;"></textarea>
                </div>
                <button class="btn-admin-acao" onclick="criarPasseio()">✚ Criar Passeio</button>
            </div>
            <h3 style="margin:1.5rem 0 0.75rem; color:var(--secundary);">Passeios Cadastrados</h3>
            <div id="admin-lista-passeios" class="admin-lista">
                <p style="color:#ccc;">Carregando passeios...</p>
            </div>
        </div>

        <!-- Seção Guias (oculta por padrão) -->
        <div id="admin-sec-guias" class="admin-secao" style="display:none;">
            <h3 style="color:var(--secundary); margin-bottom:1rem;">🧭 Guias Cadastrados</h3>
            <div class="admin-filtros">
                <button class="btn-filtro active" onclick="filtrarGuias('pendente', this)">⏳ Pendentes</button>
                <button class="btn-filtro" onclick="filtrarGuias('ativo', this)">✅ Aprovados</button>
                <button class="btn-filtro" onclick="filtrarGuias('reprovado', this)">❌ Reprovados</button>
                <button class="btn-filtro" onclick="filtrarGuias('', this)">📋 Todos</button>
            </div>
            <div id="admin-lista-guias" class="admin-lista">
                <p style="color:#ccc;">Carregando guias...</p>
            </div>
        </div>

        <!-- Seção Trilhas (oculta por padrão) -->
        <div id="admin-sec-trilhas" class="admin-secao" style="display:none;">
            <h3 style="color:var(--secundary); margin-bottom:1rem;">🗺️ Gerenciar Trilhas dos Parques</h3>
            <p style="color:#ccc; font-size:.88rem; margin-bottom:1rem;">
                Pausar uma trilha a oculta da aba pública de Parques.
            </p>
            <div id="admin-lista-trilhas" class="admin-lista">
                <p style="color:#ccc;">Carregando trilhas...</p>
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
    carregarPasseiosAdmin();
    carregarGuiasAdmin('pendente');
    carregarTrilhasAdmin();
    carregarSugestoesAdmin('pendente');
}
/** Converte arquivo de imagem do evento em base64 para preview/envio */
function processarFotoEvento(input) {
    const preview = document.getElementById('ev-foto-preview');
    if (!input.files || !input.files[0]) {
        fotoBase64Evento = '';
        if (preview) preview.innerHTML = '';
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        fotoBase64Evento = e.target.result;
        if (preview) {
            preview.innerHTML = `<img src="${fotoBase64Evento}"
                alt="Preview" class="foto-preview-img">`;
        }
        // Limpa o campo URL ao usar arquivo
        const urlInput = document.getElementById('ev-imagem');
        if (urlInput) urlInput.value = '';
    };
    reader.readAsDataURL(input.files[0]);
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
    // Usa foto carregada via arquivo; se vazia, usa URL digitada
    const imagemUrl = fotoBase64Evento || document.getElementById('ev-imagem').value.trim();
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
                imagem_url: imagemUrl,
                link
            })
        });
        const data = await res.json();
        if (data.sucesso) {
            alert('✓ ' + data.mensagem);
            // Limpa os campos do formulário
            ['ev-titulo','ev-data','ev-local','ev-descricao','ev-imagem','ev-link','ev-foto']
                .forEach(id => { const el = document.getElementById(id); if(el) el.value = ''; });
            fotoBase64Evento = '';
            const prev = document.getElementById('ev-foto-preview');
            if (prev) prev.innerHTML = '';
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

// ── Passeios ──────────────────────────────────────────────────
let fotoBase64Passeio = '';

function processarFotoPasseio(input) {
    const preview = document.getElementById('ps-foto-preview');
    if (!input.files || !input.files[0]) { fotoBase64Passeio = ''; if(preview) preview.innerHTML=''; return; }
    const reader = new FileReader();
    reader.onload = e => {
        fotoBase64Passeio = e.target.result;
        if(preview) preview.innerHTML = `<img src="${fotoBase64Passeio}" class="foto-preview-img">`;
        const urlInput = document.getElementById('ps-imagem');
        if(urlInput) urlInput.value = '';
    };
    reader.readAsDataURL(input.files[0]);
}

async function carregarPasseiosAdmin() {
    const lista = document.getElementById('admin-lista-passeios');
    if (!lista) return;
    try {
        const res  = await fetch(`${API_URL}/passeios`);
        const data = await res.json();
        if (!data.sucesso || data.passeios.length === 0) {
            lista.innerHTML = '<p style="color:#ccc;">Nenhum passeio ainda.</p>'; return;
        }
        lista.innerHTML = data.passeios.map(p => `
            <div class="admin-item-card" id="ps-item-${p.id}">
                <div class="admin-item-info">
                    <strong>${p.titulo}</strong>
                    <span class="admin-item-detalhe">🥾 ${p.dificuldade} · 📍 ${p.local}</span>
                    <p>${p.descricao}</p>
                </div>
                <div class="admin-item-acoes">
                    <button class="btn-admin-remover" onclick="removerPasseio(${p.id})">🗑️ Remover</button>
                </div>
            </div>`).join('');
    } catch(e) { lista.innerHTML = '<p style="color:#c0392b;">Erro ao carregar passeios.</p>'; }
}

async function criarPasseio() {
    const titulo      = document.getElementById('ps-titulo').value.trim();
    const dificuldade = document.getElementById('ps-dificuldade').value;
    const local       = document.getElementById('ps-local').value.trim();
    const descricao   = document.getElementById('ps-descricao').value.trim();
    const imagemUrl   = fotoBase64Passeio || document.getElementById('ps-imagem').value.trim();
    const link        = document.getElementById('ps-link').value.trim();
    if (!titulo || !dificuldade || !local || !descricao) {
        alert('⚠️ Preencha: título, dificuldade, local e descrição.'); return;
    }
    try {
        const res  = await fetch(`${API_URL}/passeios`, {
            method: 'POST', headers: {'Content-Type':'application/json'},
            body: JSON.stringify({titulo, descricao, dificuldade, local, imagem_url: imagemUrl, link})
        });
        const data = await res.json();
        if (data.sucesso) {
            alert('✓ ' + data.mensagem);
            ['ps-titulo','ps-dificuldade','ps-local','ps-descricao','ps-imagem','ps-link','ps-foto']
                .forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
            fotoBase64Passeio = '';
            const prev = document.getElementById('ps-foto-preview');
            if(prev) prev.innerHTML = '';
            carregarPasseiosAdmin();
            if (typeof carregarPasseiosDinamicos === 'function') carregarPasseiosDinamicos();
        } else { alert('✗ ' + data.mensagem); }
    } catch(e) { alert('Erro ao conectar ao servidor.'); }
}

async function removerPasseio(passeioId) {
    if (!confirm('Remover este passeio?')) return;
    try {
        const res  = await fetch(`${API_URL}/passeios/${passeioId}`, {method:'DELETE'});
        const data = await res.json();
        alert(data.sucesso ? '✓ ' + data.mensagem : '✗ ' + data.mensagem);
        carregarPasseiosAdmin();
        if (typeof carregarPasseiosDinamicos === 'function') carregarPasseiosDinamicos();
    } catch(e) { alert('Erro ao remover passeio.'); }
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

// ── Gestão de Guias ────────────────────────────────────────────────
async function carregarGuiasAdmin(statusFiltro = 'pendente') {
    const lista = document.getElementById('admin-lista-guias');
    if (!lista) return;
    lista.innerHTML = '<p style="color:#ccc;">Carregando...</p>';
    try {
        const res  = await fetch(`${API_URL}/guias/pendentes`);
        const data = await res.json();
        let guias = data.guias || [];
        if (statusFiltro) guias = guias.filter(g => g.status_guia === statusFiltro);
        if (guias.length === 0) {
            lista.innerHTML = '<p style="color:#ccc;">Nenhum guia nesta categoria.</p>'; return;
        }
        lista.innerHTML = guias.map(g => {
            const corStatus = {pendente:'#f39c12', ativo:'#27ae60', reprovado:'#c0392b'}[g.status_guia]||'#aaa';
            const fotoHtml = g.foto_base64
                ? `<img src="${g.foto_base64}" style="width:60px;height:60px;object-fit:cover;border-radius:50%;margin-right:.7rem">`
                : '<span style="font-size:2.5rem;margin-right:.7rem">🧭</span>';
            const botoesRevisao = g.status_guia === 'pendente' ? `
                <div class="revisao-form" style="margin-top:.7rem;">
                    <button class="btn-aprovar" onclick="aprovarGuia(${g.id})">✅ Aprovar</button>
                    <div class="reprovar-area">
                        <textarea id="just-guia-${g.id}" class="admin-input admin-textarea-sm"
                                  placeholder="Justificativa (obrigatória para reprovar)"></textarea>
                        <button class="btn-reprovar" onclick="reprovarGuia(${g.id})">❌ Reprovar</button>
                    </div>
                </div>` : '';
            const justHtml = g.justificativa_guia
                ? `<p class="justificativa-admin"><strong>Feedback:</strong> ${g.justificativa_guia}</p>` : '';
            return `
            <div class="admin-item-card" id="guia-item-${g.id}">
                <div style="display:flex; align-items:center; margin-bottom:.5rem">
                    ${fotoHtml}
                    <div>
                        <strong style="display:block">${g.nome}</strong>
                        <span style="font-size:.82rem;color:#aaa">@${g.username} · ${g.email}</span><br>
                        <span style="background:${corStatus};color:#fff;padding:2px 8px;border-radius:12px;font-size:.78rem">
                            ${g.status_guia.toUpperCase()}
                        </span>
                    </div>
                </div>
                <p style="font-size:.85rem;color:#ddd">📞 ${g.telefone} · 🛠️ ${g.servico||'Não informado'}</p>
                <p style="font-size:.82rem;color:#aaa">
                    ${g.instagram ? `<a href="${g.instagram}" target="_blank" style="color:#c8e63b">Instagram</a>` : ''}
                    ${g.linkedin  ? `· <a href="${g.linkedin}" target="_blank" style="color:#c8e63b">LinkedIn</a>` : ''}
                    ${g.facebook  ? `· <a href="${g.facebook}" target="_blank" style="color:#c8e63b">Facebook</a>` : ''}
                </p>
                ${justHtml}
                ${botoesRevisao}
            </div>`;
        }).join('');
    } catch(e) {
        lista.innerHTML = '<p style="color:#c0392b;">Erro ao carregar guias.</p>';
    }
}

function filtrarGuias(status, btn) {
    document.querySelectorAll('#admin-sec-guias .btn-filtro').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    carregarGuiasAdmin(status);
}

async function aprovarGuia(uid) {
    if (!confirm('Aprovar este guia? Ele poderá fazer login e aparecerá na aba Guias.')) return;
    const res  = await fetch(`${API_URL}/guia/${uid}/revisar`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({decisao:'ativo', justificativa:''})
    });
    const data = await res.json();
    alert(data.sucesso ? '✅ ' + data.mensagem : '✗ ' + data.mensagem);
    carregarGuiasAdmin('pendente');
}

async function reprovarGuia(uid) {
    const justEl = document.getElementById(`just-guia-${uid}`);
    const just   = justEl ? justEl.value.trim() : '';
    if (!just) { alert('⚠️ A justificativa é obrigatória para reprovar.'); return; }
    if (!confirm('Reprovar este guia?')) return;
    const res  = await fetch(`${API_URL}/guia/${uid}/revisar`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({decisao:'reprovado', justificativa: just})
    });
    const data = await res.json();
    alert(data.sucesso ? '❌ ' + data.mensagem : '✗ ' + data.mensagem);
    carregarGuiasAdmin('pendente');
}

// ── Trilhas dos Parques ────────────────────────────────────────────
async function carregarTrilhasAdmin() {
    const lista = document.getElementById('admin-lista-trilhas');
    if (!lista) return;
    // Busca status atual
    let pausadas = {};
    try {
        const r = await fetch(`${API_URL}/trilhas/status`);
        const d = await r.json();
        if (d.sucesso) pausadas = d.trilhas;
    } catch(e) {}
    // dadosParques vem de horarioFuncionamento.js
    if (typeof dadosParques === 'undefined') {
        lista.innerHTML = '<p style="color:#aaa">dadosParques não carregado.</p>'; return;
    }
    let html = '';
    dadosParques.forEach(parque => {
        html += `<h4 style="color:var(--secundary);margin:.8rem 0 .4rem">${parque.titulo}</h4>`;
        if (parque.trilhas) {
            parque.trilhas.forEach(t => {
                const isPausada = !!pausadas[t.id];
                html += `
                <div class="admin-item-card" style="display:flex;align-items:center;justify-content:space-between;gap:.5rem;flex-wrap:wrap;">
                    <div>
                        <strong style="color:#fff">${t.nome}</strong>
                        <span class="badge-dificuldade" style="margin-left:.4rem;background:${t.dificuldade==='Alta'?'#c0392b':t.dificuldade==='Baixa'?'#27ae60':'#f39c12'}">${t.dificuldade}</span>
                        <br><small style="color:#aaa">${t.localizacao||''}</small>
                    </div>
                    <button onclick="toggleTrilha('${t.id}', ${isPausada})"
                            style="background:${isPausada?'#27ae60':'#c0392b'};color:#fff;border:none;
                                   border-radius:8px;padding:.4rem .9rem;cursor:pointer;font-size:.83rem">
                        ${isPausada ? '▶ Ativar' : '⏸ Pausar'}
                    </button>
                </div>`;
            });
        }
    });
    lista.innerHTML = html;
}

async function toggleTrilha(trilhaId, estavaPausada) {
    const pausar = !estavaPausada;
    const res  = await fetch(`${API_URL}/trilha/${trilhaId}/pausar`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({pausar})
    });
    const data = await res.json();
    if (data.sucesso) {
        carregarTrilhasAdmin();
        if (typeof renderizarParques === 'function') renderizarParques();
    } else { alert('✗ ' + data.mensagem); }
}