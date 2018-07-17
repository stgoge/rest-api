process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const startServer = require('../app');

const Record = require('../models/record');

const { expect } = chai;

chai.use(chaiHttp);

let token;
let app;

describe('Routes', () => {
  const signup = '/signup';
  const signin = '/signin';
  const records = '/records';
  const user = {
    username: faker.internet.userName(),
    password: faker.internet.password(),
  };
  const preSave = {
    username: 'somesmartname',
    password: faker.internet.password(),
  };
  before(async () => {
    app = await startServer();
    console.log(`server: ${app.server}`);
    console.log(`mongoose: ${app.mongoose}`);
    const result = await chai
      .request(app.server)
      .post(signup)
      .send(preSave);
    expect(result.status).to.equal(200);
    token = result.body.token;
  });
  after('droping test db', async () => {
    await app.mongoose.connection.dropDatabase(() => {
      console.log('\n Test database dropped');
    });
    await app.mongoose.connection.close();
  });
  describe('signup', () => {
    it('should crete new user if username not found', async () => {
      try {
        const result = await chai
          .request(app.server)
          .post(signup)
          .send(user);
        expect(result.status).to.equal(200);
        expect(result.body).not.to.be.empty;
        expect(result.body).to.have.property('token');
      } catch (error) {
        console.log(error);
      }
    });

    it('should return 403 if username was found', async () => {
      try {
        await chai
          .request(app.server)
          .post(signup)
          .send(preSave);
      } catch (error) {
        expect(error.status).to.equal(403);
        expect(error.response.text).to.equal('{"error":"Username is already in use"}');
      }
    });
  });
});
