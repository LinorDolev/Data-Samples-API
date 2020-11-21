import chai from 'chai';
import chaihttp from 'chai-http';
import { describe, beforeEach, it } from 'mocha';
import * as dotenv from 'dotenv'; dotenv.config()

import app from '../app';
import MongoCRUD from '../dal/mongoCRUD';

import DataSample from '../entities/dataSample';
import SampleType from '../entities/sampleType';

chai.use(chaihttp);

const db = new MongoCRUD<DataSample>(DataSample.name);
const BASE_URL = '/data-sample';
const SERVER = `http://localhost:${process.env.PORT}`

describe('DataSamples Tests', () => {
  beforeEach(async () =>  //Before each test empty the database
    await db.clearDB()
  )

  it('it should get a single data sample', async () => {
    const date = new Date();
    const value = 10;
    const dataSample = new DataSample(date, SampleType.Volume, value);
    return db.create(dataSample).then((sample) => {
      console.log(sample);
      return chai.request(app)
        .get(`${BASE_URL}/${sample['_id']}/+2GMT`)
        .then(res => {
          return chai.expect(res.body.toString()).to.eql(sample.toString());
        }
        )
    });
  })
  //describe('/GET DataSample Sanity', () =>

  // );


});

