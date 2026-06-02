# Terê Verde — MVP Web Mobile
 
> Plataforma web mobile para serviços turísticos em Teresópolis — RJ.
 
---
 
## Sobre o Projeto
 
A geografia do município de Teresópolis é caracterizada por terrenos montanhosos entremeados por vales. A área urbana encontra-se a 869 metros acima do nível do mar e é delimitada por três unidades de conservação:
 
- **Parque Nacional da Serra dos Órgãos (PARNASO)**
- **Parque Estadual dos Três Picos (PETP)**
- **Parque Natural Municipal Montanhas de Teresópolis**
A existência dessas unidades de conservação proporciona ao município o turismo ambiental, com destaque para trilhas, escaladas e atividades ao ar livre.
 
O **Circuito Terê Verde** busca promover essas atrações, conectando turistas a guias profissionais capacitados e centralizando informações sobre eventos, passeios e biodiversidade local.
 
---
 
## Equipe
 
| Nome | Função |
|---|---|
| Sanderson Santos | Analista de Requisitos / Designer UX |
| Gustavo Toledo | Desenvolvedor Back-End / DBA |
 
---
 
## Tecnologias Utilizadas
 
| Camada | Tecnologia |
|---|---|
| Front-End | HTML, CSS, JavaScript |
| Back-End | Python + Flask |
| Banco de Dados | SQLite |
| IDE | VS Code + REST Client |
| API Externa | Clima/Tempo (Teresópolis) |
 
---
 
## Perfis de Usuário
 
### Turista
- Consulta guias disponíveis para passeios.
- Visualiza passeios e eventos.
- Faz contato direto com guias via WhatsApp.
- Sugere novos locais de passeio.
### Guia
- Visualiza passeios e eventos.
- Inscreve-se em passeios disponíveis.
- Sugere novos locais de passeio.
- Cadastro sujeito à aprovação do administrador.
### Administrador
- Cria, edita e remove eventos e passeios.
- Aprova ou reprova sugestões de passeio.
- Aprova ou reprova cadastros de guias.
- Gerencia trilhas dos parques (ativar / pausar).
---
 
## Funcionalidades do MVP
 
### Autenticação
- Cadastro de usuários (Turista, Guia)
- Login com validação de campos e senha
- Identificação automática do tipo de usuário após login
- Cadastro de guia com fluxo de aprovação pelo administrador
### Eventos (Admin)
- Cadastro com: título, data, local, imagem e descrição
- Edição e remoção de eventos
### Passeios (Admin)
- Cadastro com: título, local, imagem e descrição
- Remoção de passeios
### Trilhas dos Parques (Admin)
- Ativar ou pausar trilhas
### Sugestões (Turista / Guia)
- Envio de sugestões de novos passeios
- Aprovação ou reprovação com mensagem de feedback (Admin)
### Inscrição em Passeios (Guia)
- Inscrever-se ou desinscrever-se de passeios disponíveis
### Validações Gerais
- Campos obrigatórios
- Controle de permissões por tipo de usuário
- Impedimento de cadastro duplicado
- Retorno de mensagens claras com HTTP status apropriado
---
 
## Armazenamento
 
- Banco de dados **SQLite** (`users.db`)
- Arquitetura preparada para migração futura
---
 
## Apresentação
 
[🔗 Ver apresentação no Canva](https://www.canva.com/design/DAG5puRIO3g/ghCVxSekcsXhM3QeOTCGwg/edit)
