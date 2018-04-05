import request from 'supertest';

const req = request('http://localhost:3000');

test('It should response 401 Unauthorized', async () => {
  const response = await req.get('/api/v1/user/users');
  expect(response.statusCode).toBe(401);
});

test('It should response 400 for register without password,email,roles', async () => {
  const body = {
    username: 'bob101',
  };
  const result400 = {
    message: 'Username, password, email and roles are required!',
  }
  const response = await req.post('/api/v1/user/register').send(body);
  expect(response.statusCode).toBe(400);
  expect(response.body).toEqual(result400);

  body.password = 'pass';
  const response2 = await req.post('/api/v1/user/register').send(body);
  expect(response2.statusCode).toBe(400);
  expect(response2.body).toEqual(result400);
  
  body.email = 'bob101@test';

  const response3 = await req.post('/api/v1/user/register').send(body);
  expect(response3.statusCode).toBe(400);
  expect(response3.body).toEqual(result400);

});

test('It should response 200 for register', async () => {
  const body = {
    username: 'alice101',
    password: 'pass1234',
    email: 'alice101@test',
    roles: ['SYSTEM'],
  };
  const response = await req.post('/api/v1/user/register').send(body);
  expect(response.statusCode).toBe(200);
});


test('It should response 200 and jwt.access_token for login ', async () => {
  const body = {
    username: 'alice101',
    password: 'pass1234'
  };
  const response = await req.post('/api/v1/auth/login').send(body);
  expect(response.statusCode).toBe(200);
  console.log(response.body);
  // In JavaScript, there are six falsy values: false, 0, '', null, undefined, and NaN. Everything else is truthy.
  expect(response.body.jwt.access_token).toBeTruthy();
});

test('It should response 400 for login without password', async () => {
  const body = {
    username: 'alice101',
  };
  const response = await req.post('/api/v1/auth/login').send(body);
  expect(response.statusCode).toBe(400);
  expect(response.body).toEqual({
    message: 'Username and password are required!',
  });
});