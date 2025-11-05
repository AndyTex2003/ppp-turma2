const chai = require('chai');
const request = require('chai-http'); 
const expect = chai.expect;

const app = require('../index.js'); 

chai.use(request); 


const USER_CREDENTIALS = {
    username: "user_autenticacao_ok",
    password: "password123"
};

const ADMIN_CREDENTIALS = {
    username: "admin_autenticacao_ok",
    password: "password123"
};


describe('Autenticação (POST /users/register, /admin/register, /auth/login)', () => {
        
    before((done) => {
        // 1. Registro do Usuário (Deve ser aninhado para garantir a ordem)
        chai.request(app)
            .post('/users/register')
            .send(USER_CREDENTIALS)
            .end((err, res) => {
                if (err) return done(err); 
                // Asserção: Se isso falhar, o before é interrompido.
                expect(res).to.have.status(201, 'Falha no registro do Usuário (Status 201 esperado)'); 

                // 2. Registro do Administrador (Começa somente após o 1)
                chai.request(app)
                    .post('/admins/register')
                    .send(ADMIN_CREDENTIALS)
                    .end((err, res) => {
                        if (err) return done(err); 
                        expect(res).to.have.status(201, 'Falha no registro do Admin (Status 201 esperado)'); 
                        
                        
                        done(); 
                    });
            });
    });

    
    //  Teste 3: Login de Usuário (AGORA DEVE PASSAR COM 200)
    it('3. deve permitir o login de um usuário (role: user) em /auth/login e retornar um token (Status 200)', (done) => {
        chai.request(app)
            .post('/auth/login')
            .send({
                username: USER_CREDENTIALS.username,
                password: USER_CREDENTIALS.password,
                role: 'user' // OBRIGATÓRIO conforme Swagger
            })
            .end((err, res) => {
                expect(res).to.have.status(200); //
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('token').to.be.a('string');
                done();
            });
    });

    // Teste 4: Login de Administrador (AGORA DEVE PASSAR COM 200)
    it('4. deve permitir o login de um administrador (role: admin) em /auth/login e retornar um token (Status 200)', (done) => {
        chai.request(app)
            .post('/auth/login')
            .send({
                username: ADMIN_CREDENTIALS.username,
                password: ADMIN_CREDENTIALS.password,
                role: 'admin' // OBRIGATÓRIO
            })
            .end((err, res) => {
                expect(res).to.have.status(200); 
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('token').to.be.a('string');
                done();
            });
    });

    // Teste 5: Login com Credenciais Inválidas (JÁ ESTAVA PASSANDO)
    it('5. deve negar o login com credenciais inválidas (Status 401)', (done) => {
        chai.request(app)
            .post('/auth/login')
            .send({
                username: 'naoexiste',
                password: 'senhaerrada',
                role: 'user'
            })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error').equal('Credenciais inválidas');
                done();
            });
    });
});