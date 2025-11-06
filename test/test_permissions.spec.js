const chai = require('chai');
const request = require('chai-http');
const expect = chai.expect;

const app = require('../index.js');

chai.use(request);

// 1. Credenciais e Tokens
// As credenciais de Admin e User Padrão devem ser as mesmas usadas no test_auth.spec.js
const USER_CREDENTIALS = {
    username: "user_autenticacao_ok",
    password: "password123"
};

const ADMIN_CREDENTIALS = {
    username: "admin_autenticacao_ok",
    password: "password123"
};

// Variáveis para armazenar os tokens
let userToken = '';
let adminToken = '';

// 2. Bloco Principal de Teste de Permissões

describe('Permissões de Acesso (Rotas Admin)', () => {

    // HOOK: Antes de todos os testes, realiza o Registro (se necessário) e o Login para obter os tokens
    before(function (done) {
        this.timeout(10000); // Aumenta o timeout para garantir o fluxo de 3 requisições

        // 0. Registro do Administrador (Garante que ele exista)
        chai.request(app)
            .post('/admins/register') // Rota de registro do Admin
            .send(ADMIN_CREDENTIALS)
            .end(() => { // Não checa o status, apenas garante que a requisição de registro terminou

                // 1. Login do Administrador
                chai.request(app)
                    .post('/auth/login')
                    .send({
                        username: ADMIN_CREDENTIALS.username,
                        password: ADMIN_CREDENTIALS.password,
                        role: 'admin' // Necessário para distinguir o Admin
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(200, 'Falha no Login do Admin. Status 401/404? Verifique as credenciais e o role.');
                        expect(res.body).to.have.property('token');
                        adminToken = res.body.token;

                        // 2. Login do Usuário Padrão
                        chai.request(app)
                            .post('/auth/login')
                            .send({
                                username: USER_CREDENTIALS.username,
                                password: USER_CREDENTIALS.password,
                                role: 'user' // Necessário para o Usuário Padrão
                            })
                            .end((err, res) => {
                                expect(res).to.have.status(200, 'Falha no Login do Usuário. Status 401/404? Verifique as credenciais e o role.');
                                expect(res.body).to.have.property('token');
                                userToken = res.body.token;

                                done(); // Finaliza o hook 'before'
                            });
                    });
            });
    });

    // --- Testes de Permissão ---

    it('1. deve permitir que o Admin acesse a rota protegida /admins/ (Status 200)', (done) => {
        chai.request(app)
            .get('/admins/') // Rota completa: /admins/
            .set('Authorization', `Bearer ${adminToken}`) // Usa o token de Admin
            .end((err, res) => {
                // O Admin deve ter sucesso
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array'); // Espera-se um array, pois é 'listAdmins'
                done();
            });
    });

    it('2. NÃO deve permitir que o Usuário Padrão acesse a rota protegida /admins/ (Status 403 Forbidden)', (done) => {
        chai.request(app)
            .get('/admins/')
            .set('Authorization', `Bearer ${userToken}`) // Usa o token de Usuário Padrão
            .end((err, res) => {
                // O Usuário Padrão deve ser barrado com status 403 (Proibido)
                expect(res).to.have.status(403);
                // Ajuste a mensagem abaixo se sua API retornar uma diferente para 403
                expect(res.body).to.have.property('error').include('Acesso negado');
                done();
            });
    });

    it('3. NÃO deve permitir acesso a rota protegida sem token (Status 401 Unauthorized)', (done) => {
        chai.request(app)
            .get('/admins/')
            // Não envia cabeçalho 'Authorization'
            .end((err, res) => {
                // A requisição deve ser barrada com status 401 (Não Autorizado)
                expect(res).to.have.status(401);
                // Ajuste a mensagem abaixo se sua API retornar uma diferente para 401
                expect(res.body).to.have.property('error');
                done();
            });
    });

});