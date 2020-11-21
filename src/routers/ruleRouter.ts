import express from 'express';
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

import RuleService from '../services/ruleService';
import Rule from '../entities/rule';
import requestBodyValidator from '../utils/requestBodyValidator';

const ruleRouter = express.Router();
const ruleService = RuleService.getInstance();

ruleRouter.use(requestBodyValidator(Rule));

ruleRouter.post('/', async (request, response, next) => {
  return ruleService.createRule(request.body)
    .then(response.send)
    .catch(next);
});

ruleRouter.get('/:id');


ruleRouter.put('/:id');


ruleRouter.delete('/:id');


export default ruleRouter;