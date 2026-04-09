# Setup - TerêVerde MVP

## 📋 Pré-requisitos

- Python 3.8+ instalado
- pip (gerenciador de pacotes Python)

## 🚀 Como Rodar o Projeto

### 1. Instalar Dependências

```bash
pip install flask flask-cors
```

### 2. Iniciar o Servidor Backend (Flask)

Na pasta raiz do projeto, abra um terminal e execute:

```bash
python app.py
```

O servidor Flask rodará em: **http://localhost:5000**

### 3. Iniciar o Servidor Frontend (HTTP)

Em outro terminal, na pasta raiz do projeto, execute:

```bash
python -m http.server 8000
```

O site rodará em: **http://localhost:8000**

### 4. Acessar o Site

Abra no navegador: **http://localhost:8000**

---

## 📝 Funcionalidades de Autenticação

### Cadastro
- Nome completo
- Nome de usuário (username)
- Email
- Telefone
- Senha (mínimo 6 caracteres)

Os dados são armazenados em um banco de dados SQLite (`users.db`).

### Login
- Username: nome de usuário cadastrado
- Senha: senha cadastrada

Após login bem-sucedido, o usuário é salvo em `localStorage` e o botão de Login muda para mostrar o nome do usuário.

### Logout
Clique no botão com o nome do usuário para fazer logout.

---

## 📁 Estrutura do Projeto

```
MVP-Mobile/
├── app.py              # Backend Flask
├── index.html          # Interface principal
├── css/                # Estilos
│   └── syleLogin.css   # Estilos do modal de login/cadastro
├── js/
│   └── login.js        # Lógica de login e cadastro
├── api/                # APIs externas (clima)
├── img/                # Imagens
└── users.db            # Banco de dados SQLite (criado automaticamente)
```

---

## 🔒 Segurança

- Senhas são criptografadas com SHA256
- CORS habilitado para comunicação frontend-backend
- Validação de dados no frontend e backend

---

## 🐛 Troubleshooting

### "Erro ao conectar com o servidor"
- Certifique-se de que o servidor Flask está rodando na porta 5000
- Verifique se não há firewall bloqueando a porta

### "Usuário ou email já cadastrado"
- O username e email devem ser únicos
- Tente com valores diferentes

### "As senhas não coincidem"
- Verifique se digitou a mesma senha em ambos os campos

---

## 📞 Suporte

Para dúvidas ou problemas, verifique os arquivos de configuração e os logs do terminal.
