<<<<<<< HEAD
# Requisitos — Terê Verde MVP
=======
# Requisitos — MVP Mobile
>>>>>>> 535f544196ec56839ef3c86c13b8fe6983e1865f
 
---
 
## 1. Lista de Interessados
 
| Perfil | Descrição |
|---|---|
| **Usuário** | Qualquer indivíduo que acesse o site sem estar cadastrado. |
| **Turista** | Usuário que se cadastra no site como turista. |
| **Guia** | Profissional que se cadastra no site como guia turístico. |
| **Administrador** | Responsável por organizar e administrar o site. |
 
---
 
## 1.1 Requisitos Funcionais (RF)
 
### RF01 — Login e Senha
O site deve permitir login com usuário e senha.
 
**Descrição:** Caso o usuário ainda não tenha login, o site permitirá a criação de uma conta para que ele tenha acesso aos guias e privilégios de turista.
 
---
 
### RF02 — Tipos de Usuário
O login deve conter tipos de usuário.
 
**Descrição:** No momento do cadastro, o usuário deverá informar o tipo de perfil, podendo ser **Turista** ou **Guia**. O perfil **Administrador** é definido internamente.
 
---
 
### RF03 — Cadastrar Evento e Passeio
O site deve permitir cadastrar eventos e passeios.
 
**Descrição:** O administrador pode inserir novos eventos e passeios na plataforma.
 
---
 
### RF04 — Edição de Conteúdo
O site deve permitir a edição de conteúdo.
 
**Descrição:**
- O administrador pode editar qualquer evento ou passeio.
- O guia pode alterar informações dos passeios em que está inscrito.
---
 
### RF05 — Leitura de Conteúdos
O site deve permitir a leitura dos conteúdos.
 
**Descrição:** O usuário pode visualizar eventos e lugares disponíveis para passeio sem necessidade de login.
 
---
 
### RF06 — Sugestão de Passeios
O site deve permitir sugestões.
 
**Descrição:** Guias e turistas podem sugerir novos locais para passeio. A sugestão aguarda aprovação do administrador.
 
---
 
### RF07 — Acesso aos Guias
O site deve permitir acesso à lista de guias.
 
**Descrição:** O turista pode consultar os guias disponíveis para determinado passeio.
 
---
 
### RF08 — Front-End Responsivo
O site deve ser totalmente responsivo, adaptando-se a dispositivos móveis e desktops.
 
---
 
### RF09 — Temperatura em Tempo Real
O site exibe a temperatura atual de Teresópolis via API pública de clima.
 
---
 
## 1.2 Requisitos Não Funcionais (RNF)
 
### RNF01 — Responsividade
O site deve adaptar-se corretamente a diferentes tamanhos de tela e navegadores, garantindo uma experiência consistente no modo web e mobile.
 
### RNF02 — Desempenho
O site deve apresentar carregamento rápido e navegação fluida mesmo em conexões comuns.
 
### RNF03 — Usabilidade
A interface deve ser clara, intuitiva e visualmente coerente, com textos legíveis, botões acessíveis e organização consistente. A paleta de cores utiliza tons de verde escuro, representando a identidade visual da cidade de Teresópolis.
 
### RNF04 — Segurança
- Senhas armazenadas com criptografia (SHA-256).
- Proteção contra acessos não autorizados.
- Tratamento sigiloso de informações pessoais.
- Validação de permissões por tipo de usuário em cada rota.
### RNF05 — Manutenibilidade
O código deve ser estruturado de forma modular, organizado por responsabilidade (HTML, CSS, JS, Python), permitindo futuras melhorias sem comprometer o funcionamento atual.
 
### RNF06 — Disponibilidade
O site deve estar estável e disponível a qualquer momento para os usuários.
 
### RNF07 — Armazenamento
Os dados são armazenados em banco de dados **SQLite** (`users.db`), com arquitetura preparada para migração futura.
