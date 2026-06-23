// === 1. Base de Dados Completa ===
const dadosParques = [
  {
      id: "parnaso",
      titulo: "Parque Nacional da Serra dos Órgãos (PARNASO)",
      telefone: "(21) 97896-2463",
      horario: { inicio: "07:00", fim: "22:00" },
      descricao: `
          <p>O Parque Nacional da Serra dos Órgãos <strong>(PARNASO)</strong> é uma unidade de conservação
          de 19.855 hectares localizada na Região Serrana do Rio de Janeiro.</p>
          <br>
          <p>Os aspectos mais relevantes são:</p>
          <div style="text-indent: 20px;">
              <p><strong>Importância Histórica:</strong> Criado em 1939, terceiro parque mais antigo do Brasil.</p>
              <p><strong>Rede de Trilhas:</strong> Possui a maior rede de trilhas do Brasil (mais de 200km).</p>
              <p><strong>Biodiversidade:</strong> Abriga mais de 2.800 espécies de plantas.</p>
          </div>
      `,
      temSlider: true,
      imagens: [
          "img/parques/parque_nacional/PARNASO_1.jpg",
          "img/parques/parque_nacional/PARNASO_2.jpg",
          "img/parques/parque_nacional/PARNASO_3.jpg",
          "img/parques/parque_nacional/PARNASO_4.jpg",
          "img/parques/parque_nacional/PARNASO_5.jpg",
          "img/parques/parque_nacional/PARNASO_6.jpg",
          "img/parques/parque_nacional/PARNASO_7.jpg"
      ],
      trilhas: [
          {
              id: 'parnaso_trilha_1',       // ← ID único para buscar guias
              nome: 'Trilha da Pedra do Sino',
              dificuldade: 'Alta',
              localizacao: 'PARNASO - Sede Teresópolis',
              imagem: "img/parques/parque_nacional/PARNASO_1.jpg"
          },
          {
              id: 'parnaso_trilha_2',       // ← ID único para buscar guias
              nome: 'Trilha Cartão Postal',
              dificuldade: 'Média',
              localizacao: 'PARNASO - Sede Teresópolis',
              imagem: "img/parques/parque_nacional/PARNASO_2.jpg"
          },
          {
              id: 'parnaso_trilha_3',       // ← ID único para buscar guias
              nome: 'Caminho das Orquídeas',
              dificuldade: 'Baixa',
              localizacao: 'PARNASO - Sede Teresópolis',
              imagem: "img/parques/parque_nacional/PARNASO_3.jpg"
          },
          {
              id: 'parnaso_trilha_4',       // ← ID único para buscar guias
              nome: 'Trilha suspensa',
              dificuldade: 'Baixa',
              localizacao: 'PARNASO - Sede Teresópolis',
              imagem: "img/parques/parque_nacional/PARNASO_4.jpg"
          },
          {
              id: 'parnaso_trilha_5',       // ← ID único para buscar guias
              nome: 'Trilha Poço Paraíso',
              dificuldade: 'Baixa',
              localizacao: 'PARNASO - Sede Teresópolis',
              imagem: "img/parques/parque_nacional/PARNASO_5.jpg"
          },
          {
              id: 'parnaso_trilha_6',       // ← ID único para buscar guias
              nome: 'Trilha Cachoeira Véu da Noiva',
              dificuldade: 'Média',
              localizacao: 'PARNASO - Sede Teresópolis',
              imagem: "img/parques/parque_nacional/PARNASO_6.jpg"
          },
        {
              id: 'parnaso_trilha_7',       // ← ID único para buscar guias
              nome: 'Trilha Poço Verde',
              dificuldade: 'Média',
              localizacao: 'PARNASO - Sede Guapimirim',
              imagem: "img/parques/parque_nacional/PARNASO_7.jpg"
          },

      ]
  },
  {
      id: "tres_picos",
      titulo: "Parque Estadual dos Três Picos (PETP)",
      telefone: "(21) 99624-4839",
      horario: { inicio: "08:00", fim: "17:00" },
      descricao: `<p>O maior parque estadual do Rio de Janeiro, com diversas formações rochosas impressionantes.</p>
      <p>É um destino popular para atividades ao ar livre, como caminhadas, escaladas e observação da natureza.</p>
      <br><p>Algumas das atrações mais notáveis do parque incluem:</p>
      <div style="text-indent: 20px;">
          <p><strong>Pico dos Três Picos:</strong> A montanha mais alta do parque, oferecendo vistas panorâmicas deslumbrantes.</p>
          <p><strong>Trilha da Caixa de Fósforo:</strong> Uma trilha popular que leva os visitantes através de paisagens naturais deslumbrantes.</p>
          <p><strong>Formações Rochosas:</strong> Incluindo o famoso Dedo de Deus, uma formação rochosa icônica para escaladores.</p>
      </div>
      `, 
  temSlider: true,
  imagens: [
    "img/parques/parque_tres_picos/3PICOS_1.jpg",
    "img/parques/parque_tres_picos/3PICOS_2.jpg",
    "img/parques/parque_tres_picos/3PICOS_3.jpg",
    "img/parques/parque_tres_picos/3PICOS_4.jpg"
  ],
      trilhas: [
          {
              id: 'tres_picos_1',       // ← ID único para buscar guias
              nome: 'Trilha da Caixa de Fósforo',
              dificuldade: 'Média',
              localizacao: 'PETP - Vale dos Deuses',
              imagem: "img/parques/parque_tres_picos/3PICOS_1.jpg"
          },
          {
              id: 'tres_picos_2',       // ← ID único para buscar guias
              nome: 'Trilha Capacete',
              dificuldade: 'Baixa',
              localizacao: 'PETP - Vale do Toledo',
              imagem: "img/parques/parque_tres_picos/3PICOS_2.jpg"
          },
          {
              id: 'tres_picos_3',       // ← ID único para buscar guias
              nome: 'Trilha da Cabeça do Dragão',
              dificuldade: 'Alta',
              localizacao: 'PETP - Vale dos Deuses',
              imagem: "img/parques/parque_tres_picos/3PICOS_3.jpg"
          },
          {
              id: 'tres_picos_4',       // ← ID único para buscar guias
              nome: 'Trilha Pico dos Três Municípios',
              dificuldade: 'Média',
              localizacao: 'PETP - Vale do Toledo',
              imagem: "img/parques/parque_tres_picos/3PICOS_4.jpg"
          },
      ]
  },
  {
      id: "montanhas",
      titulo: "Parque Natural Municipal Montanhas de Teresópolis",
      telefone: "(21) 2742-3352",
      horario: { inicio: "08:00", fim: "17:00" },
      descricao: `<p>O parque é conhecido por sua rica biodiversidade, abrigando uma variedade de espécies de flora e fauna, muitas das quais são endêmicas da Mata Atlântica.</p>
      <p>Além disso, o parque oferece diversas trilhas para caminhadas, proporcionando aos visitantes a oportunidade de explorar suas paisagens deslumbrantes e apreciar a natureza em seu estado mais puro.</p>
      <p>Uma das atrações mais icônicas do parque é a <strong>Pedra da Tartaruga</strong>, uma formação rochosa que se assemelha a uma tartaruga gigante, oferecendo vistas panorâmicas espetaculares da região.</p>
      <br><p>Com sua combinação de beleza natural, biodiversidade e importância ecológica, o Parque Natural Municipal Montanhas de Teresópolis é um destino imperdível para:</p>
      <div style="text-indent: 20px;">
        <p><strong>Amantes da natureza</strong> que buscam um refúgio tranquilo em meio às montanhas.</p>
        <p>É um local ideal para <strong>atividades ao ar livre, como caminhadas, observação de aves e fotografia da natureza.</strong></p>
      </div>
      `,
      temSlider: true,
      imagens: [
          "img/parques/parque_montanhas/MONTANHAS (1).png",
          "img/parques/parque_montanhas/MONTANHAS (2).png",
          "img/parques/parque_montanhas/MONTANHAS (3).png",
          "img/parques/parque_montanhas/MONTANHAS (4).png",
      ],
      trilhas: [
          {
              id: 'montanhas_1',       // ← ID único para buscar guias
              nome: 'Trilha Pedra Alpina',
              dificuldade: 'Alta',
              localizacao: 'Sede Santa Rita',
              imagem: "img/parques/parque_montanhas/MONTANHAS (1).png"
          },
          {
              id: 'montanhas_2',       // ← ID único para buscar guias
              nome: 'Trilha Jacu',
              dificuldade: 'Baixa',
              localizacao: 'Sede Santa Rita',
              imagem: "img/parques/parque_montanhas/MONTANHAS (2).png"
          },
          {
              id: 'montanhas_3',       // ← ID único para buscar guias
              nome: 'Trilha Tangará',
              dificuldade: 'Baixa',
              localizacao: 'Sede Santa Rita',
              imagem: "img/parques/parque_montanhas/MONTANHAS (3).png"
          },
          {
              id: 'montanhas_4',       // ← ID único para buscar guias
              nome: 'Trilha Pedra da Tartaruga',
              dificuldade: 'Baixa',
              localizacao: 'Entrada pela Granja Florestal',
              imagem: "img/parques/parque_montanhas/MONTANHAS (4).png"
          }
      ]
  }
];

