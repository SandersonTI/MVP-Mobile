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

// Fechar o menu e dropdowns se clicar fora dele
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
    
    // Fechar dropdown de perfil
    if (!event.target.matches('.perfil-btn') && !event.target.closest('.perfil-dropdown')) {
        const dd = document.getElementById('dropdownPerfil');
        if (dd && dd.parentElement.classList.contains('show')) {
            dd.parentElement.classList.remove('show');
        }
    }

    // Mantém a lógica dos modais
    if (event.target == document.getElementById('id_auth')) {
        document.getElementById('id_auth').style.display = "none";
    }
    if (event.target == document.getElementById('modal-esqueci-senha')) {
        document.getElementById('modal-esqueci-senha').style.display = "none";
    }
    if (event.target == document.getElementById('modal-redefinir-senha')) {
        document.getElementById('modal-redefinir-senha').style.display = "none";
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
    // Distingue guia (pendente) de turista (acesso imediato)
    if (tipo === 'guia') {
        alert("✓ Cadastro de guia enviado com sucesso!\n\n⏳ Seu acesso ficará disponível após aprovação do administrador. Você será notificado.");
        fecharModalAuth();
    } else {
        alert("✓ " + data.mensagem);
        fecharModalAuth();
        setTimeout(() => {
            abrirModalLogin();
        }, 500);
    }
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
    const lembrar = document.querySelector('.login-section input[name="remember"]').checked;

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
            if (lembrar) {
                localStorage.setItem('usuario', JSON.stringify(data.usuario));
                localStorage.setItem('logado', 'true');
            } else {
                sessionStorage.setItem('usuario', JSON.stringify(data.usuario));
                sessionStorage.setItem('logado', 'true');
            }
            alert("✓ " + data.mensagem);
            fecharModalAuth();
            atualizarUILogin(data.usuario);
        } else if (data.bloqueado) {
            // Cria modal de feedback visual ao invés de alert simples
            fecharModalAuth();
            // Primeiro, busca o id do usuário bloqueado (adicionar ao retorno do backend)
mostrarMensagemBloqueio(data.mensagem, data.motivo, data.usuario_id);
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
    const userArea = document.getElementById('header-user-area');
    if (userArea) {
        userArea.innerHTML = `
            <div class="perfil-dropdown">
                <button class="perfil-btn" onclick="toggleDropdownPerfil()">
                    👤 ${usuario.nome} ▾
                </button>
                <div id="dropdownPerfil" class="dropdown-content">
                    <a onclick="abrirModalPerfil()">Meu Perfil</a>
                    <a onclick="fazerLogout()">Sair</a>
                </div>
            </div>
        `;
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
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('logado');
    
    const userArea = document.getElementById('header-user-area');
    if (userArea) {
        userArea.innerHTML = `
            <button class="btn loginbtn" onclick="abrirModalLogin()">Login</button>
            <button class="btn acessobtn" onclick="abrirModalCadastro()">Cadastro</button>
        `;
    }

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
    if (localStorage.getItem('logado') === 'true') {
        return JSON.parse(localStorage.getItem('usuario'));
    }
    if (sessionStorage.getItem('logado') === 'true') {
        return JSON.parse(sessionStorage.getItem('usuario'));
    }
    return null;
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
    const usuarioLogado = getUsuarioLogado();
    if (usuarioLogado) {
        atualizarUILogin(usuarioLogado);
    }
}

// Chamar função ao carregar página
document.addEventListener('DOMContentLoaded', verificarLoginAoCarregar);

/** Exibe um modal de feedback para guias com cadastro pendente ou reprovado */
function mostrarMensagemBloqueio(mensagem, motivo, userId = null) {
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
                           padding:.6rem 1.4rem; cursor:pointer; font-size:.95rem; margin:.3rem;">
                Fechar
            </button>
            ${motivo === 'reprovado' && userId ? `
            <button onclick="refazerCadastroGuia(${userId})"
                    style="background:#2c3e50; color:#fff; border:1px solid #fff; border-radius:8px;
                           padding:.6rem 1.4rem; cursor:pointer; font-size:.95rem; margin:.3rem;">
                🔄 Refazer Cadastro
            </button>` : ''}
        </div>`;
    modal.style.display = 'flex';
}

async function refazerCadastroGuia(userId) {
    if (!confirm('Isso excluirá seu cadastro atual para que você possa se cadastrar novamente. Confirmar?')) return;
    try {
        const res  = await fetch(`${API_URL}/usuario/${userId}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.sucesso) {
            document.getElementById('modal-bloqueio').style.display = 'none';
            alert('✓ Cadastro anterior removido. Agora você pode se cadastrar novamente.');
            abrirModalCadastro();
        } else {
            alert('✗ ' + data.mensagem);
        }
    } catch(e) {
        alert('Erro ao conectar: ' + e.message);
    }
}

