# TerêVerde Online — Escopo do MVP

> Este documento descreve o que foi implementado no MVP (Produto Mínimo Viável) e o que ficou fora do escopo desta versão, mas pode ser considerado em atualizações futuras.

---

## O que é um MVP?

O **MVP (Minimum Viable Product)** é a versão mais simples e funcional de um produto que já consegue demonstrar o valor da ideia e ser apresentada para validação. O foco é entregar as funcionalidades essenciais, aprender com o uso real e, a partir daí, evoluir o produto com base em dados concretos.

O TerêVerde Online MVP foi construído com esse objetivo: **apresentar a proposta da plataforma**, conectar turistas e guias de Teresópolis, e validar se há interesse no conceito antes de investir em uma solução mais robusta.

---

## Funcionalidades Implementadas no MVP

### Autenticação e Perfis
- [x] Cadastro de turista (acesso imediato após cadastro)
- [x] Cadastro de guia (aguarda aprovação do administrador)
- [x] Login com usuário e senha
- [x] Logout e limpeza de sessão
- [x] Recuperação de senha por e-mail
- [x] Edição de perfil (nome, e-mail, telefone, foto)
- [x] Modal de aviso para guias com cadastro pendente ou reprovado

### Área do Turista
- [x] Visualização de passeios criados pelo administrador
- [x] Visualização de trilhas de parques (Parque Nacional da Serra dos Órgãos e outros)
- [x] Listagem de guias disponíveis por passeio e por trilha
- [x] Diretório de guias com foto, serviço oferecido e redes sociais
- [x] Contato direto com o guia via WhatsApp (pré-formatado)
- [x] Visualização de eventos locais com calendário
- [x] Envio de sugestões de novos locais para passeio
- [x] Acompanhamento do status das sugestões enviadas (pendente, aprovada, reprovada)
- [x] Feedback do administrador em sugestões reprovadas

### Área do Guia
- [x] Tudo que o turista pode fazer
- [x] Inscrição em passeios criados pelo admin (aparecer como guia disponível)
- [x] Inscrição em trilhas de parques
- [x] Cancelamento de inscrições
- [x] Carregamento automático das inscrições ao fazer login

### Área do Administrador
- [x] Painel exclusivo (aba Admin, visível apenas após login como admin)
- [x] Aprovação e reprovação de cadastros de guias (com mensagem de feedback)
- [x] Criação e remoção de passeios (com foto, descrição, dificuldade, link)
- [x] Criação e remoção de eventos
- [x] Gerenciamento de sugestões (aprovação e reprovação com justificativa)
- [x] Filtros por status (pendente, aprovado, reprovado)

### Interface e Experiência
- [x] Design mobile-first responsivo
- [x] Paleta de cores da identidade visual TerêVerde
- [x] Navegação por abas (SPA — sem recarregar a página)
- [x] Previsão do tempo em tempo real para Teresópolis
- [x] Banner com slideshow de imagens
- [x] Carrossel de guias em destaque na página inicial
- [x] Slider de imagens por parque
- [x] Seção "Sobre" com informações do projeto

---

## Fora do Escopo do MVP

As funcionalidades abaixo foram identificadas como desejáveis, mas optou-se por deixá-las para uma versão futura, mantendo o foco do MVP em **validar o conceito** sem aumentar excessivamente a complexidade do desenvolvimento.

---

### Sistema de Avaliações e Notas
Turistas poderiam avaliar guias com estrelas e comentários após um passeio. Guias com melhor avaliação apareceriam em destaque.
**Por que ficou fora:** Requer lógica de moderação de comentários, sistema de ranking e interface adicional complexa.

---

### Agendamento de Passeios com Data e Hora
Em vez de apenas listar passeios disponíveis, o turista poderia escolher uma data, horário e reservar a vaga com um guia específico.
**Por que ficou fora:** Exigiria um sistema de calendário de disponibilidade por guia, lógica de conflitos de agenda e notificações automáticas.

---

### Pagamento Online
Integração com gateways de pagamento (Stripe, Mercado Pago etc.) para que o turista pudesse contratar e pagar o guia diretamente pela plataforma.
**Por que ficou fora:** Requer certificação PCI-DSS, contratos com intermediadores financeiros e complexidade jurídica.

---

### Chat Interno entre Turista e Guia
Sistema de mensagens em tempo real dentro da plataforma, em vez de redirecionar para WhatsApp.
**Por que ficou fora:** Requer WebSockets, sistema de notificações em tempo real e persistência de histórico de conversas.

---

### Notificações por E-mail ou Push
Avisar automaticamente o guia quando um turista entrar em contato, ou notificar o turista quando uma sugestão for aprovada ou reprovada.
**Por que ficou fora:** Requer integração com serviço de e-mail (SendGrid, SMTP), configuração de DKIM/SPF e sistema de notificações push com Service Worker.

---

### Mapa Interativo de Trilhas e Parques
Exibir trilhas, parques e pontos turísticos num mapa integrado (Google Maps ou OpenStreetMap) com rotas e informações geoespaciais.
**Por que ficou fora:** Requer integração com APIs de mapas, cadastro de coordenadas geográficas para cada local e UX específica de mapa.

---

### Galeria de Fotos por Trilha (enviada por usuários)
Turistas e guias poderiam publicar fotos de suas experiências em trilhas específicas, criando uma galeria colaborativa.
**Por que ficou fora:** Requer moderação de conteúdo, compressão de imagens, CDN para armazenamento e maior uso de banco de dados.

---

### Perfil Público do Guia com URL Própria
Cada guia teria uma página pública acessível por URL (ex: `/guia/joao-silva`) onde turistas poderiam ver todo seu portfólio.
**Por que ficou fora:** Requer roteamento de URLs no backend, SEO e design específico de página de perfil.

---

### Filtros Avançados de Busca
Busca de passeios e guias por nível de dificuldade, localização, disponibilidade, preço e avaliação.
**Por que ficou fora:** Requer indexação no banco de dados, UX de filtros e maior volume de dados para ser útil.

---

### Painel de Relatórios para o Admin
Dashboard com estatísticas: número de cadastros por mês, passeios mais populares, guias com mais inscrições, taxa de aprovação de sugestões.
**Por que ficou fora:** Requer consultas analíticas ao banco, biblioteca de gráficos e design de dashboard específico.

---

### Autenticação com Redes Sociais
Login e cadastro usando Google, Facebook ou Apple ID.
**Por que ficou fora:** Requer configuração de OAuth 2.0, integração com APIs de terceiros e gestão de tokens.

---

### Versão Nativa Mobile (App)
Aplicativo Android/iOS instalável, com recursos nativos como câmera, GPS e notificações push nativas.
**Por que ficou fora:** O MVP é web mobile-first e já funciona bem em celulares. Uma versão nativa seria o próximo passo natural após validação do produto.

---

## Considerações Finais

O MVP do TerêVerde Online cumpre seu papel de **prova de conceito funcional**: apresenta a ideia, demonstra o fluxo completo de uso para os três perfis (turista, guia e admin), e valida se a proposta de conectar turistas e guias de Teresópolis em uma única plataforma faz sentido para os usuários.

As funcionalidades fora do escopo não foram descartadas — foram **priorizadas para versões futuras** com base no aprendizado que o MVP proporcionará.
