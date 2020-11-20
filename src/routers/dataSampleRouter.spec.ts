import chai, { } from 'chai';
import chaihttp from 'chai-http';
import mocha, { describe, beforeEach, it } from 'mocha';
import MongoCRUD from '../dal/mongoCRUD';

import DataSample from '../entities/dataSample';
import SampleType from '../entities/sampleType';

chai.use(chaihttp);

const db = new MongoCRUD<DataSample>(DataSample.name);
const BASE_URL = '/data-sample';
const SERVER = `http://localhost:${process.env.PORT}`

describe('DataSamples', () => {
  beforeEach((done) =>  //Before each test we empty the database
    db.clearDB().then(() => done())
  )
});


describe('/GET DataSample', () => {
  it('it should get a single data sample', (done) => {
    const date = new Date();
    const value = 10;
    const dataSample = new DataSample(date, SampleType.Volume, value);
    db.create(dataSample).then((sample) => {
      chai.request(SERVER)
        .get(`${BASE_URL}/${sample.id}`)
        .end((err, res) => {
          if (err) {
            console.error(err);
            done();
          }
          res.should.have.status(200);
          res.body.should.be.a(DataSample);
          res.body.should.be.eql(sample);
          return done();
        });
    });
  });
});