// --- FUNÇÕES DE PERFIL ---

function toggleDropdownPerfil() {
    const dd = document.querySelector('.perfil-dropdown');
    if (dd) dd.classList.toggle('show');
}

let fotoBase64Perfil = '';

async function abrirModalPerfil() {
    // Esconde dropdown
    const dd = document.querySelector('.perfil-dropdown');
    if (dd) dd.classList.remove('show');
    
    const usuarioLogado = getUsuarioLogado();
    if (!usuarioLogado) return;
    
    try {
        const res = await fetch(`${API_URL}/usuario/${usuarioLogado.id}`);
        const data = await res.json();
        
        if (data.sucesso) {
            const u = data.usuario;
            fotoBase64Perfil = u.foto_base64 || '';
            
            let htmlCampos = `
                <div class="perfil-section-title">Dados Básicos</div>
                <label>Nome</label>
                <input type="text" id="perfil-nome" value="${u.nome}">
                
                <label>Email</label>
                <input type="email" id="perfil-email" value="${u.email}">
                
                <label>Telefone</label>
                <input type="tel" id="perfil-telefone" value="${u.telefone}">
            `;
            
            if (u.tipo === 'guia') {
                htmlCampos += `
                    <div class="perfil-section-title">Perfil de Guia</div>
                    
                    <div class="perfil-foto-preview-container">
                        <img id="perfil-foto-img" src="${fotoBase64Perfil || 'img/identidade_visual/Icone-TereVerde2.svg'}" alt="Foto de perfil">
                    </div>
                    <input type="file" accept="image/*" onchange="processarNovaFotoPerfil(this)">
                    
                    <label>Serviço oferecido</label>
                    <input type="text" id="perfil-servico" value="${u.servico || ''}">
                    
                    <label>Instagram</label>
                    <input type="url" id="perfil-instagram" value="${u.instagram || ''}">
                    
                    <label>LinkedIn</label>
                    <input type="url" id="perfil-linkedin" value="${u.linkedin || ''}">
                    
                    <label>Facebook</label>
                    <input type="url" id="perfil-facebook" value="${u.facebook || ''}">
                `;
            }
            
            htmlCampos += `
                <div class="perfil-section-title">Alterar Senha (Opcional)</div>
                <label>Senha Atual</label>
                <input type="password" id="perfil-senha-atual" placeholder="Digite para confirmar alterações">
                
                <label>Nova Senha</label>
                <input type="password" id="perfil-nova-senha" placeholder="Apenas se quiser alterar">
            `;
            
            document.getElementById('form-perfil-campos').innerHTML = htmlCampos;
            document.getElementById('modal-perfil').style.display = 'block';
            
        } else {
            alert('Erro ao carregar perfil: ' + data.mensagem);
        }
    } catch (e) {
        alert('Erro de conexão: ' + e.message);
    }
}

function processarNovaFotoPerfil(input) {
    if (!input.files || !input.files[0]) return;
    const r = new FileReader();
    r.onload = e => {
        fotoBase64Perfil = e.target.result;
        const img = document.getElementById('perfil-foto-img');
        if (img) img.src = fotoBase64Perfil;
    };
    r.readAsDataURL(input.files[0]);
}

function fecharModalPerfil() {
    document.getElementById('modal-perfil').style.display = 'none';
}

