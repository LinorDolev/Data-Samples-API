import express, { request, response } from 'express';
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

import DataSampleService from '../services/dataSampleService';
import DataSample from '../entities/dataSample';


const dataSampleRouter = express.Router();
const sampleService = DataSampleService.getInstance();

dataSampleRouter.post('/', (request, response) => {
  const dataSample = plainToClass(DataSample, request.body, { excludeExtraneousValues: true });
  validate(dataSample).then(async errors => {
    if (errors.length > 0) {
      return response.send(errors.map(error => JSON.stringify(error.constraints)));
    }
    const createdSample = await sampleService.addSample(dataSample);
    response.send(createdSample);
  });
});

// Should support reading in any timezone
dataSampleRouter.get('/:id/:timezone', (request, response) => {
  const { id, timezone } = request.params;
  // const sample = await sampleService.findSample(new String(id), timezone);
});

dataSampleRouter.put('/:id',);

dataSampleRouter.delete('/:id',);

export default dataSampleRouter;