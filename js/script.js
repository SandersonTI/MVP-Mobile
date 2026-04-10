// Aguarda o documento carregar para rodar o script
document.addEventListener("DOMContentLoaded", () => {
    
    // Pega todos os cabeçalhos de parque
    const parkHeaders = document.querySelectorAll(".park-header");

    parkHeaders.forEach(header => {
        // Adiciona um evento de clique em cada cabeçalho
        header.addEventListener("click", () => {
            
            // O card que contém o header (e, portanto, a lista + o slider)
            const card = header.closest(".park-card");
            if (card) {
                card.classList.toggle("open");   // abre ou fecha tudo de uma vez
            }
        });
    });

    // Bônus: Deixar o primeiro parque aberto por padrão
    const firstTrailList = document.querySelector(".park-card");
    if (firstTrailList) {
        firstTrailList.classList.add("open");
    }

});

// --- FUNÇÃO DE CONTROLE DAS ABAS (COM TRAVA DE SEGURANÇA) ---
function openPage(pageName, elmnt, color) {
    
    // 1. A NOSSA CATRACA: Trava de segurança para a aba de Guias
    if (pageName === 'Guias') {
        // Verifica na memória do navegador se a pessoa está logada
        const usuarioLogado = localStorage.getItem('logado') === 'true';
        
        // Se NÃO estiver logada, bloqueia e abre o login
        if (!usuarioLogado) {
            alert('Área restrita! Faça login ou cadastre-se para acessar nossos guias exclusivos.');
            
            // Chama a sua função que abre o modal de login
            if (typeof abrirModalLogin === "function") {
                abrirModalLogin(); 
            }
            
            return; // O 'return' mata a função aqui, impedindo a aba de abrir
        }
    }

    // 2. LÓGICA PADRÃO: Esconde todas as abas
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // 3. Tira a cor de fundo de todos os botões do menu
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }

    // 4. Mostra a aba que o usuário clicou e pinta o botão
    const abaAlvo = document.getElementById(pageName);
    if (abaAlvo) {
        abaAlvo.style.display = "block";
    }
    
    if (elmnt) {
        elmnt.style.backgroundColor = color;
    }
}

// 5. Garante que a Página Inicial abra sozinha quando o site carregar
document.addEventListener("DOMContentLoaded", function() {
    var defaultTab = document.getElementById("defaultOpen");
    if(defaultTab) {
        defaultTab.click();
    }
});