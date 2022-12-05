const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const fakeUser = {
  email: 'test@example.com',
  password: '123456'
};

const registerAndLogin = async (userProps = {})  => {
  const password = userProps.password ?? fakeUser.password;

  const agent = request.agent(app);

  const user = await UserService.create({ ...fakeUser, ...userProps });

  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
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

  it('GET /protected should return a 401 if not authenticated', async () => {
    const res = await request(app).get('/api/v1/users/protected');
    expect(res.status).toEqual(401);
  });

  it('GET /protected should return the current user if authenticated', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/users/protected');
    expect(res.status).toEqual(200);
  });

  it('DELETE /sessions deletes the user session', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.delete('/api/v1/users/sessions');
    expect(res.status).toBe(204);
  });
  
  afterAll(() => {
    pool.end();
  });
});
  
