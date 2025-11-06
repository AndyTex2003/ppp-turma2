const chai = require('chai');
const request = require('chai-http');
const expect = chai.expect;

const app = require('../index.js');

chai.use(request);

// 1. CONFIGURAÇÕES E CREDENCIAIS

const ADMIN_CREDENTIALS = {
    username: "admin_autenticacao_ok",
    password: "password123"
};

const USER_CREDENTIALS = {
    username: "user_autenticacao_ok",
    password: "password123"
};

const NEW_GENRE_DATA = {
    name: "Terror Classico"
};

let adminToken = '';
let userToken = '';
let createdGenreId = ''; 

// 2. BLOCO PRINCIPAL DE TESTE (CRD de Gêneros)

describe('CRD de Gêneros (Rotas /genres/)', () => {

    // HOOK: Antes de todos os testes, obtemos os tokens de Admin e Usuário Padrão
    before(function (done) {
        this.timeout(10000); 
        
        // 1. Login do Administrador
        chai.request(app)
            .post('/auth/login')
            .send({ username: ADMIN_CREDENTIALS.username, password: ADMIN_CREDENTIALS.password, role: 'admin' })
            .end((err, res) => {
                if (res.body && res.body.token) {
                    adminToken = res.body.token;
                }
                
                // 2. Login do Usuário Padrão
                chai.request(app)
                    .post('/auth/login')
                    .send({ username: USER_CREDENTIALS.username, password: USER_CREDENTIALS.password, role: 'user' })
                    .end((err, res) => {
                         if (res.body && res.body.token) {
                            userToken = res.body.token;
                        }
                        done();
                    });
            });
    });

    // TESTES DE CRIAÇÃO (CREATE)

    it('1. POST /genres/register - Admin deve criar um novo Gênero (Status 201 Created)', (done) => {
        chai.request(app)
            .post('/genres/register')
            .set('Authorization', `Bearer ${adminToken}`) 
            .send(NEW_GENRE_DATA)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');

                
                if (res.body.id) {
                    expect(res.body.id).to.exist; 
                    createdGenreId = res.body.id;
                } else if (res.body.insertId) { 
                    createdGenreId = res.body.insertId;
                } else {
                    
                    console.error("AVISO: ID não encontrado no corpo da resposta do POST /genres/register. Retorno:", res.body);
                    createdGenreId = res.body; 
                }
                
                // Converte para string para garantir a consistência nos próximos testes de URL, se necessário
                if (typeof createdGenreId !== 'string' && createdGenreId !== null) {
                    createdGenreId = createdGenreId.toString();
                }

                expect(createdGenreId).to.not.be.empty; 
                done();
            });
    });

    it('2. POST /genres/register - Usuário Padrão NÃO deve criar (Status 403 Forbidden)', (done) => {
        chai.request(app)
            .post('/genres/register')
            .set('Authorization', `Bearer ${userToken}`) 
            .send(NEW_GENRE_DATA)
            .end((err, res) => {
                expect(res).to.have.status(403);
                expect(res.body).to.have.property('error'); 
                done();
            });
    });

    // TESTES DE LEITURA (READ - Listagem) 

    it('3. GET /genres - Admin deve listar Gêneros (Status 200 OK)', (done) => {
        if (!createdGenreId) return done(new Error("createdGenreId não foi capturado no Teste 1."));

        chai.request(app)
            .get('/genres')
            .set('Authorization', `Bearer ${adminToken}`) 
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                
                // Ajustado para usar toString() para garantir que IDs de DB numéricos sejam comparados corretamente com IDs de URL string
                const found = res.body.find(g => g.id.toString() === createdGenreId); 
                expect(found).to.not.be.undefined; 
                expect(found.name).to.equal(NEW_GENRE_DATA.name);
                done();
            });
    });

    it('4. GET /genres - Usuário Padrão deve listar Gêneros (Status 200 OK)', (done) => {
        chai.request(app)
            .get('/genres')
            .set('Authorization', `Bearer ${userToken}`) 
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });

    it('5. GET /genres - Sem Token NÃO deve listar Gêneros (Status 401 Unauthorized)', (done) => {
        chai.request(app)
            .get('/genres')
            .end((err, res) => {
                expect(res).to.have.status(401);
                done();
            });
    });


    // --- TESTES DE EXCLUSÃO (DELETE) ---
        
    it('6. DELETE /genres/:id - Usuário Padrão NÃO deve excluir (Status 403 Forbidden)', (done) => {
        if (!createdGenreId) return done(new Error("createdGenreId não foi capturado no Teste 1."));
        chai.request(app)
            .delete(`/genres/${createdGenreId}`) 
            .set('Authorization', `Bearer ${userToken}`) 
            .end((err, res) => {
                expect(res).to.have.status(403);
                done();
            });
    });

    it('7. DELETE /genres/:id - Admin deve excluir o Gênero (Status 204 No Content)', (done) => {
        if (!createdGenreId) return done(new Error("createdGenreId não foi capturado no Teste 1."));
        chai.request(app)
            .delete(`/genres/${createdGenreId}`) 
            .set('Authorization', `Bearer ${adminToken}`) 
            .end((err, res) => {
                expect(res).to.have.status(204); 
                done();
            });
    });

    it('8. DELETE /genres/:id - Tenta excluir Gênero já deletado (Status 404 Not Found)', (done) => {
        if (!createdGenreId) return done(); 

        chai.request(app)
            .delete(`/genres/${createdGenreId}`) 
            .set('Authorization', `Bearer ${adminToken}`) 
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });
    
});