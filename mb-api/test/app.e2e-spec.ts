import request from 'supertest';

const req = request('http://localhost:3000');

test('It should response 200', async () => {
  const response = await req.get('/api/v1/util/version');
  expect(response.statusCode).toBe(200);
});

test('It should response 404', async () => {
  const response = await req.get('/api/v1/util/api-not-exist');
  expect(response.statusCode).toBe(404);
});