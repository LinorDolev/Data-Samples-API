import express from 'express';
import DataSample from '../../entities/dataSample';
import ETLTimeAggregation, { CalculationType } from '../../entities/etlTimeAggregation';
import SampleType from '../../entities/sampleType';
import DataSampleService from '../../services/dataSampleService';
import logger from 'logops';

const etlRouter = express.Router();
const dataSampleService = DataSampleService.getInstance();

logger.setLevel('DEBUG');



etlRouter.get('/:calcType/:periodMinutes/:intervalMinutes/:sampleType', (request, response, next) => {
  let { calcType, intervalMinutes, periodMinutes, sampleType } = request.params;
  let startTimestamp = new Date();
  let startTime = startTimestamp.getTime();
  let values = [];
  let interval = setInterval(async () => {
    if (new Date().getTime() - startTime > +periodMinutes * 60 * 1000) {
      clearInterval(interval);
      response.send({ sampleType, startTimestamp, values, calcType, periodMinutes, intervalMinutes });
      return;
    }

    dataSampleService.readAll().then(allSamples => {
      let samplesValues = allSamples.filter(sample => sample.value && sample.sampleType === sampleType)
        .map(sample => sample.value);
      const calculation = calcTypeMap[calcType](samplesValues);
  
      logger.debug(`Sample Values: ${samplesValues}, calculation: ${calculation}`);
      values.push(calculation);
    });
    
  }, +intervalMinutes * 60 * 1000);
});

const calcTypeMap = {
  [CalculationType.Average]: (values: Array<number>) => values.reduce((a, b) => a + b) / values.length,
  [CalculationType.Count]: (values: Array<number>) => values.length,
  [CalculationType.Max]: Math.max,
  [CalculationType.Min]: Math.min
}
export default etlRouter;