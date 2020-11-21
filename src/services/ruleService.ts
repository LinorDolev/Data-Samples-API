import { ObjectId } from 'mongodb';
import MongoCRUD from '../dal/mongoCRUD';
import DataSample from '../entities/dataSample';
import Rule from '../entities/rule';
import SampleType from '../entities/sampleType';
import DataSampleService from './dataSampleService';
import { convertToClass } from '../utils/requestBodyValidator';

export default class RuleService {

  private static instance: RuleService;
  private mongoCRUD: MongoCRUD<Rule>;
  private dataSampleService: DataSampleService;

  private constructor() {
    this.mongoCRUD = new MongoCRUD<Rule>(Rule.name);
    this.dataSampleService = DataSampleService.getInstance();
  }

  async evaluate(ruleId: string) {
    return this.readRule(ruleId)
      .then(async (rule: Rule) => {
        let parsedRule = rule.formula;
        let samples = {};
        
        parsedRule = parsedRule.replace(RegExp('or|OR'), '||').replace(RegExp('and|AND'), '&&');
        
        for (const sampleType in SampleType) {
          await this.dataSampleService.findLastBySampleType(SampleType[sampleType])
            .then((sample: DataSample) => {
              parsedRule = parsedRule.replace(`{${sample.sampleType}}`, sample.value.toString());
              samples[sample.sampleType] = sample;
            });

        }
        return { rule, parsedRule, result: eval(parsedRule), samples };
      });
  }

  async createRule(rule: Rule): Promise<Rule> {
    return this.mongoCRUD.create(rule);
  }

  async readRule(id: string): Promise<Rule> {
    return this.mongoCRUD.read({ _id: new ObjectId(id) })
      .then((rule) => convertToClass(rule, Rule));
  }

  async updateRule(id: string, rule: Rule): Promise<Rule> {
    return this.mongoCRUD.update(id, rule);
  }
  async deleteRule(id: string): Promise<Rule> {
    return this.mongoCRUD.delete(id);
  }

  static getInstance(): RuleService {
    if (!RuleService.instance) {
      RuleService.instance = new RuleService();
    }
    return RuleService.instance;
  }

}