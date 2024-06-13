// groupController.test.js

const request = require('supertest');
const app = require('../index');

describe('Testando rotas de grupos', () => {
    it('Deve adicionar um usuário a um grupo', async () => {
        const response = await request(app)
            .post('/groups/1/users/joao')
            .send();

        expect(response.statusCode).toBe(200);
    });

    // Testes para outras rotas e casos de uso
});
