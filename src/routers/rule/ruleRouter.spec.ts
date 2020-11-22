import MongoCRUD from "../../dal/mongoCRUD";
import DataSample from "../../entities/dataSample";
import Rule from "../../entities/rule";
import chai from 'chai';
import chaihttp from 'chai-http';
import { describe, beforeEach, it } from 'mocha';
import moment from 'moment-timezone';

import app from '../../app';
import SampleType from "../../entities/sampleType";


const sampleDB = new MongoCRUD<DataSample>(DataSample.name);
const ruleDB = new MongoCRUD<Rule>(Rule.name);

const BASE_URL = '/rule'

describe('Rules Tests', () => {
  beforeEach(async () => { //Before each test empty the database
    await sampleDB.clearDB();
    await ruleDB.clearDB();
  }
  )

  // POST REQUESTS
  it('should create a rule successfully single condition', async () => {
    const rule = new Rule('{volume} < 4.12');
    return chai.request(app)
      .post(`${BASE_URL}`)
      .send(rule)
      .then(res => {
        chai.expect(res.status).to.eql(200);
        chai.expect(res.body.formula).to.eql(rule.formula);
        chai.expect(res.body._id).is.not.undefined;
        chai.expect(res.body._id).is.not.null;
        return;
      })
  });

  it('should create a rule successfully three conditions', async () => {
    const rule = new Rule('{volume} > 4.12 or -3.10 < {pressure} AND {temperature} < 0');
    return chai.request(app)
      .post(`${BASE_URL}`)
      .send(rule)
      .then(res => {
        chai.expect(res.status).to.eql(200);
        chai.expect(res.body.formula).to.eql(rule.formula);
        chai.expect(res.body._id).is.not.undefined;
        chai.expect(res.body._id).is.not.null;
        return;
      })
  });

  it('should fail creating a rule - comparing between samples', async () => {
    const rule = new Rule('{volume} > 4.12 or {volume} < {pressure} and {temperature} < 0');
    return chai.request(app)
      .post(`${BASE_URL}`)
      .send(rule)
      .then(res => {
        chai.expect(res.status).to.eql(500);
        return;
      })
  });

  it('should fail creating a rule - comparing numbers', async () => {
    const rule = new Rule('{volume} > 4.12 or -3.10 < {pressure} and -3 < 0');
    return chai.request(app)
      .post(`${BASE_URL}`)
      .send(rule)
      .then(res => {
        chai.expect(res.status).to.eql(500);
        return;
      })
  });


  it('should evaluate rule successfully - true expression', async () => {

    const volumeSample = new DataSample(moment(moment.now()), SampleType.Volume, 10);
    const temperatureSample = new DataSample(moment(moment.now()), SampleType.Temprature, -3);
    const pressureSample = new DataSample(moment(moment.now()), SampleType.Pressure, 10);
    const rule = new Rule('{volume} > 4.12 or -3.10 < {pressure} and -3 == {temperature}');
    const expectedParsedRule = '10 > 4.12 || -3.10 < 10 && -3 == -3';
    Promise.all([sampleDB.create(volumeSample), sampleDB.create(temperatureSample),
    sampleDB.create(pressureSample), ruleDB.create(rule)])
      .then(results => {
        const [volume, temperature, pressure, rule] = results;
        return chai.request(app)
          .get(`${BASE_URL}/evaluate/${rule._id}`)
          .then(res => {
            chai.expect(res.status).to.eql(200);
            chai.expect(res.body.result).equal(true);
            chai.expect(res.body.rule.formula).equal(rule.formula);
            chai.expect(res.body.parsedRule).equal(expectedParsedRule);

            return;
          })
      });



  });

  it('should evaluate rule successfully - false expression', async () => {

    const volumeSample = new DataSample(moment(moment.now()), SampleType.Volume, 10);
    const temperatureSample = new DataSample(moment(moment.now()), SampleType.Temprature, -3);
    const pressureSample = new DataSample(moment(moment.now()), SampleType.Pressure, 10);
    const rule = new Rule('{volume} > 4.12 or -3.10 < {pressure} and -3 != {temperature}');
    const expectedParsedRule = '10 > 4.12 || -3.10 < 10 && -3 != -3';
    Promise.all([sampleDB.create(volumeSample), sampleDB.create(temperatureSample),
    sampleDB.create(pressureSample), ruleDB.create(rule)])
      .then(results => {
        const [volume, temperature, pressure, rule] = results;
        return chai.request(app)
          .get(`${BASE_URL}/evaluate/${rule._id}`)
          .then(res => {
            chai.expect(res.status).to.eql(200);
            chai.expect(res.body.result).equal(false);
            chai.expect(res.body.rule.formula).equal(rule.formula);
            chai.expect(res.body.parsedRule).equal(expectedParsedRule);

            return;
          })
      });



  });

});