import request from 'supertest';
const req = request('http://localhost:3000');

export const ALICE101_SYSTEM = {
  username: 'alice101',
  password: 'pass1234',
  email: 'alice101@test',
  roles: ['SYSTEM'],
};

export const BOB101_USER = {
  username: 'bob101',
  password: 'pass2222',
  email: 'bob101@test',
  roles: ['USER'],
};

export async function GetReq(path, jwtToken){
    if(jwtToken){
        return await req.get(`/api/v1${path}`).set('Authorization', 'bearer ' + jwtToken);
      }else{
        return await req.get(`/api/v1${path}`);
      }
}

export async function PostReq(path,body,jwtToken){
    if(jwtToken){
        return await req.post(`/api/v1${path}`).set('Authorization', 'bearer ' + jwtToken).send(body);
      }else{
        return await req.post(`/api/v1${path}`).send(body);
      }
}