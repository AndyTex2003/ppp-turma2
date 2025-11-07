const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index'); // ajustado para index.js
const expect = chai.expect;

chai.use(chaiHttp);

describe('Permissões de Acesso (Rotas Admin)', () => {
  it('deve permitir que Admin acesse rota protegida /admins/ (Status 200)', async () => {
    const res = await chai.request(server)
      .get('/admins')
      .set('Authorization', `Bearer ${global.adminToken}`);

    expect(res).to.have.status(200);
  });
});