// userController.test.js

const request = require('supertest');
const app = require('../index');

describe('Testando rotas de usuários', () => {
    it('Deve criar um novo usuário', async () => {
        const response = await request(app)
            .post('/users')
            .send({ login: 'joao', email: 'joao@example.com', cargo: 'Desenvolvedor' });

        expect(response.statusCode).toBe(201);
    });

    it('Deve retornar status 400 ao criar usuário sem informações necessárias', async () => {
        const response = await request(app)
            .post('/users')
            .send({ login: 'maria', email: 'maria@example.com' });

        expect(response.statusCode).toBe(400);
    });

    // Testes para outras rotas e casos de uso
});
