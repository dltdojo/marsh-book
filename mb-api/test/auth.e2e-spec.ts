import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { GetReq, PostReq, ALICE101_SYSTEM, BOB101_USER } from './share';
import { EventEntity } from '../src/healthcare/event.entity';

const authJwt = {};

test('/user/users should response 401 Unauthorized', async () => {
  const response = await GetReq('/user/users');
  expect(response.statusCode).toBe(401);
});

test('/util/authorized should response 401 Unauthorized', async () => {
  const response = await GetReq('/util/authorized');
  expect(response.statusCode).toBe(401);
});

test('It should response 400 for register without password,email,roles', async () => {
  const body = {
    username: 'bob101',
  };
  const result400 = {
    message: 'Username, password, email and roles are required!',
  };
  const response = await PostReq('/user/register', body);
  expect(response.statusCode).toBe(400);
  expect(response.body).toEqual(result400);

  body.password = 'pass';
  const response2 = await PostReq('/user/register', body);
  expect(response2.statusCode).toBe(400);
  expect(response2.body).toEqual(result400);

  body.email = 'bob101@test';

  const response3 = await PostReq('/user/register', body);
  expect(response3.statusCode).toBe(400);
  expect(response3.body).toEqual(result400);
});

test('/user/register alice101 should response 200 for register', async () => {
  const response = await PostReq('/user/register', ALICE101_SYSTEM);
  expect(response.statusCode).toBe(200);
});

test('/user/register bob101 should response 200 for register', async () => {
  const response = await PostReq('/user/register', BOB101_USER);
  expect(response.statusCode).toBe(200);
});

test('/auth/login alice101 should response 200 and jwt.access_token', async () => {
  const body = {
    username: 'alice101',
    password: 'pass1234',
  };
  const response = await PostReq('/auth/login', body);
  expect(response.statusCode).toBe(200);
  // console.log(response.body);
  // In JavaScript, there are six falsy values: false, 0, '', null, undefined, and NaN. Everything else is truthy.
  expect(response.body.jwt.access_token).toBeTruthy();
  authJwt.alice101_access_token = response.body.jwt.access_token;
});

test('/auth/login bob101_user should response 200 and jwt.access_token', async () => {
  const body = {
    username: 'bob101',
    password: 'pass2222',
  };
  const response = await PostReq('/auth/login', body);
  expect(response.statusCode).toBe(200);
  expect(response.body.jwt.access_token).toBeTruthy();
  authJwt.bob101_access_token = response.body.jwt.access_token;
});

test('/user/users role SYSTEM authorizatioin, 200 ok', async () => {
  const response = await GetReq('/user/users', authJwt.alice101_access_token);
  expect(response.statusCode).toBe(200);
});

test('/util/authorized without role-check authorizatioin, 200 ok', async () => {
  const response = await GetReq(
    '/util/authorized',
    authJwt.alice101_access_token,
  );
  expect(response.statusCode).toBe(200);
  const response2 = await GetReq(
    '/util/authorized',
    authJwt.bob101_access_token,
  );
  expect(response2.statusCode).toBe(200);
});

test('login with wrong password, 403 forbidden ', async () => {
  const body = {
    username: 'alice101',
    password: 'pass',
  };
  const response = await PostReq('/auth/login', body);
  expect(response.statusCode).toBe(403);
});

test('login without password, 400 bad request', async () => {
  const body = {
    username: 'alice101',
  };
  const response = await PostReq('/auth/login', body);
  expect(response.statusCode).toBe(400);
  expect(response.body).toEqual({
    message: 'Username and password are required!',
  });
});

test('/event, new event, role user, 201 created', async () => {
  const event = new EventEntity();
  event.omaha = '{"D1":"OK"}';
  const response = await PostReq('/event', event, authJwt.bob101_access_token);
  // console.log(response);
  expect(response.statusCode).toBe(HttpStatus.CREATED);
});

test('/event/events, role user, 200 ok', async () => {
  const response = await GetReq('/event/events', authJwt.bob101_access_token);
  expect(response.statusCode).toBe(200);
  console.log(response.body);
});
