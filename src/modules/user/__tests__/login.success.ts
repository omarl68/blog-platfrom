import request from 'supertest';
import app from '../../../app';


export let adminToken: string;
export let internToken: string;
export let validatorToken: string;
export let companyToken: string;
export let refreshToken: string;


describe('LOGIN - SUCCESS', () => {

  it('Should login the admin!', async () => {
    const { status, body, headers } = await request(app)
      .post(`/api/login`)
      .send({ email: "admin@gmail.com", password: "admin123456" });

    expect(status).toBe(200);
    expect(body.data).toHaveProperty("user");
    expect(body.data).toHaveProperty("token");
    adminToken = body?.data?.token
    internToken = body?.data?.token
    validatorToken = body?.data?.token
    companyToken = body?.data?.token
    refreshToken = (headers['set-cookie'] as any)
      ?.find((cookie: string) => cookie.startsWith('refreshToken='))
      ?.split(';')[0]
      ?.split('=')[1];

    expect(refreshToken).toBeDefined();
    console.log('ref:', refreshToken)
    expect(body.data.user).toMatchObject({
      _id: expect.any(String),
      email: "admin@gmail.com",
      lastName: "admin",
      firstName: "admin",
      role: "admin",
    });
  });

});