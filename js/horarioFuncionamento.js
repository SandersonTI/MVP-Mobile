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
          "img/parques/parque_nacional/PARNASO_5.jpg"
      ],
      trilhas: [
          {
              id: 'parnaso_trilha_1',       // ← ID único para buscar guias
              nome: 'Trilha da Pedra do Sino',
              dificuldade: 'Alta',
              localizacao: 'PARNASO - Sede Teresópolis'
          },
          {
              id: 'parnaso_trilha_2',       // ← ID único para buscar guias
              nome: 'Trilha Cartão Postal',
              dificuldade: 'Média',
              localizacao: 'PARNASO - Sede Teresópolis'
          },
          {
              id: 'parnaso_trilha_3',       // ← ID único para buscar guias
              nome: 'Caminho das Orquídeas',
              dificuldade: 'Baixa',
              localizacao: 'PARNASO - Sede Teresópolis'
          },
          {
              id: 'parnaso_trilha_4',       // ← ID único para buscar guias
              nome: 'Trilha suspensa',
              dificuldade: 'Baixa',
              localizacao: 'PARNASO - Sede Teresópolis'
          },
          {
              id: 'parnaso_trilha_5',       // ← ID único para buscar guias
              nome: 'Trilha Poço Paraíso',
              dificuldade: 'Baixa',
              localizacao: 'PARNASO - Sede Teresópolis'
          },
          {
              id: 'parnaso_trilha_6',       // ← ID único para buscar guias
              nome: 'Trilha Cachoeira Véu da Noiva',
              dificuldade: 'Média',
              localizacao: 'PARNASO - Sede Teresópolis'
          },
        {
              id: 'parnaso_trilha_7',       // ← ID único para buscar guias
              nome: 'Trilha Poço Verde',
              dificuldade: 'Média',
              localizacao: 'PARNASO - Sede Guapimirim'
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
    "img/parques/parque_tres_picos/3PICOS_4.jpg",
    "img/parques/parque_tres_picos/3PICOS_5.jpg",
    "img/parques/parque_tres_picos/3PICOS_6.jpg"
  ],
      trilhas: [
          {
              id: 'tres_picos_1',       // ← ID único para buscar guias
              nome: 'Trilha da Caixa de Fósforo',
              dificuldade: 'Média',
              localizacao: 'PETP - Vale dos Deuses'
          },
          {
              id: 'tres_picos_2',       // ← ID único para buscar guias
              nome: 'Trilha Capacete',
              dificuldade: 'Baixa',
              localizacao: 'PETP - Vale do Toledo'
          },
          {
              id: 'tres_picos_3',       // ← ID único para buscar guias
              nome: 'Trilha da Cabeça do Dragão',
              dificuldade: 'Alta',
              localizacao: 'PETP - Vale dos Deuses'
          },
          {
              id: 'tres_picos_4',       // ← ID único para buscar guias
              nome: 'Trilha Pico dos Três Municípios',
              dificuldade: 'Média',
              localizacao: 'PETP - Vale do Toledo'
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
          "img/parques/parque_montanhas/MONTANHAS (3).png"
      ],
      trilhas: [
          {
              id: 'montanhas_1',       // ← ID único para buscar guias
              nome: 'Trilha Pedra Alpina',
              dificuldade: 'Alta',
              localizacao: 'Sede Santa Rita'
          },
          {
              id: 'montanhas_2',       // ← ID único para buscar guias
              nome: 'Trilha Jacu',
              dificuldade: 'Baixa',
              localizacao: 'Sede Santa Rita'
          },
          {
              id: 'montanhas_3',       // ← ID único para buscar guias
              nome: 'Trilha Tangará',
              dificuldade: 'Baixa',
              localizacao: 'Sede Santa Rita'
          },
          {
              id: 'montanhas_4',       // ← ID único para buscar guias
              nome: 'Trilha Pedra da Tartaruga',
              dificuldade: 'Baixa',
              localizacao: 'Entrada pela Granja Florestal'
          },
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
function renderizarParques() {
  const container = document.getElementById("container-parques-dinamico");
  if (!container) return;

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
        listaTrilhasHtml = parque.trilhas.map(trilha => {
            const coresDificuldade = {
                Baixa: "#27ae60",
                "MÃ©dia": "#f1c40f",
                "MÃƒÂ©dia": "#f1c40f",
                Alta: "#c0392b"
            };
            let corDif = coresDificuldade[trilha.dificuldade] || "#777";
            if ((trilha.dificuldade || "").toLowerCase().includes("dia")) {
                corDif = "#f1c40f";
            }
            /*
            const extra = trilha.textoExtra ? `<br><small>${trilha.textoExtra}</small>` : "";
            const infoDificuldade = trilha.dificuldade ? ` <span style="font-weight:normal; font-size:0.9em">(Nível: ${trilha.dificuldade})</span>` : "";
            const infoLocal = trilha.localizacao || trilha.localização
                ? `<br><small><strong>Localização:</strong> ${trilha.localizacao || trilha.localização}</small>`
                : "";
        
            */
            return `
                <li data-trilha-id="${trilha.id}">
                    <strong>${trilha.nome}</strong>
                    <span class="badge-dificuldade" style="background:${corDif}">${trilha.dificuldade}</span>
                    ${trilha.localizacao ? `<br><small>${trilha.localizacao}</small>` : ''}
                    <!-- Container de guias: preenchido por renderizarGuiasDaTrilha() -->
                    <div class="guias-trilha-container" data-guias-trilha="${trilha.id}"></div>
                    <!-- Botão de inscrição: visível apenas para guias (controlado por JS) -->
                    <div class="btn-inscricao-container" style="display:none;">
                        <button class="btn-inscricao-guia" data-trilha-id="${trilha.id}"
                                onclick="toggleInscricaoGuia('${trilha.id}', this)">
                            + Inscrever-se neste passeio
                        </button>
                    </div>
                </li>`;
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
              <ul class="trail-list" style="color:var(--text-black);">
                  ${listaTrilhasHtml}
              </ul>
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
