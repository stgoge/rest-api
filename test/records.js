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

describe('Routes', async () => {
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
    const result = await chai
      .request(app.server)
      .post(signup)
      .send(preSave);
    expect(result.status).to.equal(200);
    token = result.body.token;
  });
  after('droping test db', async () => {
    await app.mongoose.connection.dropDatabase();
    console.log('\n Test database dropped');
    await app.mongoose.connection.close();
  });
  describe('signup', async () => {
    it('should create new user if username not found', async () => {
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
  describe('signin', async () => {
    it('should return error 400 if username and password empty', async () => {
      const emptyUser = {};
      try {
        const result = await chai
          .request(app.server)
          .post(signin)
          .send(emptyUser);
      } catch (error) {
        expect(error.status).to.be.equal(400);
      }
    });

    it('should return 200 and token', async () => {
      try {
        const result = await chai
          .request(app.server)
          .post(signin)
          .send(preSave);

        expect(result.status).to.be.equal(200);
        expect(result.body).not.to.be.empty;
        expect(result.body).to.have.property('token');
      } catch (error) {
        throw new Error(error);
      }
    });
  });
  describe('records', async () => {
    describe('post', async () => {
      const testRecord = { record: 'test record', status: '1', priority: '2' };
      const emptyRecord = { status: '1', priority: '2' };
      it('without token. should return status 401', async () => {
        try {
          await chai.request(app.server).post(records).send(testRecord);
        } catch (error) {
          expect(error.status).to.equal(401);
          expect(error.response.text).to.equal('Unauthorized');
        }
      });
      it('with token and empty record. should return status 400', async () => {
        try {
          const result = await chai
            .request(app.server)
            .get(records)
            .set('Authorization', token)
            .send(emptyRecord);
        } catch (error) {
          expect(error.status).to.equal(401);
        }
      });
      it('with token and correct record. should return status 200', async () => {
        try {
          const result = await chai
            .request(app.server)
            .get(records)
            .set('Authorization', token)
            .send(testRecord);
          expect(result.status).to.be.equal(200);
        } catch (error) {
          throw new Error(error);
        }
      });
    });
    describe('get', async () => {
      it('without token. should return status 401', async () => {
        try {
          await chai.request(app.server).get(records);
        } catch (error) {
          expect(error.status).to.equal(401);
          expect(error.response.text).to.equal('Unauthorized');
        }
      });
      it('with token. should return status 200', async () => {
        try {
          const result = await chai
            .request(app.server)
            .get(records)
            .set('Authorization', token);
          expect(result.status).to.equal(200);
          expect(result.body).to.a('array');
          expect(result.body.length).to.eql(0);
        } catch (error) {
          throw new Error(error);
        }
      });
    });
  });
});
