/**
 * Calendário de Eventos - TerêVerde
 * Cria um calendário visual para a aba de Eventos.
 */

let dataAtual = new Date();
let mesAtual = dataAtual.getMonth();
let anoAtual = dataAtual.getFullYear();

// Mapeamento simples de eventos para fins de demonstração (MVP)
// Como os eventos têm datas em formato texto ("12 a 28 de Julho", "Todos os Sábados"),
// O calendário tentará marcar essas datas no mês atual.
function extrairDiasComEventos(mes, ano) {
    const diasComEventos = {};
    
    // Lista todos os eventos visíveis na página
    const cards = document.querySelectorAll('#eventos-container .evento-card');
    
    cards.forEach(card => {
        const titulo = card.querySelector('h3').innerText;
        const dataTexto = card.querySelector('.evento-data-badge').innerText.toLowerCase();
        
        // Regra 1: "Todos os Sábados"
        if (dataTexto.includes('sábado') || dataTexto.includes('sabado')) {
            const diasNoMes = new Date(ano, mes + 1, 0).getDate();
            for (let dia = 1; dia <= diasNoMes; dia++) {
                const data = new Date(ano, mes, dia);
                if (data.getDay() === 6) { // 6 = Sábado
                    adicionarEvento(diasComEventos, dia, titulo);
                }
            }
        }
        
        // Regra 2: "12 a 28 de Julho"
        const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
        if (meses[mes] && dataTexto.includes(meses[mes])) {
            const numeros = dataTexto.match(/\d+/g);
            if (numeros && numeros.length >= 2) {
                const inicio = parseInt(numeros[0]);
                const fim = parseInt(numeros[1]);
                for (let dia = inicio; dia <= fim; dia++) {
                    adicionarEvento(diasComEventos, dia, titulo);
                }
            } else if (numeros && numeros.length === 1) {
                adicionarEvento(diasComEventos, parseInt(numeros[0]), titulo);
            }
        }
    });
    
    return diasComEventos;
}

function adicionarEvento(diasComEventos, dia, titulo) {
    if (!diasComEventos[dia]) {
        diasComEventos[dia] = [];
    }
    if (!diasComEventos[dia].includes(titulo)) {
        diasComEventos[dia].push(titulo);
    }
}

function renderizarCalendario() {
    const grid = document.getElementById('calendario-grid');
    const mesAnoLabel = document.getElementById('calendario-mes-ano');
    if (!grid || !mesAnoLabel) return;
    
    const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    mesAnoLabel.innerText = `${nomesMeses[mesAtual]} ${anoAtual}`;
    
    // Limpar o grid, mas manter os dias da semana
    grid.innerHTML = `
        <div class="calendario-dia-semana">D</div>
        <div class="calendario-dia-semana">S</div>
        <div class="calendario-dia-semana">T</div>
        <div class="calendario-dia-semana">Q</div>
        <div class="calendario-dia-semana">Q</div>
        <div class="calendario-dia-semana">S</div>
        <div class="calendario-dia-semana">S</div>
    `;
    
    const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
    const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();
    
    // Obter quais dias têm evento
    const diasComEventos = extrairDiasComEventos(mesAtual, anoAtual);
    
    // Preencher dias vazios antes do dia 1
    for (let i = 0; i < primeiroDia; i++) {
        grid.innerHTML += `<div class="calendario-dia vazio"></div>`;
    }
    
    // Preencher os dias do mês
    const hoje = new Date();
    for (let dia = 1; dia <= diasNoMes; dia++) {
        let classes = 'calendario-dia';
        let tooltip = '';
        
        if (dia === hoje.getDate() && mesAtual === hoje.getMonth() && anoAtual === hoje.getFullYear()) {
            classes += ' hoje';
        }
        
        if (diasComEventos[dia]) {
            classes += ' tem-evento';
            tooltip = `<div class="tooltip-evento">${diasComEventos[dia].join('<br>')}</div>`;
        }
        
        grid.innerHTML += `<div class="${classes}">${dia}${tooltip}</div>`;
    }
}

function alterarMes(delta) {
    mesAtual += delta;
    if (mesAtual < 0) {
        mesAtual = 11;
        anoAtual--;
    } else if (mesAtual > 11) {
        mesAtual = 0;
        anoAtual++;
    }
    renderizarCalendario();
}

// Observar quando os eventos são carregados para atualizar o calendário
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            renderizarCalendario();
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('eventos-container');
    if (container) {
        observer.observe(container, { childList: true });
        // Tentativa de renderizar logo no início
        setTimeout(renderizarCalendario, 500); 
    }
});
