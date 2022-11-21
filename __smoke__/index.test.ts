const supertest = require('supertest');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3434';
const navigation = supertest.agent(`${BASE_URL}`);

describe('navigation api', () => {
  it('should return hello world data', done => {
    navigation
      .post('/api/v1/graphql-ts-hello-world/graphql')
      .send({
        query: '{ hello }'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.data).toBeInstanceOf(Object);
        expect(res.body.data.hello).toEqual('Hello world!');
        return done();
      });
  });
});
