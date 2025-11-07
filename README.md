git add README.md
cat > README.md <<EOLclear

o e consulta de filmes e gêneros, com autenticação via JWT.  
Projeto desenvolvido como portfólio da Mentoria em Testes de Software.

---

## 🚀 Funcionalidades

- Registro de usuários e administradores
- Login com JWT
- CRUD de gêneros (Admin)
- CRUD de filmes (Admin)
- Listagem de filmes e gêneros (usuário autenticado)
- Permissões de acesso diferenciadas entre usuário e admin
- Documentação Swagger acessível em \`/docs\`
- Testes automatizados usando Mocha, Chai e Supertest
- Relatórios de teste HTML gerados automaticamente

---

## 🛠️ Tecnologias

- Node.js
- Express
- JSON Web Token (JWT)
- Mocha + Chai + Supertest
- Swagger (OpenAPI 3.0)

---

## ⚡ Pré-requisitos

- Node.js >= 18
- npm

---

## 💻 Instalação

1. Clone o repositório:

\`\`\`bash
git clone https://github.com/AndyTex2003/ppp-turma2.git
cd ppp-turma2
\`\`\`

2. Instale as dependências:

\`\`\`bash
npm install
\`\`\`

---

## 🏃‍♂️ Executando a API

\`\`\`bash
node index.js
\`\`\`

- Acesse a API: \`http://localhost:3000/\`
- Swagger UI (documentação interativa): \`http://localhost:3000/docs\`

---

## 🧪 Executando Testes

Todos os testes de autenticação, filmes, gêneros e permissões:

\`\`\`bash
npm test
\`\`\`

- Relatório HTML gerado em: \`relatorios/relatorio_final.html\`

---

## 🔒 Rotas principais

| Método | Endpoint           | Descrição                  | Autenticação |
|--------|------------------|----------------------------|--------------|
| POST   | /users/register  | Registrar usuário          | Não          |
| POST   | /admins/register | Registrar administrador    | Não          |
| POST   | /auth/login      | Login (user/admin)         | Não          |
| GET    | /movies          | Listar filmes              | JWT          |
| POST   | /movies/register | Criar filme (Admin)        | JWT          |
| DELETE | /movies/:id      | Deletar filme (Admin)      | JWT          |
| GET    | /genres          | Listar gêneros             | JWT          |
| POST   | /genres/register | Criar gênero (Admin)       | JWT          |
| DELETE | /genres/:id      | Deletar gênero (Admin)     | JWT          |

---

## 📄 Estrutura do projeto

\`\`\`
controllers/       # Lógica das rotas
models/            # Modelos de dados
routes/            # Definição de rotas
services/          # Serviços auxiliares (auth, DB)
middlewares/       # Middlewares de autenticação
resources/         # Documentação Swagger
test/              # Testes automatizados
relatorios/        # Relatórios de testes HTML
index.js           # Arquivo principal
package.json       # Dependências e scripts
\`\`\`

---

## ⚙️ Notas

- Usuário padrão: \`role = "user"\`
- Administrador: \`role = "admin"\`
- Senhas atualmente armazenadas em memória (hashing com bcrypt recomendado para produção)
- Todos os testes passam e a documentação Swagger está funcional.

---

## 📌 Contato

Anderson Batista dos Santos  
[GitHub](https://github.com/AndyTex2003)
EOL
