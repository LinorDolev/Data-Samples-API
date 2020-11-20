import MongoCRUD from '../dal/mongoCRUD';
import DataSample from '../entities/dataSample';

export default class DataSampleService {
  private static instance: DataSampleService;
  private mongoCRUD: MongoCRUD<DataSample>;

  private constructor() {
    this.mongoCRUD = new MongoCRUD<DataSample>(DataSample.name);
  }

  async addSample(sample: DataSample) {
    /*
    1. Check date is not from the future
    2. Check value range for each type of sample:
      a. volume cannot be negative
      b. temprature is in the celsius range
      c. pressure ???
    */
    return DataSampleService.instance.mongoCRUD.create(sample);
  }

  async findSample(id: object, timezone: string) {
    /**
     * Use anything you need to convert the timestamp to the correct timezone.
     */
    return await this.mongoCRUD.read(id);
  }

  async updateSample(id: object, dataSample: DataSample) {
    return await this.mongoCRUD.update(id, dataSample);
  }

  async deleteSample(id: string) {
    
  }

  static getInstance(): DataSampleService {
    if (!DataSampleService.instance) {
      DataSampleService.instance = new DataSampleService();
    }
    return DataSampleService.instance;
  }
}