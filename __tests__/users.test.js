const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const fakeUser = {
  email: 'test@example.com',
  password: '123456'
};

describe('/api/v1/users routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('POST /api/v1/users registers a new user', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send(fakeUser);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'test@example.com',
    });
  });


  it('POST /api/v1/users/sessions should log in an existing user', async () => {
    await UserService.create(fakeUser);

    const resp = await request(app)
      .post('/api/v1/users/sessions')
      .send(fakeUser);

    expect(resp.status).toBe(200);
    expect(resp.body).toEqual({ message: 'Signed in successfully!' });
  });

  
  afterAll(() => {
    pool.end();
  });
});
  
