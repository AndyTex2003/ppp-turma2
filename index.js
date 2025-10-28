const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const movieRoutes = require('./routes/movieRoutes');
const genreRoutes = require('./routes/genreRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(bodyParser.json());

// Rotas
app.use('/users', userRoutes);
app.use('/admins', adminRoutes);
app.use('/movies', movieRoutes);
app.use('/genres', genreRoutes);
app.use('/auth', authRoutes);

// Swagger
const swaggerFile = path.join(__dirname, 'resources', 'swagger.json');
let swaggerDocument = {};
if (fs.existsSync(swaggerFile)) {
  swaggerDocument = require(swaggerFile);
}
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('API Catálogo de Filmes');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});