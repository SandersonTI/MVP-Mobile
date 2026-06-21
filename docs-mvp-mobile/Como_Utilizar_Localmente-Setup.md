# Como Utilizar Localmente — MVP Mobile
 
---
 
## Pré-requisitos
 
| Ferramenta | Versão mínima |
|---|---|
| Python | 3.10+ |
| pip | Qualquer versão atual |
| VS Code | Opcional, recomendado |
| Extensão REST Client | Para testar rotas via `teste.http` |
 
---
 
## Passo a Passo
 
### 1. Clonar o Repositório
 
```bash
git clone https://github.com/SandersonTI/Mvp-Mobile.git
cd Mvp-Mobile
```
 
---
 
### 2. Instalar Dependências
 
```bash
pip install flask flask-cors
```
 
---
 
### 3. Iniciar o Servidor Back-End (Flask)
 
Na pasta raiz do projeto, execute:
 
```bash
python app.py
```
 
O servidor ficará disponível em:
 
```
http://127.0.0.1:5000
```
 
---
 
### 4. Iniciar o Servidor Front-End
 
Em outro terminal, na mesma pasta raiz, execute:
 
```bash
python -m http.server 8000
```
 
O site ficará disponível em:
 
```
http://localhost:8000
```
 
---
 
### 5. Acessar o Site
 
Abra no navegador:
 
```
http://localhost:8000
```
 
---
 
### 6. Testar as Rotas com REST Client (opcional)
 
Abra o arquivo `teste.http` no VS Code e clique em **Send Request** em cada requisição para testar todas as rotas implementadas.
 
---
 
## Estrutura do Projeto
 
```
MVP-Mobile/
├── app.py                  # Back-end Flask
├── index.html              # Interface principal
├── users.db                # Banco de dados SQLite (criado automaticamente)
├── requirements.txt        # Dependências do projeto
├── css/
│   ├── style.css
│   ├── styleEventos.css
│   ├── styleGuia.css
│   ├── styleSobre.css
│   └── syleLogin.css
├── js/
│   ├── login.js
│   ├── admin.js
│   ├── eventosCards.js
│   ├── guiaCards.js
│   ├── horarioFuncionamento.js
│   ├── sugestaoCards.js
│   └── ...
├── api/
│   └── clima.js            # Integração com API de clima
└── img/                    # Imagens do projeto
    ├── banner-principal/
    ├── eventos/
    ├── guias/
    ├── parques/
    └── identidade_visual/
```
 
---
 
## Segurança
 
- Senhas criptografadas com **SHA-256**
- CORS habilitado para comunicação frontend-backend
- Validação de dados no frontend e no backend
- Controle de permissões por tipo de usuário em cada rota
---
 
## Solução de Problemas
 
### "Erro ao conectar com o servidor"
- Verifique se o servidor Flask está rodando na porta `5000`.
- Confirme que nenhum firewall está bloqueando a porta.
### "Usuário ou e-mail já cadastrado"
- Username e e-mail devem ser únicos no sistema.
- Tente cadastrar com valores diferentes.
### "As senhas não coincidem"
- Verifique se digitou a mesma senha nos dois campos de cadastro.
### Página em branco ou sem dados
- Confirme que **ambos** os servidores estão rodando (Flask na 5000 e HTTP na 8000).
- Abra o console do navegador (F12) para verificar erros de requisição.
---
 
## Observações Finais
 
Este MVP foi estruturado para demonstrar:
 
- Responsividade para modo mobile
- Fluxo completo de autenticação com tipos de usuário
- CRUD parcial com controle de permissões
- Regras de negócio reais (aprovação de guias, sugestões, inscrições)
- Retorno estruturado em JSON com HTTP status apropriado
