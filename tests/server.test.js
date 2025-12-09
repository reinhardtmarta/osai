const request = require('supertest');
const app = require('../api-manager/server'); // Ajusta path se preciso

describe('OS.AI API Tests', () => {
  it('deve retornar status ativo', async () => {
    const res = await request(app).get('/status');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('OS.AI ativo');
  });

  it('deve falhar em optimize sem token', async () => {
    const res = await request(app).post('/optimize/battery');
    expect(res.statusCode).toEqual(401);
  });

  // Adicione mais: ex. teste com token mock
});
