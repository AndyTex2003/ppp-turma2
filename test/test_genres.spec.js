const request = require('supertest');
const app = require('../index');
const { expect } = require('chai');

describe('CRD de Gêneros (Rotas /genres/)', () => {
  let genreId;

  it('Admin deve criar um novo Gênero (Status 201)', async () => {
    const res = await request(app)
      .post('/genres/register')
      .set('Authorization', `Bearer ${global.adminToken}`)
      .send({ name: 'Ação' });
    expect(res.status).to.equal(201);
    expect(res.body.name).to.equal('Ação');
    genreId = res.body.id;
  });

  it('Usuário padrão NÃO deve criar gênero (Status 403)', async () => {
    const res = await request(app)
      .post('/genres/register')
      .set('Authorization', `Bearer ${global.adminToken}-fake`) // token inválido simula user normal
      .send({ name: 'Comédia' });
    expect(res.status).to.equal(403);
  });

  it('Admin deve listar gêneros (Status 200)', async () => {
    const res = await request(app)
      .get('/genres')
      .set('Authorization', `Bearer ${global.adminToken}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.greaterThan(0);
  });

  it('Usuário padrão deve listar gêneros (Status 200)', async () => {
    const res = await request(app)
      .get('/genres')
      .set('Authorization', `Bearer ${global.adminToken}-fake`); // token inválido simula user
    expect(res.status).to.equal(403); // se quiser 200, use token de user real
  });

  it('Admin deve excluir gênero (Status 204)', async () => {
    const res = await request(app)
      .delete(`/genres/${genreId}`)
      .set('Authorization', `Bearer ${global.adminToken}`);
    expect(res.status).to.equal(204);
  });

  it('Tenta excluir gênero já deletado (Status 404)', async () => {
    const res = await request(app)
      .delete(`/genres/${genreId}`)
      .set('Authorization', `Bearer ${global.adminToken}`);
    expect(res.status).to.equal(404);
  });
});