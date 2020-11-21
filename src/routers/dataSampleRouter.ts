import express from 'express';

import DataSampleService from '../services/dataSampleService';
import DataSample from '../entities/dataSample';
import requestBodyValidator from '../utils/requestBodyValidator';

const dataSampleRouter = express.Router();
const sampleService = DataSampleService.getInstance();

dataSampleRouter.use(requestBodyValidator(DataSample));

dataSampleRouter.post('/', async (request, response, next) => {
  sampleService.addSample(request.body)
    .then(response.send)
    .catch(next);
});

dataSampleRouter.get('/:id/:timezone?', (request, response, next) => {
  const { id, timezone } = request.params;
  sampleService.findSample(id, timezone)
    .then(response.send)
    .catch(next);
});

dataSampleRouter.put('/:id', (request, response, next) => {
  const dataSample = request.body;
  sampleService.updateSample(request.params.id, dataSample)
    .then(response.send)
    .catch(next);
});

dataSampleRouter.delete('/:id', (request, response, next) => {
  sampleService.deleteSample(request.params.id)
    .then(response.send)
    .catch(next);
});

export default dataSampleRouter;