// === 2. Função Auxiliar de Tempo ===
function dentroDoHorario(inicio, fim) {
  const agora = new Date();
  const horaAtual = agora.getHours() + agora.getMinutes() / 60;
  const [hIni, mIni] = inicio.split(":").map(Number);
  const [hFim, mFim] = fim.split(":").map(Number);
  const horaInicio = hIni + mIni / 60;
  const horaFim = hFim + mFim / 60;
  return horaAtual >= horaInicio && horaAtual <= horaFim;
}

// === 3. Gerar HTML Dinamicamente ===
async function renderizarParques() {
  const container = document.getElementById("container-parques-dinamico");
  if (!container) return;
  // Busca status de trilhas pausadas (admin pode pausar)
  let trilhasPausadas = {};
  try {
    const r = await fetch(`${API_URL}/trilhas/status`);
    const d = await r.json();
    if (d.sucesso) trilhasPausadas = d.trilhas;
  } catch(e) { /* offline: mostra todas */ }

  // Injeta status de pausada em cada trilha
  dadosParques.forEach(parque => {
    if (parque.trilhas) {
      parque.trilhas.forEach(t => { t.pausada = !!trilhasPausadas[t.id]; });
    }
  });

  let htmlCompleto = "";
  dadosParques.forEach(parque => {
      // Slider
      let htmlSlider = "";
      if (parque.temSlider && parque.imagens && parque.imagens.length > 0) {
          const slides = parque.imagens.map(img => `
              <div class="park-slide fade">
                  <img src="${img}" loading="lazy" alt="Imagem do parque">
              </div>
          `).join("");
          htmlSlider = `
              <section class="park-slider" data-park="${parque.id}">
                  <div class="slideshow-container">
                      ${slides}
                      <a class="prev" onclick="event.stopPropagation(); parkPlusSlides('${parque.id}', -1)">&#10094;</a>
                      <a class="next" onclick="event.stopPropagation(); parkPlusSlides('${parque.id}', 1)">&#10095;</a>
                  </div>
              </section>
          `;
      }

      // Descrição
      let htmlDescricao = "";
      if (parque.descricao) {
          htmlDescricao = `
              <div class="col trail-list" style="color:var(--text-black); text-indent: 20px; border-bottom: none;">
                  ${parque.descricao}
              </div>
          `;
      }

      // Trilhas
      let listaTrilhasHtml = "";
      if (parque.trilhas) {
        listaTrilhasHtml = parque.trilhas
          .filter(t => !t.pausada)   // oculta trilhas pausadas
          .map(trilha => {
            const coresDif = { Baixa:'#27ae60', Alta:'#c0392b' };
            let corDif = coresDif[trilha.dificuldade] || '#f39c12';
            if ((trilha.dificuldade||'').toLowerCase().includes('dia')) corDif = '#f39c12';
            return `
              <div class="trilha-card" data-trilha-id="${trilha.id}">
                <div class="trilha-card-header">
                  <strong>${trilha.nome}</strong>
                  <span class="badge-dificuldade" style="background:${corDif}">${trilha.dificuldade}</span>
                </div>
                ${trilha.localizacao ? `<p class="trilha-local">📍 ${trilha.localizacao}</p>` : ''}
                <!-- Lista de guias disponíveis (toggle) -->
                <div id="guias-trilha-${trilha.id}" class="guias-trilha-painel" style="display:none;">
                  <em style="font-size:.82rem;color:#888;">Carregando...</em>
                </div>
                <div class="trilha-card-btns">
                  <button class="btn-evento btn-guias-passeio"
                          onclick="verGuiasTrilha('${trilha.id}')">
                    👥 Guias Disponíveis
                  </button>
                  <button id="btn-inscricao-trilha-${trilha.id}"
                          class="btn-evento btn-inscricao-trilha"
                          style="display:none; background:#27ae60;"
                          onclick="toggleInscricaoGuia('${trilha.id}', this)">
                    ➕ Inscrever-se
                  </button>
                </div>
              </div>`;
          }).join("");
      }

      // Card
      htmlCompleto += `
          <div class="park-card" id="card-${parque.id}">
              <div class="park-header" onclick="toggleAccordion('${parque.id}')">
                  <h3>${parque.titulo} <span style="float:right; font-size:0.8em;">&#9660;</span></h3>
              </div>
              ${htmlSlider}
              ${parque.telefone ? `<div class="col trail-list" style="color:var(--text-black);"><p><strong>Contato:</strong> ${parque.telefone}</p></div>` : ""}
              ${htmlDescricao}
              <div class="horario-trilha" style="color:var(--text-black);">
                  <p><strong>Horário do Parque:</strong> ${parque.horario.inicio} às ${parque.horario.fim}</p>
              </div>
              <div class="trilhas-grid">
                  ${listaTrilhasHtml}
              </div>
          </div>
      `;
  });

  container.innerHTML = htmlCompleto;
  atualizarStatusTrilhas();
  if (window.initAllParkSliders) window.initAllParkSliders();
}

