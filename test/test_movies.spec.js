const request = require('supertest');
const app = require('../index');
const { expect } = require('chai');

describe('CRD de Filmes (Rotas /movies/)', () => {
  let movieId;
  let genreId;

  // Antes de tudo, cria um gênero para associar aos filmes
  before(async () => {
    const genreRes = await request(app)
      .post('/genres/register')
      .set('Authorization', `Bearer ${global.adminToken}`)
      .send({ name: 'Aventura' });
    genreId = genreRes.body.id;
  });

  it('Admin deve registrar um novo filme (Status 201)', async () => {
    const res = await request(app)
      .post('/movies/register')
      .set('Authorization', `Bearer ${global.adminToken}`)
      .send({
        title: 'Filme Teste',
        genreId: genreId,
        actorIds: [1, 2, 3]
      });
    expect(res.status).to.equal(201);
    expect(res.body.title).to.equal('Filme Teste');
    movieId = res.body.id;
  });

  it('Usuário padrão NÃO deve registrar filme (Status 403)', async () => {
    const res = await request(app)
      .post('/movies/register')
      .set('Authorization', `Bearer ${global.adminToken}-fake`) // token inválido simula user
      .send({
        title: 'Filme Bloqueado',
        genreId: genreId,
        actorIds: [1]
      });
    expect(res.status).to.equal(403);
  });

  it('Deve listar filmes (autenticado) (Status 200)', async () => {
    const res = await request(app)
      .get('/movies')
      .set('Authorization', `Bearer ${global.adminToken}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.greaterThan(0);
  });

  it('Admin deve deletar filme (Status 204)', async () => {
    const res = await request(app)
      .delete(`/movies/${movieId}`)
      .set('Authorization', `Bearer ${global.adminToken}`);
    expect(res.status).to.equal(204);
  });

  it('Tenta deletar filme já deletado (Status 404)', async () => {
    const res = await request(app)
      .delete(`/movies/${movieId}`)
      .set('Authorization', `Bearer ${global.adminToken}`);
    expect(res.status).to.equal(404);
  });
});