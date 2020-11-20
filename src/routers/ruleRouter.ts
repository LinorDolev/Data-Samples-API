import express from 'express';
import RuleService from '../services/ruleService';

const ruleRouter = express.Router();


const ruleService = new RuleService();

ruleRouter.post('/', (request, response) => {
  response.send(ruleService.query(request.body));
});


ruleRouter.get('/:id')


ruleRouter.put('/:id')


ruleRouter.delete('/:id')


export default ruleRouter;