// === 4. Accordion ===
function toggleAccordion(idParque) {
  const card = document.getElementById(`card-${idParque}`);
  if (card) card.classList.toggle("open");
}

/** Toggle painel de guias de uma trilha */
async function verGuiasTrilha(trilhaId) {
    const painel = document.getElementById(`guias-trilha-${trilhaId}`);
    if (!painel) return;
    if (painel.style.display === 'block') { painel.style.display = 'none'; return; }
    painel.style.display = 'block';
    painel.innerHTML = '<em style="color:#aaa">Carregando guias...</em>';
    try {
        const res  = await fetch(`${API_URL}/inscricoes/${trilhaId}`);
        const data = await res.json();
        if (!data.sucesso || data.guias.length === 0) {
            painel.innerHTML = '<p style="color:#aaa">Nenhum guia inscrito ainda.</p>'; return;
        }
        painel.innerHTML = data.guias.map(g =>
            `<div style="padding:.3rem 0;border-bottom:1px solid rgba(255,255,255,.1);color:#fff">
                🧭 <strong>${g.nome}</strong> <span style="color:#aaa;font-size:.8rem">@${g.username}</span>
            </div>`
        ).join('');
    } catch(e) {
        painel.innerHTML = '<p style="color:#c0392b">Erro ao carregar.</p>';
    }
}

