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
    const imagem = evento.imagem_url || "https://via.placeholder.com/400x250?text=Evento+TereVerde";

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
        // Usa eventos do BD se houver; senão usa os estáticos
        const lista = (data.sucesso && data.eventos.length > 0) ? data.eventos : dadosEventos;
        container.innerHTML = lista.map(criarCardEvento).join('');
    } catch (e) {
        console.warn('Servidor offline. Usando eventos estáticos.');
        container.innerHTML = dadosEventos.map(criarCardEvento).join('');
    }
}

document.addEventListener('DOMContentLoaded', carregarEventosDinamicos);

// ── Passeios dinâmicos (cadastrados pelo admin) ───────────────
function criarCardPasseio(p) {
    const imagem = p.imagem_url || 'https://via.placeholder.com/400x250?text=Passeio+TereVerde';
    const dificuldadeCor = { Baixa:'#27ae60', Média:'#f39c12', Alta:'#c0392b' }[p.dificuldade] || '#888';
    return `
        <div class="evento-card">
            <div class="evento-img-box">
                <img src="${imagem}" loading="lazy" alt="${p.titulo}">
                <div class="evento-data-badge" style="background:${dificuldadeCor};">${p.dificuldade}</div>
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
                    <button class="btn-evento btn-guias-passeio"
                            onclick="verGuiasPasseio(${p.id})"
                            style="background:var(--verde3); border:none; cursor:pointer;">
                        👥 Guias Disponíveis
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