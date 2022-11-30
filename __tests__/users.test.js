const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const fakeUser = {
  email: 'test@test.com',
  password: '123456'
};

describe('/api/v1/users routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it.skip('POST /api/v1/users registers a new user', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send(fakeUser);
    const { email } = fakeUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      email
    });
  });
  
  afterAll(() => {
    pool.end();
  });
});
  