/** Ativa botões de inscrição somente para guias logados */
function ativarBotoesInscricaoTrilhas() {
    const usuario = typeof getUsuarioLogado === 'function' ? getUsuarioLogado() : null;
    if (!usuario || usuario.tipo !== 'guia') return;
    document.querySelectorAll('[id^="btn-inscricao-trilha-"]')
            .forEach(btn => btn.style.display = 'inline-block');
}

// ── Seleção de parque individual (nova navegação) ──────────────
function criarCardTrilha(trilha) {
    const imagem = trilha.imagem || 'https://via.placeholder.com/400x250?text=Trilha';
    return `
        <div class="evento-card">
            <div class="evento-img-box">
                <img src="${imagem}" loading="lazy" alt="${trilha.nome}"
                     onerror="this.src='https://via.placeholder.com/400x250?text=Trilha'">
            </div>
            <div class="evento-info">
                <h3>${trilha.nome}</h3>
                <p class="evento-local"><i class="fa fa-map-marker"></i> ${trilha.localizacao || ''}</p>
                <div style="display:flex; gap:.5rem; flex-wrap:wrap; margin-top:.6rem;">
                    <button class="btn-evento btn-guias-passeio"
                            onclick="verGuiasTrilha('${trilha.id}')">
                        👥 Guias Disponíveis
                    </button>
                    <button id="btn-inscricao-trilha-${trilha.id}"
                            class="btn-evento"
                            onclick="toggleInscricaoGuia('${trilha.id}', this)"
                            style="display:none; background:#27ae60;">
                        ➕ Inscrever-se
                    </button>
                </div>
                <div id="guias-trilha-${trilha.id}" class="guias-trilha-painel" style="display:none;"></div>
            </div>
        </div>`;
}

