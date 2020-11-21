import express from 'express';

import RuleService from '../services/ruleService';
import Rule from '../entities/rule';
import { requestBodyValidator } from '../utils/requestBodyValidator';


const ruleRouter = express.Router();
const ruleService = RuleService.getInstance();

ruleRouter.use(requestBodyValidator<Rule>(Rule));

ruleRouter.post('/', async (request, response, next) => {
  return ruleService.createRule(request.body)
    .then((rule) => response.send(rule))
    .catch(next);
});

ruleRouter.get('/evaluate/:id', async (request, response, next) => {
  return ruleService.evaluate(request.params.id)
    .then(rule => response.send(rule))
    .catch(next);
});

ruleRouter.get('/:id', async (request, response, next) => {
  return ruleService.readRule(request.params.id)
    .then((rule) => response.send(rule))
    .catch(next);
});


ruleRouter.put('/:id', async (request, response, next) => {
  return ruleService.updateRule(request.params.id, request.body)
    .then((rule) => response.send(rule))
    .catch(next);
});

ruleRouter.delete('/:id', async (request, response, next) => {
  return ruleService.deleteRule(request.params.id)
    .then((rule) => response.send(rule))
    .catch(next);
});

export default ruleRouter;