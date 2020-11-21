import chai from 'chai';
import chaihttp from 'chai-http';
import { describe, beforeEach, it } from 'mocha';
import * as dotenv from 'dotenv'; dotenv.config()

import app from '../../app';
import MongoCRUD from '../../dal/mongoCRUD';

import DataSample from '../../entities/dataSample';
import SampleType from '../../entities/sampleType';

chai.use(chaihttp);

const db = new MongoCRUD<DataSample>(DataSample.name);
const BASE_URL = '/data-sample';
const SERVER = `http://localhost:${process.env.PORT}`

describe('DataSamples Tests', () => {
  beforeEach(async () =>  //Before each test empty the database
    await db.clearDB()
  )

  // POST REQUESTS
  it('should create a single data sample successfully', async () => {
    const timestamp = new Date();
    const value = 10;
    const dataSample = new DataSample(timestamp, SampleType.Volume, value);
    return chai.request(app)
      .post(`${BASE_URL}`)
      .send(dataSample)
      .then(res => {
        chai.expect(res.status).to.eql(200);
        return chai.expect(res.body.toString()).to.eql(dataSample.toString());
      })
  })

  it('should fail creating a sample with negative volume', async () => {
    const timestamp = new Date();
    const value = -10;
    const dataSample = new DataSample(timestamp, SampleType.Volume, value);
    return chai.request(app)
      .post(`${BASE_URL}`)
      .send(dataSample)
      .then(res => {
        return chai.expect(res.status).to.eql(500);
      })
  })

  it('should fail creating a sample with invalid celsius temperature', async () => {
    const timestamp = new Date();
    const value = -300;
    const dataSample = new DataSample(timestamp, SampleType.Temprature, value);
    return chai.request(app)
      .post(`${BASE_URL}`)
      .send(dataSample)
      .then(res => {
        return chai.expect(res.status).to.eql(500);
      })
  })

  it('should fail creating a sample without a timestamp', async () => {
    const timestamp = new Date();
    const value = 10;

    return chai.request(app)
      .post(`${BASE_URL}`)
      .send({ sampleType: SampleType.Pressure, value })
      .then(res => {
        return chai.expect(res.status).to.eql(500);
      })
  })

  it('should fail creating a sample with timestamp from the future', async () => {
    const timestamp = new Date(new Date().getTime() + 10000);
    const value = 10;
    const dataSample = new DataSample(timestamp, SampleType.Temprature, value);

    return chai.request(app)
      .post(`${BASE_URL}`)
      .send(dataSample)
      .then(res => {
        return chai.expect(res.status).to.eql(500);
      })
  })

  // GET REQUESTS
  it('should get a single data sample successfully', async () => {
    const timestamp = new Date();
    const value = 10;
    const dataSample = new DataSample(timestamp, SampleType.Volume, value);
    return db.create(dataSample).then((sample) => {
      console.log(sample);
      return chai.request(app)
        .get(`${BASE_URL}/${sample['_id']}/`)
        .then(res => {
          return chai.expect(res.body.toString()).to.eql(sample.toString());
        }
        )
    });
  })

  it('should get a single data sample with timestamp in another timezone successfully', async () => {
    const timestamp = new Date();
    const value = 10;
    const dataSample = new DataSample(timestamp, SampleType.Volume, value);
    return db.create(dataSample).then((sample) => {
      console.log(sample);
      return chai.request(app)
        .get(`${BASE_URL}/${sample['_id']}/America%2fNew_York`)
        .then(res => {
          let timezoneOffset = new Date(res.body.timestamp).getTimezoneOffset()
          console.log(res.body.timestamp);
          console.log(timezoneOffset);
          return //chai.expect().to.eql();
        }
        )
    });
  })
});

