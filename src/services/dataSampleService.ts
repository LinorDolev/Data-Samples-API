import MongoCRUD from '../dal/mongoCRUD';
import { ObjectId } from 'mongodb';
import DataSample from '../entities/dataSample';
import SampleType from '../entities/sampleType';
import moment from 'moment-timezone';

export default class DataSampleService {
  private static MIN_TEMPRATURE_CELSIUS = -273.15;
  private static instance: DataSampleService;
  private mongoCRUD: MongoCRUD<DataSample>;

  private constructor() {
    this.mongoCRUD = new MongoCRUD<DataSample>(DataSample.name);
  }

  query() {
    const options = {
      sort: { timestamp: -1 },
      limit: 1
    };
    return this.mongoCRUD.read({}, options);
  }

  async addSample(sample: DataSample): Promise<DataSample> {
    this.validateDate(sample.timestamp);
    this.validateSampleType(sample.sampleType, sample.value);

    return DataSampleService.instance.mongoCRUD.create(sample);
  }

  async findSample(id: string, timezone?: string): Promise<DataSample> {
    return this.mongoCRUD.read({ _id: new ObjectId(id.toString()) })
      .then(readSample => {
        if (!timezone) {
          return readSample;
        }
        let convertDateToTimeZone = moment.tz(readSample.timestamp, timezone);
        readSample.timestamp = new Date(convertDateToTimeZone.format());
      });
  }

  async findLastBySampleType(sampleType: SampleType): Promise<DataSample> {
    return this.mongoCRUD.read({ sampleType }, {
      sort: { timestamp: -1 },
      limit: 1
    });
  }

  async updateSample(id: string, dataSample: DataSample): Promise<DataSample> {
    return this.mongoCRUD.update(id, dataSample);
  }

  async deleteSample(id: string): Promise<DataSample> {
    return this.mongoCRUD.delete(id);
  }

  static getInstance(): DataSampleService {
    if (!DataSampleService.instance) {
      DataSampleService.instance = new DataSampleService();
    }
    return DataSampleService.instance;
  }

  validateDate(date: Date) {
    if (date > new Date()) {
      throw new Error(`Date ${date} is from the future!`);
    }
  }

  validateSampleType(type: string, value: number) {
    switch (type) {
      case SampleType.Volume:
        if (value < 0) {
          throw new Error(`${SampleType.Volume} can not be negative, received: ${value}`);
        }
        break;

      case SampleType.Temprature:
        if (value < DataSampleService.MIN_TEMPRATURE_CELSIUS) {
          throw new Error(`Assuming temprature is measured in celsius: ${value} 
                          is below absolute zero (${DataSampleService.MIN_TEMPRATURE_CELSIUS}° C)`)
        }
        break;

      default:
        break;
    }
  }
}