async function salvarPerfil() {
    const usuarioLogado = getUsuarioLogado();
    if (!usuarioLogado) return;
    
    const payload = {
        nome: document.getElementById('perfil-nome').value,
        email: document.getElementById('perfil-email').value,
        telefone: document.getElementById('perfil-telefone').value,
        senha_atual: document.getElementById('perfil-senha-atual').value,
        nova_senha: document.getElementById('perfil-nova-senha').value
    };
    
    if (usuarioLogado.tipo === 'guia') {
        payload.foto_base64 = fotoBase64Perfil;
        payload.servico = document.getElementById('perfil-servico').value;
        payload.instagram = document.getElementById('perfil-instagram').value;
        payload.linkedin = document.getElementById('perfil-linkedin').value;
        payload.facebook = document.getElementById('perfil-facebook').value;
    }
    
    try {
        const res = await fetch(`${API_URL}/usuario/${usuarioLogado.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const data = await res.json();
        if (data.sucesso) {
            alert('✓ ' + data.mensagem);
            
            // Atualiza localstorage
            usuarioLogado.nome = payload.nome;
            usuarioLogado.email = payload.email;
            localStorage.setItem('usuario', JSON.stringify(usuarioLogado));
            
            // Atualiza UI
            atualizarUILogin(usuarioLogado);
            fecharModalPerfil();
            
        } else {
            alert('✗ ' + data.mensagem);
        }
    } catch (e) {
        alert('Erro ao salvar perfil: ' + e.message);
    }
}

// --- FUNÇÕES DE RECUPERAÇÃO DE SENHA ---

function mostrarEsqueciSenha() {
    fecharModalAuth();
    document.getElementById('esqueci-email').value = '';
    document.getElementById('esqueci-feedback').innerHTML = '';
    document.getElementById('modal-esqueci-senha').style.display = 'block';
}

async function enviarRecuperacao() {
    const email = document.getElementById('esqueci-email').value;
    if (!email) {
        alert("Por favor, informe seu email.");
        return;
    }
    
    try {
        const res = await fetch(`${API_URL}/esqueci-senha`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await res.json();
        
        const feedback = document.getElementById('esqueci-feedback');
        if (data.sucesso) {
            // Em produção seria enviado por email. Para o MVP, mostramos na tela.
            if (data.token) {
                feedback.innerHTML = `✅ Link gerado! (Simulação de Email)<br>
                <a href="#" onclick="mostrarRedefinirSenha('${data.token}')" style="color:var(--primary-hover); text-decoration:underline;">Clique aqui para redefinir</a>`;
            } else {
                feedback.innerHTML = `✅ Se o email existir em nossa base, um link foi enviado.`;
            }
        } else {
            alert('✗ ' + data.mensagem);
        }
    } catch (e) {
        alert('Erro ao conectar: ' + e.message);
    }
}

function mostrarRedefinirSenha(token) {
    document.getElementById('modal-esqueci-senha').style.display = 'none';
    document.getElementById('redefinir-token').value = token;
    document.getElementById('redefinir-senha1').value = '';
    document.getElementById('redefinir-senha2').value = '';
    document.getElementById('modal-redefinir-senha').style.display = 'block';
}

async function redefinirSenha() {
    const token = document.getElementById('redefinir-token').value;
    const s1 = document.getElementById('redefinir-senha1').value;
    const s2 = document.getElementById('redefinir-senha2').value;
    
    if (s1 !== s2) {
        alert("As senhas não coincidem.");
        return;
    }
    
    if (s1.length < 6) {
        alert("A senha deve ter no mínimo 6 caracteres.");
        return;
    }
    
    try {
        const res = await fetch(`${API_URL}/redefinir-senha`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, nova_senha: s1 })
        });
        const data = await res.json();
        
        if (data.sucesso) {
            alert("✓ " + data.mensagem);
            document.getElementById('modal-redefinir-senha').style.display = 'none';
            abrirModalLogin();
        } else {
            alert("✗ " + data.mensagem);
        }
    } catch (e) {
        alert('Erro ao conectar: ' + e.message);
    }
}