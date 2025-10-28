# API Catálogo de Filmes

## Descrição
API REST para registro e consulta de filmes e gêneros. Utiliza autenticação JWT e banco de dados em memória. Documentação disponível via Swagger.

## Funcionalidades
- Registro de Administrador
- Registro de Usuário
- Registro de Filmes
- Registro de Gêneros dos Filmes
- Busca de Filmes
- Busca de Gêneros dos Filmes
- Deleção de Filmes
- Deleção de Gêneros

## Regras de Acesso
- Administradores: acesso total (registro, consulta e deleção)
- Usuários: apenas consulta (filmes, gêneros)
- Autenticação obrigatória via JWT

## Estrutura do Projeto
- `routes/` - Rotas da API
- `controllers/` - Lógica dos endpoints
- `services/` - Serviços e banco de dados em memória
- `models/` - Modelos de dados
- `middleware/` - Middleware de autenticação
- `resources/` - Documentação Swagger

## Documentação Swagger
Acesse a documentação em [http://localhost:3000/docs](http://localhost:3000/docs)

## Como Executar
1. Instale as dependências:
   ```bash
   npm install express swagger-ui-express jsonwebtoken body-parser
   ```
2. Inicie o servidor:
   ```bash
   node index.js
   ```
3. Acesse a API em [http://localhost:3000](http://localhost:3000)

## Fluxo recomendado para testes da API

1. **Cadastre os gêneros**
   - Use o endpoint `POST /genres/register` para criar os gêneros desejados (ex: Romance, Ação, Comédia).
   - Guarde os ids retornados para usar ao cadastrar filmes.

2. **Cadastre os filmes**
   - Use o endpoint `POST /movies/register`.
   - Informe o `genreId` (id do gênero cadastrado) no corpo da requisição.
   - Exemplo:
     ```json
     {
       "title": "Titanic",
       "genreId": 1
     }
     ```

**Observação:**
- Sempre cadastre gêneros antes de cadastrar filmes.
- Utilize os ids retornados nos cadastros anteriores para relacionar corretamente os dados.

## Exemplos de Uso
### Login
```json
POST /auth/login
{
  "username": "admin",
  "password": "123",
  "role": "admin"
}
```
### Registro de Filme (admin)
```json
POST /movies/register
Authorization: Bearer <token>
{
  "title": "Filme X",
  "genreId": 1
}
```
### Consulta de Filmes (usuário)
```json
GET /movies
Authorization: Bearer <token>
```

## Dependências
- express
- swagger-ui-express
- jsonwebtoken
- body-parser
