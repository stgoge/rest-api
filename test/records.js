const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const server = require('../js/init-server')();
const Record = require('../models/record');

const { expect } = chai;

chai.use(chaiHttp);

describe('Records', () => {
  beforeEach((done) => {
    Record.remove({}, (err) => {
      done();
    });
  });
  describe('/GET records', () => {
    it('it should GET all the records', (done) => {
      chai.request(server)
        .get('/records')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });
});
