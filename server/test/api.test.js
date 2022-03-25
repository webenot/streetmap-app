const request = require('supertest');

const app = require('../src/app');

describe('GET /api/v1', () => {
  it('responds with a json message', (done) => {
    request(app)
      .get('/api/v1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        message: 'API - 👋🌎🌍🌏'
      }, done);
  });
});

describe('POST /api/v1/messages', () => {
  it('responds with inserted message', (done) => {
    const result = {
      name: 'Test Name',
      message: 'Test message',
      latitude: 10,
      longitude: -10,
    };
    request(app)
      .post('/api/v1/messages')
      .send(result)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect((res) => {
        delete res.body._id;
        delete res.body.date;
      })
      .expect(200, result, done);
  });
  it('can signup that has diacritics', (done) => {
    const result = {
      name: 'Ÿööhöö',
      message: 'Test message',
      latitude: 10,
      longitude: -10,
    };
    request(app)
      .post('/api/v1/messages')
      .send(result)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect((res) => {
        delete res.body._id;
        delete res.body.date;
      })
      .expect(200, result, done);
  });
});
