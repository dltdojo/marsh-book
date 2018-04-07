import request from 'supertest';

const req = request('http://localhost:3000');
const authJwt = {}

const ALICE101_SYSTEM = {
  username: 'alice101',
  password: 'pass1234',
  email: 'alice101@test',
  roles: ['SYSTEM'],
};

const BOB101_USER = {
  username: 'bob101',
  password: 'pass2222',
  email: 'bob101@test',
  roles: ['USER'],
};

async function getReq(path, jwtToken){
  if(jwtToken){
    return await req.get(`/api/v1${path}`).set('Authorization', 'bearer ' + jwtToken);
  }else{
    return await req.get(`/api/v1${path}`);
  }
}

async function postReq(path, body, jwtToken){
  if(jwtToken){
    return await req.post(`/api/v1${path}`).set('Authorization', 'bearer ' + jwtToken).send(body);
  }else{
    return await req.post(`/api/v1${path}`).send(body);
  }
}

test('/user/users should response 401 Unauthorized', async () => {
  const response = await getReq('/user/users');
  expect(response.statusCode).toBe(401);
});

test('/util/authorized should response 401 Unauthorized', async () => {
  const response = await getReq('/util/authorized');
  expect(response.statusCode).toBe(401);
});

test('It should response 400 for register without password,email,roles', async () => {
  const body = {
    username: 'bob101',
  };
  const result400 = {
    message: 'Username, password, email and roles are required!',
  }
  const response = await postReq('/user/register', body);
  expect(response.statusCode).toBe(400);
  expect(response.body).toEqual(result400);

  body.password = 'pass';
  const response2 = await postReq('/user/register', body);
  expect(response2.statusCode).toBe(400);
  expect(response2.body).toEqual(result400);
  
  body.email = 'bob101@test';

  const response3 = await postReq('/user/register', body);
  expect(response3.statusCode).toBe(400);
  expect(response3.body).toEqual(result400);

});

test('/user/register alice101 should response 200 for register', async () => {
  const response = await postReq('/user/register', ALICE101_SYSTEM);
  expect(response.statusCode).toBe(200);
});

test('/user/register bob101 should response 200 for register', async () => {
  const response = await postReq('/user/register', BOB101_USER);
  expect(response.statusCode).toBe(200);
});

test('/auth/login alice101 should response 200 and jwt.access_token', async () => {
  const body = {
    username: 'alice101',
    password: 'pass1234'
  };
  const response = await postReq('/auth/login', body);
  expect(response.statusCode).toBe(200);
  // console.log(response.body);
  // In JavaScript, there are six falsy values: false, 0, '', null, undefined, and NaN. Everything else is truthy.
  expect(response.body.jwt.access_token).toBeTruthy();
  authJwt.alice101_access_token = response.body.jwt.access_token;
});

test('/auth/login bob101 should response 200 and jwt.access_token', async () => {
  const body = {
    username: 'bob101',
    password: 'pass2222'
  };
  const response = await postReq('/auth/login', body);
  expect(response.statusCode).toBe(200);
  // console.log(response.body);
  expect(response.body.jwt.access_token).toBeTruthy();
  authJwt.bob101_access_token = response.body.jwt.access_token;
});

test('/user/users role SYSTEM authorizatioin, 200 ok', async () => {
  const response = await getReq('/user/users', authJwt.alice101_access_token);
  expect(response.statusCode).toBe(200);
});

test('/util/authorized without role-check authorizatioin, 200 ok', async () => {
  const response = await getReq('/util/authorized', authJwt.alice101_access_token);
  expect(response.statusCode).toBe(200);
  const response2 = await getReq('/util/authorized', authJwt.bob101_access_token);
  expect(response2.statusCode).toBe(200);
});

test('login with wrong password, 403 forbidden ', async () => {
  const body = {
    username: 'alice101',
    password: 'pass'
  };
  const response = await postReq('/auth/login', body);
  expect(response.statusCode).toBe(403);
});

test('login without password, 400 bad request', async () => {
  const body = {
    username: 'alice101',
  };
  const response = await postReq('/auth/login', body);
  expect(response.statusCode).toBe(400);
  expect(response.body).toEqual({
    message: 'Username and password are required!',
  });
});