// 1. Base de Dados dos Eventos
const dadosEventos = [
    {
        titulo: "Festival de Inverno",
        data: "12 a 28 de Julho",
        local: "Praça do Alto e Sesc",
        imagem: "img/eventos/festival-inverno.jpg", 
        descricao: "O evento mais charmoso da serra! Gastronomia, shows e muita cultura no frio de Terê.",
        link: "https://festivalsescdeinverno.com.br/programacoes/?localidade=TERES%C3%93POLIS" 
    },
    {
        titulo: "Feira do Produtor Rural",
        data: "Todos os Sábados",
        local: "Galpão do Vale",
        imagem: "img/eventos/feira-produtor.jpg",
        descricao: "Produtos frescos, orgânicos e artesanato local direto da roça para sua mesa.",
        link: "https://www.teresopolis.rj.gov.br/feport-2025-a-maior-feira-agropecuaria-de-teresopolis-retorna-com-shows-nacionais-valorizacao-da-cultura-local-e-do-produtor-rural-local/"
    },
    {
        titulo: "Serveja Teresópolis",
        data: "15 a 17 de Setembro",
        local: "Parque Regadas",
        imagem: "img/eventos/serveja.jpg",
        descricao: "O melhor das cervejas artesanais da região serrana, com food trucks e música ao vivo.",
        link: "https://teretotal.com.br/de-14-a-16-07-serveja-teresopolis-festival-da-cerveja/"
    },
    {
        titulo: "Jazz & Blues Festival",
        data: "Outubro/2025",
        local: "Vários locais",
        imagem: "img/eventos/jazz-blues.jpg",
        descricao: "Artistas nacionais e internacionais trazendo o melhor do instrumental para a cidade.",
        link: "https://www.sympla.com.br/evento/festival-jazz-e-blues-4-edicao/1928404?referrer=www.google.com&referrer=www.google.com&share_id=copiarlink"
    }
];

// 2. Função para criar o Card HTML
function criarCardEvento(evento) {
    // Se não tiver imagem, usa uma cinza padrão
    const imagem = evento.imagem_url || evento.imagem || "https://via.placeholder.com/400x250?text=Evento+TereVerde";

    return `
        <div class="evento-card">
            <div class="evento-img-box">
                <img src="${imagem}" loading="lazy" alt="${evento.titulo}">
                <div class="evento-data-badge">${evento.data}</div>
            </div>
            
            <div class="evento-info">
                <h3>${evento.titulo}</h3>
                <p class="evento-local"><i class="fa fa-map-marker"></i> ${evento.local}</p>
                <p class="evento-desc">${evento.descricao}</p>
                
                <a href="${evento.link}" class="btn-evento" target="_blank" rel="noopener noreferrer">Saiba Mais</a>
            </div>
        </div>
    `;
}

// 3. Renderização dinâmica (busca do BD, fallback para array estático)
async function carregarEventosDinamicos() {
    const container = document.getElementById('eventos-container');
    if (!container) return;
    try {
        const res  = await fetch(`${API_URL}/eventos`);
        const data = await res.json();
        // Sempre exibe os fixos + os cadastrados pelo admin
        const dinâmicos = (data.sucesso && data.eventos) ? data.eventos : [];
        const lista = [...dadosEventos, ...dinâmicos];
        container.innerHTML = lista.map(criarCardEvento).join('');
    } catch (e) {
        console.warn('Servidor offline. Exibindo apenas eventos fixos.');
        container.innerHTML = dadosEventos.map(criarCardEvento).join('');
    }
}

document.addEventListener('DOMContentLoaded', carregarEventosDinamicos);

// ── Passeios dinâmicos (cadastrados pelo admin) ───────────────
function criarCardPasseio(p) {
    const imagem = p.imagem_url || 'https://via.placeholder.com/400x250?text=Passeio+TereVerde';
    return `
        <div class="evento-card">
            <div class="evento-img-box">
                <img src="${imagem}" loading="lazy" alt="${p.titulo}">
            </div>
            <div class="evento-info">
                <h3>${p.titulo}</h3>
                <p class="evento-local"><i class="fa fa-map-marker"></i> ${p.local}</p>
                <p class="evento-desc">${p.descricao}</p>
                <div id="guias-passeio-${p.id}" style="display:none; margin-top:.6rem;
                     background:rgba(0,0,0,.1); border-radius:6px; padding:.6rem;">
                    <em style="font-size:.85rem; color:#888;">Carregando guias...</em>
                </div>
                <div style="display:flex; gap:.5rem; flex-wrap:wrap; margin-top:.6rem;">
                    <!-- Botão de inscrição renderizado por JS após o card -->
                    <button class="btn-evento btn-guias-passeio"
                            onclick="verGuiasPasseio(${p.id})">
                        👥 Guias Disponíveis
                    </button>
                    <!-- Botão Inscrição — só para guias; gerado dinamicamente -->
                    <button id="btn-inscricao-${p.id}"
                            class="btn-evento"
                            onclick="toggleInscricaoPasseio(${p.id}, this)"
                            style="display:none; border:none; cursor:pointer;">
                        ➕ Inscrever-se
                    </button>
                    ${p.link ? `<a href="${p.link}" class="btn-evento" target="_blank" rel="noopener">Saiba Mais</a>` : ''}
                </div>
            </div>
        </div>`;
}

