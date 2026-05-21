Caso de Uso

1.Lista de Interessados
1.1 — Usuário
qualquer indivíduo que acesse o site, sem ser cadastrado.
1.2 — Turista
usuário que se cadastra no site como turista.
1.3 — Guia
profissional que se cadastra no site como guia turístico.
1.4 — Administrador
organizador e administrador do site.

Sequências de Casos de Uso 
Projeto MVP Mobile
Abaixo está alguns fluxos completos que exploram as principais funcionalidades do sistema: Turista, Guia e Admin.

2.Cadastro e Autenticação
Caso de Uso 2.1 — Cadastrar Turista
Ator: Turista
 Objetivo: Criar uma conta para acessar o sistema.
 Fluxo Principal:
Turista envia seus dados.
O sistema valida dados.
O turista é criado e armazenado.
Retorna mensagem de sucesso.

Caso de Uso 2.2 — Cadastrar Guia
Ator: Guia Turístico
 Objetivo: Criar conta para publicar passeios.
 Fluxo Principal:
Guia envia seus dados.
Sistema valida os dados
O admin recebe validação e aprova
O guia é registrado.
Guia possui acesso.

Caso de Uso 2.3 — Login do Turista
Ator: Turista
 Objetivo: Gerenciar usuários e passeios.
 Fluxo:
Turista envia usuário e senha.
Sistema valida.
Retorna tipo de usuário.
 

Caso de Uso 2.4 — Login do Guia
Ator: Turista, Parceiro ou Admin
 Objetivo: Acessar o sistema.
 Fluxo:
Usuário envia usuário e senha.
Sistema valida.
Retorna tipo de usuário

Caso de Uso 2.5 — Login do Admin
Ator: Turista, Parceiro ou Admin
 Objetivo: Acessar o sistema.
 Fluxo:
Usuário envia usuário e senha.
Sistema valida.
Retorna tipo de usuário

3.Funcionalidades do Turista
Caso de Uso 3.1 — Consultar Guias Disponíveis em passeios.
Ator: Turista
 Objetivo: Ver lista atualizada de guias disponíveis para passeios.
 Fluxo:
Turista faz login.
Acessa aba passeios
Visualiza passeios na sub aba passeio.
Clica em Guias disponíveis, para visualizar guias inscritos no passeio.

 Caso de Uso 3.2 — Sugestões de Passeios
Ator: Turista
 Objetivo: Sugerir um novo local para passeio.
 Fluxo:
Turista faz login.
Acessa aba sugestões.
Preenche sugestão.
Envia sugestão.
Aguarda aprovação do Admin.

Caso de Uso 3.3 — Conhecendo Guia
Ator: Turista
 Objetivo: Conhecer guias.
 Fluxo:
Turista faz login.
Acessa aba guia.
Seleciona um guia e clica em sua rede social.
Clica em “Entre em contato”.
Informa seu nome.
Seleciona um parque.
Escreve uma mensagem.
Clica em “Enviar via WhatsApp.

4. Funcionalidades do Guia
Caso de Uso 4.1 — Disponível em Passeios.
Ator: Guia
 Objetivo: Inscrever-se em passeios.
 Fluxo:
Guia faz login
Acessa a aba passeios.
Visualiza passeios na sub aba passeio.
Clica no botão “Inscrever-se”.

Caso de Uso 4.2 — Sugestões de passeios
Ator: Guia
 Objetivo: Sugerir um novo local para passeio.
 Fluxo:
Guia faz login.
Acessa aba sugestões.
Preenche sugestão.
Envia sugestão.
Aguarda aprovação do Admin.

5. Funcionalidades do Admin
Caso de Uso 5.1 — Criar Evento
Ator: Administrador
 Objetivo: Criar evento.
 Fluxo:
Admin faz login.
Acessa aba admin.
Acessa sub aba eventos
Preenche evento
Clica em “Criar Evento”

Caso de Uso 5.2 — Criar Passeios
Ator: Admin
 Objetivo: Criar passeio.
 Fluxo:
Admin faz login.
Acessa aba admin.
Acessa sub aba passeios.
Preenche passeio.
Clica em “Criar Passeio”.

 Caso de Uso 5.3 — Aprovar Sugestões
Ator: Admin
 Objetivo: Aprovar sugestões de passeios de usuários cadastrados no site.
 Fluxo:
Administrador faz login.
Acessa aba admin.
Acessa sub aba sugestões
Acessa pendentes (pedidos pendentes).
Avalia e clica em Aprovar.

Caso de Uso 5.4 — Reprovar Sugestões
Ator: Administrador
 Objetivo: Reprovar sugestão.
 Fluxo:
Administrador faz login.
Acessa aba admin.
Acessa sub aba sugestões
Acessa pendentes (pedidos pendentes).
Avalia
Escreve mensagem de feedback
Clica em Reprovar.

Caso de Uso 5.5 — Aprovar Guia
Ator: Administrador
 Objetivo: Reprovar sugestão.
 Fluxo:
Administrador faz login.
Acessa aba admin.
Acessa sub aba guia
Acessa pendentes (pedidos pendentes).
Avalia e clica em Aprovar.

 Caso de Uso 5.4 — Reprovar Guia
Ator: Administrador
 Objetivo: Reprovar sugestão.
 Fluxo:
Administrador faz login.
Acessa aba admin.
Acessa sub aba guia
Acessa pendentes (pedidos pendentes).
Avalia
Escreve mensagem de feedback
Clica em Reprovar.