function selecionarParque(parqueId, btn) {
    // Atualiza botões ativos
    document.querySelectorAll('.parque-sel-btn')
            .forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const parque = dadosParques.find(p => p.id === parqueId);
    if (!parque) return;

    // Mostra info resumida do parque
    const infoEl = document.getElementById('parque-info-selecionado');
    if (infoEl) {
        infoEl.innerHTML = `
            <div style="background:rgba(255,255,255,.06); border-radius:10px;
                        padding:1rem 1.2rem; color:#fff; margin-bottom:.5rem;">
                <strong style="font-size:1.05rem;">${parque.titulo}</strong>
                <p style="color:#aaa; font-size:.85rem; margin-top:.3rem;">
                    📞 ${parque.telefone || 'Sem telefone'}  · 
                    🕐 ${parque.horario.inicio} às ${parque.horario.fim}
                </p>
            </div>`;
    }

    // Renderiza trilhas como cards
    const container = document.getElementById('trilhas-parque-container');
    if (!container || !parque.trilhas) return;
    container.innerHTML = parque.trilhas.map(criarCardTrilha).join('');

    // Ativa botões de inscrição se for guia logado
    ativarBotoesInscricaoTrilhas();
}

// Inicializa com o primeiro parque selecionado ao abrir a sub-aba
document.addEventListener('DOMContentLoaded', () => {
    const firstBtn = document.querySelector('.parque-sel-btn');
    selecionarParque('parnaso', firstBtn);
});

/** Inscreve ou desincreve um guia de uma trilha de parque */
async function toggleInscricaoGuia(trilhaId, btn) {
    const usuario = typeof getUsuarioLogado === 'function' ? getUsuarioLogado() : null;
    if (!usuario || usuario.tipo !== 'guia') {
        alert('🔒 Somente guias podem se inscrever.');
        return;
    }
    const jaInscrito = btn.dataset.inscrito === 'true';
    const method = jaInscrito ? 'DELETE' : 'POST';
    try {
        const res  = await fetch(`${API_URL}/inscricao`, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ guia_id: usuario.id, trilha_id: trilhaId })
        });
        const data = await res.json();
        if (data.sucesso) {
            btn.dataset.inscrito = jaInscrito ? 'false' : 'true';
            btn.textContent      = jaInscrito ? '➕ Inscrever-se' : '🚪 Sair da Trilha';
            btn.classList.toggle('btn-evento-sair', !jaInscrito);
            btn.style.background = jaInscrito ? '#27ae60' : '#c0392b';
        } else {
            alert('✗ ' + data.mensagem);
        }
    } catch(e) {
        alert('Erro ao conectar: ' + e.message);
    }
}

/**
 * Ao fazer login como guia, carrega as inscrições existentes
 * e atualiza visual dos botões (Inscrever-se → Inscrito).
 */
async function carregarInscricoesDoGuia(guiaId) {
    try {
        const res  = await fetch(`${API_URL}/guia/${guiaId}/inscricoes`);
        const data = await res.json();
        if (!data.sucesso) return;
        data.trilhas.forEach(trilhaId => {
            // Trilhas de parques
            const btn = document.getElementById(`btn-inscricao-trilha-${trilhaId}`);
            if (btn) {
                btn.dataset.inscrito = 'true';
                btn.textContent      = '🚪 Sair da Trilha';
                btn.classList.add('btn-evento-sair');
                btn.style.background = '#c0392b';
            }
            // Passeios do admin
            const btnP = document.getElementById(`btn-inscricao-${trilhaId}`);
            if (btnP) {
                btnP.dataset.inscrito = 'true';
                btnP.textContent      = '🚪 Sair do Passeio';
                btnP.classList.add('btn-evento-sair');
                btnP.style.background = '#c0392b';
            }
        });
    } catch(e) { /* silencioso */ }
}
