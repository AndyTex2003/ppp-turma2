const request = require('supertest');
const app = require('../index');
const { expect } = require('chai');

describe('Autenticação (POST /users/register, /admins/register, /auth/login)', () => {
  let adminToken;

  it('deve permitir registrar um usuário', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({ username: 'usuario1', password: '1234' });
    expect(res.status).to.equal(201);
    expect(res.body.username).to.equal('usuario1');
  });

  it('deve permitir registrar um admin', async () => {
    const res = await request(app)
      .post('/admins/register')
      .send({ username: 'admin1', password: '1234' });
    expect(res.status).to.equal(201);
    expect(res.body.role).to.equal('admin');
  });

  it('deve permitir login de usuário e retornar token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'usuario1', password: '1234' });
    expect(res.status).to.equal(200);
    expect(res.body.token).to.be.a('string');
  });

  it('deve permitir login de admin e retornar token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'admin1', password: '1234' });
    expect(res.status).to.equal(200);
    expect(res.body.token).to.be.a('string');
    adminToken = res.body.token; // salva token para testes posteriores
  });

  // Exporta token para outros testes
  after(() => {
    global.adminToken = adminToken;
  });
});