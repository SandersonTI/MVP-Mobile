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
    // Captura o tipo selecionado (turista ou guia)
    const tipoRadio = document.querySelector('input[name="tipo-cadastro"]:checked');
    const tipo = tipoRadio ? tipoRadio.value : 'turista';
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
        // Lê campos de guia (vazios se tipo = turista)
        const instagram = document.getElementById('guia-instagram')?.value.trim() || '';
        const linkedin  = document.getElementById('guia-linkedin')?.value.trim()  || '';
        const facebook  = document.getElementById('guia-facebook')?.value.trim()  || '';
        const servico   = document.getElementById('guia-servico')?.value.trim()   || '';

        // 4. Enviar dados para o servidor
        const response = await fetch(`${API_URL}/cadastro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome, email, telefone, username, senha, confirmar_senha, tipo,
                foto_base64: fotoBase64Guia,
                instagram, linkedin, facebook, servico
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
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            localStorage.setItem('logado', 'true');
            alert("✓ " + data.mensagem);
            fecharModalAuth();
            atualizarUILogin(data.usuario);
        } else if (data.bloqueado) {
            // Cria modal de feedback visual ao invés de alert simples
            fecharModalAuth();
            mostrarMensagemBloqueio(data.mensagem, data.motivo);
        } else {
            alert("✗ " + data.mensagem);
        }
    } catch (error) {
        alert("Erro ao conectar com o servidor: " + error.message);
        console.error("Erro:", error);
    }
}

// Adapta a interface após login (botões, aba admin, tipo do usuário)
function atualizarUILogin(usuario) {
    const loginBtn    = document.querySelector('.loginbtn');
    const cadastroBtn = document.querySelector('.acessobtn');
    if (loginBtn && cadastroBtn) {
        loginBtn.textContent = `${usuario.nome} (Sair)`;
        loginBtn.onclick = fazerLogout;
        cadastroBtn.style.display = 'none';
    }
    // ── NOVO: atualiza o menu mobile ──
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.innerHTML = `
            <a href="#" onclick="fazerLogout(); toggleMenuMobile()">
                👤 ${usuario.nome} (Sair)
            </a>`;
    }
    // Exibe aba Admin somente para o administrador
    const abaAdminBtn    = document.getElementById('btn-admin');
    const abaSugestaoBtn = document.querySelector('.tablink[onclick*="Sugestoes"]');
    if (abaAdminBtn) {
        abaAdminBtn.style.display = (usuario.tipo === 'admin') ? 'inline-block' : 'none';
    }
    // Oculta Sugestões para admin; mostra para os demais
    if (abaSugestaoBtn) {
        abaSugestaoBtn.style.display = (usuario.tipo === 'admin') ? 'none' : 'inline-block';
    }
    // Guarda tipo no body para outros scripts consultarem
    document.body.dataset.tipoUsuario = usuario.tipo;
    document.body.dataset.userId      = usuario.id;
    // Se for guia, carrega inscrições dele para marcar botões corretos
    if (usuario.tipo === 'guia' && typeof carregarInscricoesDoGuia === 'function') {
        carregarInscricoesDoGuia(usuario.id);
    }
}

// Efetua logout e restaura estado inicial da UI
function fazerLogout() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('logado');
    const loginBtn    = document.querySelector('.loginbtn');
    const cadastroBtn = document.querySelector('.acessobtn');
    if (loginBtn)    { loginBtn.textContent = 'Login'; loginBtn.onclick = abrirModalLogin; }
    if (cadastroBtn) cadastroBtn.style.display = 'inline-block';
    const abaAdminBtn    = document.getElementById('btn-admin');
    const abaSugestaoBtn = document.querySelector('.tablink[onclick*="Sugestoes"]');
    if (abaAdminBtn)    abaAdminBtn.style.display = 'none';
    if (abaSugestaoBtn) abaSugestaoBtn.style.display = 'inline-block';
    // ── Restaura menu mobile com Login e Cadastro ──
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.innerHTML = `
            <a href="#" onclick="abrirModalLogin(); toggleMenuMobile()">Login</a>
            <a href="#" onclick="abrirModalCadastro(); toggleMenuMobile()">Cadastro</a>`;
        mobileMenu.style.display = 'none'; // fecha o menu após logout
    }
    delete document.body.dataset.tipoUsuario;
    delete document.body.dataset.userId;
    document.getElementById('defaultOpen').click();
}
// ── Helpers exportados ────────────────────────────────────────────

/** Retorna objeto do usuário logado ou null se não estiver logado. */
function getUsuarioLogado() {
    if (localStorage.getItem('logado') !== 'true') return null;
    return JSON.parse(localStorage.getItem('usuario'));
}
/** Destaca visualmente o cashbox selecionado no cadastro */
function selecionarTipo(tipo) {
    const boxes = document.querySelectorAll('.tipo-cashbox');
    boxes.forEach(b => { b.style.borderColor='#ccc'; b.style.background='transparent'; });
    const escolhido = document.getElementById(`box-${tipo}`);
    if (escolhido) { escolhido.style.borderColor='var(--button-3)'; escolhido.style.background='rgba(52,77,14,.08)'; }
    const radio = document.getElementById(`radio-${tipo}`);
    if (radio) radio.checked = true;
    // Mostra campos extras somente para guia
    const camposGuia = document.getElementById('campos-guia');
    if (camposGuia) camposGuia.style.display = (tipo === 'guia') ? 'block' : 'none';
}

/** Converte foto do guia para base64 */
let fotoBase64Guia = '';
function processarFotoGuia(input) {
    const prev = document.getElementById('guia-foto-preview');
    if (!input.files || !input.files[0]) { fotoBase64Guia=''; if(prev) prev.innerHTML=''; return; }
    const r = new FileReader();
    r.onload = e => {
        fotoBase64Guia = e.target.result;
        if (prev) prev.innerHTML = `<img src="${fotoBase64Guia}" style="max-height:80px;border-radius:6px;margin-top:.3rem">`;
    };
    r.readAsDataURL(input.files[0]);
}
// Inicia com Turista selecionado visualmente
document.addEventListener('DOMContentLoaded', () => selecionarTipo('turista'));
/** Retorna true se o usuário logado for do tipo informado. */
function isUsuarioTipo(tipo) {
    const u = getUsuarioLogado();
    return u && u.tipo === tipo;
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

/** Exibe um modal de feedback para guias com cadastro pendente ou reprovado */
function mostrarMensagemBloqueio(mensagem, motivo) {
    // Verifica se já existe modal; cria se não existir
    let modal = document.getElementById('modal-bloqueio');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-bloqueio';
        modal.style.cssText = `
            position:fixed; inset:0; background:rgba(0,0,0,.7);
            display:flex; align-items:center; justify-content:center;
            z-index:9999; padding:1rem;`;
        document.body.appendChild(modal);
    }
    const cor   = motivo === 'pendente' ? '#f39c12' : '#c0392b';
    const icone = motivo === 'pendente' ? '⏳' : '❌';
    modal.innerHTML = `
        <div style="background:var(--primary,#012c18); border:2px solid ${cor};
                    border-radius:14px; padding:2rem; max-width:380px; text-align:center;">
            <div style="font-size:3rem">${icone}</div>
            <p style="color:#fff; font-size:1rem; white-space:pre-line; margin:1rem 0 1.5rem">${mensagem}</p>
            <button onclick="document.getElementById('modal-bloqueio').style.display='none'"
                    style="background:${cor}; color:#fff; border:none; border-radius:8px;
                           padding:.6rem 1.4rem; cursor:pointer; font-size:.95rem;">
                Entendido
            </button>
        </div>`;
    modal.style.display = 'flex';
}
