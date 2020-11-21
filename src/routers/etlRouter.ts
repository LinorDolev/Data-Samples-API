import express from 'express';
import { CalculationType } from '../entities/etlTimeAggregation';
import DataSampleService from '../services/dataSampleService';

const etlRouter = express.Router();
const dataSampleService = DataSampleService.getInstance();


etlRouter.get('/:calcType/:periodMinutes/:intervalMinutes/:sampleType', (request, response, next) => {
  const { calcType, periodMinutes, intervalMinutes, sampleType } = request.params;
  
});

const calcTypeMap = {
  [CalculationType.Average]: (values: Array<number>) => values.reduce((a, b) => a + b) / values.length,
  [CalculationType.Count]: (values: Array<number>) => values.length,
  [CalculationType.Max]: Math.max,
  [CalculationType.Min]: Math.min
}
export default etlRouter;