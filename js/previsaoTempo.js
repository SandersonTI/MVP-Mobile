// Coordenadas de Teresópolis - RJ
const lat = -22.4122;
const lon = -42.9656;
const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=America/Sao_Paulo`;

// Define a variável GLOBALMENTE para que o outro arquivo consiga ler
window.trilhaStatus = "aberta"; 

// Mapping simplificado de ícones: Sol, Nuvem com Chuva, ou Lua
const iconMapping = {
    0: '☀️',      // Céu limpo - Sol
    1: '☀️',      // Principalmente céu limpo - Sol
    2: '☀️',      // Parcialmente nublado - Sol
    3: '☁️',      // Céu encoberto - Nuvem
    45: '☁️',     // Neblina - Nuvem
    48: '☁️',     // Neblina com depósito de gelo - Nuvem
    51: '🌧️',     // Garoa leve - Chuva
    53: '🌧️',     // Garoa moderada - Chuva
    55: '🌧️',     // Garoa densa - Chuva
    61: '🌧️',     // Chuva leve - Chuva
    63: '🌧️',     // Chuva moderada - Chuva
    65: '🌧️',     // Chuva pesada - Chuva
    71: '🌧️',     // Neve leve - Chuva
    73: '🌧️',     // Neve moderada - Chuva
    75: '🌧️',     // Neve pesada - Chuva
    77: '🌧️',     // Grãos de neve - Chuva
    80: '🌧️',     // Pancadas de chuva leve - Chuva
    81: '🌧️',     // Pancadas de chuva moderada - Chuva
    82: '🌧️',     // Pancadas de chuva forte - Chuva
    85: '🌧️',     // Pancadas de neve leve - Chuva
    86: '🌧️',     // Pancadas de neve forte - Chuva
    95: '🌧️',     // Tempestade - Chuva
    96: '🌧️',     // Tempestade com granizo leve - Chuva
    99: '🌧️'      // Tempestade com granizo forte - Chuva
};

fetch(url)
    .then(response => response.json())
    .then(data => {
        const clima = data.current_weather;
        const temperatura = Math.round(clima.temperature);
        const velocidadeVento = Math.round(clima.windspeed);
        const codigoTempo = clima.weather_code;
        
        // Descrição baseada no código de tempo (WMO Weather codes)
        let descricao = "Não definido";
        let condicao = "nublado";
        let icone = iconMapping[codigoTempo] || '🌡️';
        
        if (codigoTempo === 0) {
            descricao = "Céu limpo";
            condicao = "limpo";
        } else if (codigoTempo === 1 || codigoTempo === 2) {
            descricao = "Principalmente céu limpo";
            condicao = "limpo";
        } else if (codigoTempo === 3) {
            descricao = "Céu encoberto";
            condicao = "nublado";
        } else if (codigoTempo === 45 || codigoTempo === 48) {
            descricao = "Neblina";
            condicao = "nublado";
        } else if ((codigoTempo >= 51 && codigoTempo <= 67) || (codigoTempo >= 80 && codigoTempo <= 82)) {
            descricao = "Chuva";
            condicao = "chuva";
        } else if (codigoTempo >= 71 && codigoTempo <= 77) {
            descricao = "Neve";
            condicao = "neve";
        } else if (codigoTempo >= 80 && codigoTempo <= 82) {
            descricao = "Chuva forte";
            condicao = "chuva";
        } else if (codigoTempo === 85 || codigoTempo === 86) {
            descricao = "Pancadas de neve";
            condicao = "neve";
        } else if (codigoTempo >= 80 && codigoTempo <= 99) {
            descricao = "Tempestade";
            condicao = "tempestade";
        }

        // 1. Atualiza o cabeçalho do clima
        const elMax = document.querySelector(".temp-max");
        const elMin = document.querySelector(".temp-min");
        const elDesc = document.querySelector(".descricao");
        const elIcon = document.querySelector(".weather-icon");

        if(elMax) elMax.textContent = `${temperatura}°`;
        if(elMin) elMin.textContent = `Vento: ${velocidadeVento}km/h`;
        // Ocultar descrição se estiver "Não Definido"
        if(elDesc) {
            if(descricao === "Não definido") {
                elDesc.style.display = 'none';
            } else {
                elDesc.textContent = descricao;
                elDesc.style.display = 'block';
            }
        }
        
        // Converter emoji para data URL com tamanho reduzido
        if(elIcon) {
            const emojiDataUrl = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="24">${icone}</text></svg>`;
            elIcon.src = emojiDataUrl;
            elIcon.style.width = "40px";
            elIcon.style.height = "40px";
        }

        // 2. Define status GLOBAL da trilha
        if (condicao.includes("chuva") || condicao.includes("tempestade") || condicao.includes("neve")) {
            window.trilhaStatus = "fechada";            
        } else {
            window.trilhaStatus = "aberta";            
        }

        console.log(`Clima carregado. Temperatura: ${temperatura}°C, Vento: ${velocidadeVento} km/h, Status global: ${window.trilhaStatus}`);

        // 3. AVISA o outro script para atualizar as cores das trilhas IMEDIATAMENTE
        if (window.atualizarStatusTrilhas) {
            window.atualizarStatusTrilhas();
        }
    })
    .catch(error => {
        console.error("Erro ao obter clima:", error);
        const elDesc = document.querySelector(".descricao");
        if(elDesc) elDesc.textContent = "Não foi possível carregar o clima.";
    });