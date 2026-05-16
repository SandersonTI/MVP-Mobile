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
    // Obtém o usuário logado (definido em login.js)
    const usuario = getUsuarioLogado();
    const tipo    = usuario ? usuario.tipo : null;

    // Trava: Guias → só logados
    if (pageName === 'Guias' && !usuario) {
        alert('🔒 Faça login para ver os guias exclusivos.');
        if (typeof abrirModalLogin === 'function') abrirModalLogin();
        return;
    }
    // Trava: Sugestões → turistas e guias logados
    if (pageName === 'Sugestoes' && (!usuario || tipo === 'admin')) {
        alert('🔒 Sugestões são exclusivas para turistas e guias cadastrados.');
        if (!usuario && typeof abrirModalLogin === 'function') abrirModalLogin();
        return;
    }
    // Trava: Admin → somente admin
    if (pageName === 'Admin' && tipo !== 'admin') {
        alert('🔒 Área exclusiva do administrador.'); return;
    }

    // Esconde todas as abas e remove destaque dos botões
    Array.from(document.getElementsByClassName('tabcontent'))
         .forEach(t => t.style.display = 'none');
    Array.from(document.getElementsByClassName('tablink'))
         .forEach(b => b.style.backgroundColor = '');

    // Exibe a aba solicitada
    const alvo = document.getElementById(pageName);
    if (alvo)  alvo.style.display = 'block';
    if (elmnt) elmnt.style.backgroundColor = color;
    // Ações ao abrir cada aba
    if (pageName === 'Admin'     && typeof renderizarPainelAdmin === 'function') renderizarPainelAdmin();
    if (pageName === 'Sugestoes' && typeof renderizarSugestoes   === 'function') renderizarSugestoes();
    if (pageName === 'Passeios') {
        if (typeof controlarVisibilidadeBotoesInscricao === 'function') controlarVisibilidadeBotoesInscricao();
        if (typeof carregarPasseiosDinamicos === 'function') carregarPasseiosDinamicos();
    }
}

// Garante que a Página Inicial abra sozinha quando o site carregar
document.addEventListener("DOMContentLoaded", function() {
    var defaultTab = document.getElementById("defaultOpen");
    if(defaultTab) {
        defaultTab.click();
    }
});