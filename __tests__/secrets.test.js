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

describe('secret routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('GET /secrets should show secrets if authenticated', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/secrets');
    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(3),
    expect(res.body[0]).toEqual({
      id: expect.any(String),
      title: expect.any(String),
      description: expect.any(String),
      created_at: expect.any(String)
    });
  });

  it('GET /api/v1/secrets should return a list of secrets if user is logged in', async () => {
    const fakeUser = {
      email: 'test@example.com',
      password: '123456',
    };
    await UserService.create(fakeUser);
    const agent = request.agent(app);
    await agent.post('/api/v1/users/sessions').send(fakeUser);
    const resp = await agent.get('/api/v1/secrets');
    expect(resp.status).toBe(200);
    expect(resp.body).toEqual([
      {
        id: expect.any(String),
        title: 'Spy Kids',
        description: 'My parents cant be spies, theyre not cool enough',
        created_at: expect.any(String),
      },
      {
        id: expect.any(String),
        title: 'Cats & Dogs',
        description: 'You fight like a poodle',
        created_at: expect.any(String),
      },
      {
        id: expect.any(String),
        title: 'G-Force',
        description: 'Dont pay any attention to him. Hes a quarter ferret',
        created_at: expect.any(String),
      },
    ]);
  });

  afterAll(() => {
    pool.end();
  });
});
