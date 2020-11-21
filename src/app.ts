import express from 'express';
import expressLogging from 'express-logging';
import logger from 'logops';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv'; dotenv.config();


import dataSampleRouter from './routers/dataSampleRouter';
import ruleRouter from './routers/ruleRouter';
import etlRouter from './routers/etlRouter';

const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(expressLogging(logger))

app.use('/data-sample', dataSampleRouter);
app.use('/rule', ruleRouter);
app.use('/ETL', etlRouter);

app.use((error, req, res, next) => {
  return res.status(500).json(error.toString());
});

app.listen(process.env.PORT);

export default app;
/**

Supported APIs:
DataSample - CRUD == 4 Requests
Rule - CRUD == 4 Requests + Rule Evaluation

Bonus - ETL - based on the assumption there is one sample per minute, be able to query
the 5-minutes average/min/max/count data sets of pressure in a given hour.

 */