async function carregarPasseiosDinamicos() {
    const container = document.getElementById('passeios-admin-container');
    if (!container) return;
    try {
        const res  = await fetch(`${API_URL}/passeios`);
        const data = await res.json();
        if (!data.sucesso || data.passeios.length === 0) {
            container.innerHTML = '<p style="color:#aaa; padding:1rem;">Nenhum passeio cadastrado ainda.</p>';
            return;
        }
        container.innerHTML = data.passeios.map(criarCardPasseio).join('');
    } catch(e) {
        container.innerHTML = '<p style="color:#aaa;">Servidor offline.</p>';
    }
}

document.addEventListener('DOMContentLoaded', carregarPasseiosDinamicos);

/** Alterna visibilidade da lista de guias inscritos num passeio */
async function verGuiasPasseio(passeioId) {
    const painel = document.getElementById(`guias-passeio-${passeioId}`);
    if (!painel) return;
    // Toggle: se já está visível, oculta
    if (painel.style.display === 'block') {
        painel.style.display = 'none';
        return;
    }
    painel.style.display = 'block';
    painel.innerHTML = '<em style="font-size:.85rem; color:#888;">Carregando guias...</em>';
    try {
        const res  = await fetch(`${API_URL}/passeios/${passeioId}/guias`);
        const data = await res.json();
        if (!data.sucesso || data.guias.length === 0) {
            painel.innerHTML = '<p style="color:#aaa; font-size:.85rem;">Nenhum guia inscrito ainda.</p>';
            return;
        }
        painel.innerHTML = data.guias.map(g => `
            <div style="display:flex; align-items:center; gap:.5rem;
                        padding:.4rem 0; border-bottom:1px solid rgba(255,255,255,.1);">
                <span>🧭</span>
                <strong style="color:#fff;">${g.nome}</strong>
                <span style="color:#aaa; font-size:.82rem;">@${g.username}</span>
            </div>`).join('');
    } catch(e) {
        painel.innerHTML = '<p style="color:#c0392b; font-size:.85rem;">Erro ao carregar guias.</p>';
    }
}

/** Mostra botão Inscrição somente para guias logados */
function ativarBotoesInscricaoPasseio() {
    const usuario = getUsuarioLogado();
    if (!usuario || usuario.tipo !== 'guia') return;
    document.querySelectorAll('[id^="btn-inscricao-"]').forEach(btn => {
        btn.style.display = 'inline-block';
    });
}

/** Inscreve ou desincreve guia de um passeio */
async function toggleInscricaoPasseio(passeioId, btn) {
    const usuario = getUsuarioLogado();
    if (!usuario || usuario.tipo !== 'guia') {
        alert('🔒 Somente guias podem se inscrever.');
        return;
    }
    const jaInscrito = btn.dataset.inscrito === 'true';
    const method = jaInscrito ? 'DELETE' : 'POST';
    const url = `${API_URL}/inscricao`;
    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ guia_id: usuario.id, trilha_id: String(passeioId) })
        });
        const data = await res.json();
        if (data.sucesso) {
            btn.dataset.inscrito = jaInscrito ? 'false' : 'true';
            btn.textContent      = jaInscrito ? '➕ Inscrever-se' : '🚪 Sair do Passeio';
            btn.classList.toggle('btn-evento-sair', !jaInscrito);
            btn.style.background = jaInscrito ? '' : '#c0392b';
        } else {
            alert('✗ ' + data.mensagem);
        }
    } catch(e) {
        alert('Erro ao conectar: ' + e.message);
    }
}

// Ativa botões de inscrição quando a aba Passeios é aberta
document.addEventListener('DOMContentLoaded', () => {
    // Será chamado também por openPage() em script.js
    setTimeout(ativarBotoesInscricaoPasseio, 800);
});
