# Caso de Uso

---

## 1. Lista de Interessados

### 1.1 — Usuário
- Qualquer indivíduo que acesse o site, sem ser cadastrado.

### 1.2 — Turista
- Usuário que se cadastra no site como turista.

### 1.3 — Guia
- Profissional que se cadastra no site como guia turístico.

### 1.4 — Administrador
- Organizador e administrador do site.

---

## Sequências de Casos de Uso — Projeto MVP Mobile

Abaixo estão alguns fluxos completos que exploram as **principais funcionalidades** do sistema: Turista, Guia e Admin.

---

## 2. Cadastro e Autenticação

### Caso de Uso 2.1 — Cadastrar Turista

**Ator:** Turista  
**Objetivo:** Criar uma conta para acessar o sistema.  
**Fluxo Principal:**

1. Turista envia seus dados.
2. O sistema valida os dados.
3. O turista é criado e armazenado.
4. Retorna mensagem de sucesso.

---

### Caso de Uso 2.2 — Cadastrar Guia

**Ator:** Guia Turístico  
**Objetivo:** Criar conta para publicar passeios.  
**Fluxo Principal:**

1. Guia envia seus dados.
2. Sistema valida os dados.
3. O admin recebe a solicitação e aprova.
4. O guia é registrado.
5. Guia obtém acesso.

---

### Caso de Uso 2.3 — Login do Turista

**Ator:** Turista  
**Objetivo:** Acessar o sistema.  
**Fluxo:**

1. Turista envia usuário e senha.
2. Sistema valida.
3. Retorna tipo de usuário.

---

### Caso de Uso 2.4 — Login do Guia

**Ator:** Guia  
**Objetivo:** Acessar o sistema.  
**Fluxo:**

1. Usuário envia usuário e senha.
2. Sistema valida.
3. Retorna tipo de usuário.

---

### Caso de Uso 2.5 — Login do Admin

**Ator:** Administrador  
**Objetivo:** Acessar o sistema.  
**Fluxo:**

1. Usuário envia usuário e senha.
2. Sistema valida.
3. Retorna tipo de usuário.

---

## 3. Funcionalidades do Turista

### Caso de Uso 3.1 — Consultar Guias Disponíveis em Passeios

**Ator:** Turista  
**Objetivo:** Ver lista atualizada de guias disponíveis para passeios.  
**Fluxo:**

1. Turista faz login.
2. Acessa a aba **Passeios**.
3. Visualiza passeios na sub-aba **Passeio**.
4. Clica em **Guias Disponíveis** para visualizar guias inscritos no passeio.

---

### Caso de Uso 3.2 — Sugestões de Passeios

**Ator:** Turista  
**Objetivo:** Sugerir um novo local para passeio.  
**Fluxo:**

1. Turista faz login.
2. Acessa a aba **Sugestões**.
3. Preenche a sugestão.
4. Envia a sugestão.
5. Aguarda aprovação do Admin.

---

### Caso de Uso 3.3 — Conhecendo um Guia

**Ator:** Turista  
**Objetivo:** Conhecer e entrar em contato com guias.  
**Fluxo:**

1. Turista faz login.
2. Acessa a aba **Guias**.
3. Seleciona um guia e acessa suas redes sociais.
4. Clica em **Entre em Contato**.
5. Informa seu nome.
6. Seleciona um parque.
7. Escreve uma mensagem.
8. Clica em **Enviar via WhatsApp**.

---

## 4. Funcionalidades do Guia

### Caso de Uso 4.1 — Disponível em Passeios

**Ator:** Guia  
**Objetivo:** Inscrever-se em passeios.  
**Fluxo:**

1. Guia faz login.
2. Acessa a aba **Passeios**.
3. Visualiza passeios na sub-aba **Passeio**.
4. Clica no botão **Inscrever-se**.

---

### Caso de Uso 4.2 — Sugestões de Passeios

**Ator:** Guia  
**Objetivo:** Sugerir um novo local para passeio.  
**Fluxo:**

1. Guia faz login.
2. Acessa a aba **Sugestões**.
3. Preenche a sugestão.
4. Envia a sugestão.
5. Aguarda aprovação do Admin.

---

## 5. Funcionalidades do Admin

### Caso de Uso 5.1 — Criar Evento

**Ator:** Administrador  
**Objetivo:** Criar um evento.  
**Fluxo:**

1. Admin faz login.
2. Acessa a aba **Admin**.
3. Acessa a sub-aba **Eventos**.
4. Preenche os dados do evento.
5. Clica em **Criar Evento**.

---

### Caso de Uso 5.2 — Criar Passeio

**Ator:** Administrador  
**Objetivo:** Criar um passeio.  
**Fluxo:**

1. Admin faz login.
2. Acessa a aba **Admin**.
3. Acessa a sub-aba **Passeios**.
4. Preenche os dados do passeio.
5. Clica em **Criar Passeio**.

---

### Caso de Uso 5.3 — Aprovar Sugestão

**Ator:** Administrador  
**Objetivo:** Aprovar sugestões de passeios enviadas por usuários cadastrados.  
**Fluxo:**

1. Administrador faz login.
2. Acessa a aba **Admin**.
3. Acessa a sub-aba **Sugestões**.
4. Acessa **Pendentes**.
5. Avalia a sugestão e clica em **Aprovar**.

---

### Caso de Uso 5.4 — Reprovar Sugestão

**Ator:** Administrador  
**Objetivo:** Reprovar uma sugestão de passeio.  
**Fluxo:**

1. Administrador faz login.
2. Acessa a aba **Admin**.
3. Acessa a sub-aba **Sugestões**.
4. Acessa **Pendentes**.
5. Avalia a sugestão.
6. Escreve mensagem de feedback.
7. Clica em **Reprovar**.

---

### Caso de Uso 5.5 — Aprovar Guia

**Ator:** Administrador  
**Objetivo:** Aprovar o cadastro de um guia.  
**Fluxo:**

1. Administrador faz login.
2. Acessa a aba **Admin**.
3. Acessa a sub-aba **Guia**.
4. Acessa **Pendentes**.
5. Avalia e clica em **Aprovar**.

---

### Caso de Uso 5.6 — Reprovar Guia

**Ator:** Administrador  
**Objetivo:** Reprovar o cadastro de um guia.  
**Fluxo:**

1. Administrador faz login.
2. Acessa a aba **Admin**.
3. Acessa a sub-aba **Guia**.
4. Acessa **Pendentes**.
5. Avalia o cadastro.
6. Escreve mensagem de feedback.
7. Clica em **Reprovar**.
