// Variáveis
var modalAuth = document.getElementById('id_auth');
var slider = document.getElementById('sliderAuth');
const API_URL = 'http://localhost:5000/api';

// --- Funções de Abertura ---

// Abre o modal já na tela de Login (Posição 0)
function abrirModalLogin() {
    modalAuth.style.display = "block";
    animarParaLogin(); // Garante que está na esquerda
}

// Abre o modal já na tela de Cadastro (Posição -50%)
function abrirModalCadastro() {
    modalAuth.style.display = "block";
    animarParaCadastro(); // Garante que está na direita
}

// Fecha o modal
function fecharModalAuth() {
    modalAuth.style.display = "none";
    limparFormularios();
}

// --- Funções de Animação (Slide) ---

// Desliza para a Esquerda (Mostra Cadastro)
function animarParaCadastro() {
    slider.classList.add("slide-active");
}

// Desliza para a Direita (Mostra Login)
function animarParaLogin() {
    slider.classList.remove("slide-active");
}

// Limpar formulários
function limparFormularios() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="password"], input[type="email"]');
    inputs.forEach(input => input.value = '');
}

// --- Fechar ao clicar fora ---
window.onclick = function(event) {
    if (event.target == modalAuth) {
        fecharModalAuth();
    }
}

/* Função para abrir/fechar o menu mobile */
function toggleMenuMobile() {
    var menu = document.getElementById("mobileMenu");
    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
}

// Fechar o menu se clicar fora dele
window.onclick = function(event) {
    if (!event.target.matches('.hamburger-icon') && !event.target.matches('.fa-bars')) {
        var dropdowns = document.getElementsByClassName("mobile-menu-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.style.display === "block") {
                openDropdown.style.display = "none";
            }
        }
    }
    // Mantém a lógica do modal de login existente
    if (event.target == document.getElementById('id_auth')) {
        document.getElementById('id_auth').style.display = "none";
    }
}

// --- FUNÇÕES DE CADASTRO (BD) ---

async function enviarDadosGuia() {
    // 1. Pega os valores que o usuário digitou
    const nome = document.getElementById("guia-nome").value;
    const username = document.getElementById("guia-username").value;
    const email = document.getElementById("guia-email").value;
    const telefone = document.getElementById("guia-telefone").value;
    const senha = document.getElementById("guia-senha").value;
    const confirmar_senha = document.getElementById("guia-confirmar-senha").value;

    // 2. Validação simples (impede envio se faltar dados)
    if (nome === "" || username === "" || email === "" || telefone === "" || senha === "") {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    // 3. Validação de senhas
    if (senha !== confirmar_senha) {
        alert("As senhas não coincidem!");
        return;
    }

    if (senha.length < 6) {
        alert("A senha deve ter no mínimo 6 caracteres!");
        return;
    }

    if (username.length < 3) {
        alert("O usuário deve ter no mínimo 3 caracteres!");
        return;
    }

    if (!email.includes('@')) {
        alert("Email inválido!");
        return;
    }

    try {
        // 4. Enviar dados para o servidor
        const response = await fetch(`${API_URL}/cadastro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nome,
                email: email,
                telefone: telefone,
                username: username,
                senha: senha,
                confirmar_senha: confirmar_senha
            })
        });

        const data = await response.json();

        if (data.sucesso) {
            alert("✓ " + data.mensagem);
            fecharModalAuth();
            // Alternar para login automático
            setTimeout(() => {
                abrirModalLogin();
            }, 500);
        } else {
            alert("✗ " + data.mensagem);
        }
    } catch (error) {
        alert("Erro ao conectar com o servidor: " + error.message);
        console.error("Erro:", error);
    }
}

// --- FUNÇÕES DE LOGIN (BD) ---

async function fazerLogin(event) {
    event.preventDefault(); // Previne recarga da página

    // 1. Pega os valores do formulário de login
    const username = document.querySelector('.login-section input[name="uname"]').value;
    const senha = document.querySelector('.login-section input[name="psw"]').value;

    if (username === "" || senha === "") {
        alert("Por favor, preencha usuário e senha!");
        return;
    }

    try {
        // 2. Enviar dados para o servidor
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                senha: senha
            })
        });

        const data = await response.json();

        if (data.sucesso) {
            // 3. Salvar dados do usuário localmente
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            localStorage.setItem('logado', 'true');
            
            alert("✓ " + data.mensagem);
            fecharModalAuth();
            
            // Atualizar UI para mostrar que o usuário está logado
            atualizarUILogin(data.usuario);
        } else {
            alert("✗ " + data.mensagem);
        }
    } catch (error) {
        alert("Erro ao conectar com o servidor: " + error.message);
        console.error("Erro:", error);
    }
}

// Atualizar interface quando usuário faz login
function atualizarUILogin(usuario) {
    const loginBtn = document.querySelector('.loginbtn');
    const cadastroBtn = document.querySelector('.acessobtn');
    
    if (loginBtn && cadastroBtn) {
        // Muda o botão para mostrar o nome e a opção de sair
        loginBtn.textContent = `${usuario.nome} (Sair)`;
        
        // Lógica do Logout
        loginBtn.onclick = function() {
            localStorage.removeItem('usuario');
            localStorage.removeItem('logado');
            
            // Retorna os botões ao estado original
            loginBtn.textContent = 'Login';
            loginBtn.onclick = abrirModalLogin;
            cadastroBtn.style.display = 'inline-block';

            // --- NOVIDADE: VERIFICA SE ELE ESTÁ NA ABA RESTRITA ---
            const abaGuias = document.getElementById('Guias');
            if (abaGuias && abaGuias.style.display === 'block') {
                // Se ele estiver nos guias ao sair, "chuta" ele de volta pra Página Inicial
                document.getElementById('defaultOpen').click();
            }
        };
        
        // Esconde o botão de cadastro pois já está logado
        cadastroBtn.style.display = 'none';
    }
}

// Verificar se usuário já está logado ao carregar página
function verificarLoginAoCarregar() {
    if (localStorage.getItem('logado') === 'true') {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        atualizarUILogin(usuario);
    }
}

// Chamar função ao carregar página
document.addEventListener('DOMContentLoaded', verificarLoginAoCarregar);