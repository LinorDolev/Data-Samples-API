import express from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv'; dotenv.config();


import dataSampleRouter from './routers/dataSampleRouter';
import ruleRouter from './routers/ruleRouter';


const app = express();

app.use(bodyParser.json()); // for parsing application/json

app.use('/data-sample', dataSampleRouter);
app.use('/rule', ruleRouter);


app.listen(process.env.PORT);
/**

Supported APIs:
DataSample - CRUD == 4 Requests
Rule - CRUD == 4 Requests

Bonus - ETL - based on the assumption there is one sample per minute, be able to query
the 5-minutes average/min/max/count data sets of pressure in a given hour.

const mongoCRUD = new MongoCRUD('dataSample');
mongoCRUD.create({ 'example2': 'linor' })
  // .then((result) => console.log(result))
  .catch((err) => console.error(err));

mongoCRUD.read({ 'example2': 'linor' })
  .then((result) => console.log(result));

 */