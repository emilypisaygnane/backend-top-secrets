const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const fakeUser = {
  email: 'test@test.com',
  password: '123456'
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? fakeUser.password;
  const agent = request.agent(app);
  const user = await UserService.create({ ...fakeUser, ...userProps });
  const { email } = user;

  await agent
    .post('/api/v1/users/sessions')
    .send({ email, password });
    
  return [agent, user];
};

describe('/api/v1/users routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('POST /api/v1/users registers a new user', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send(fakeUser);
    const { email } = fakeUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      email
    });
  });

  it('POST /api/v1/users/sessions signs in an existing user', async () => {
    const [agent, user] = await registerAndLogin();
    const res = await agent.get('/api/v1/users/1');

    expect(res.body).toEqual({
      ...user,
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });
  
  afterAll(() => {
    pool.end();
  });
});
  
