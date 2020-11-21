import MongoCRUD from "../dal/mongoCRUD";
import Rule from "../entities/rule";


export default class RuleService {

  private static instance: RuleService;
  private mongoCRUD: MongoCRUD<Rule>;

  private constructor() {
    this.mongoCRUD = new MongoCRUD<Rule>(Rule.name);
  }

  query(rule: Rule) {
    // console.log(rule.formula);
    // // const matchGroups = rule.formula.match(this.FULL_REGEX);
    // // if (matchGroups.length == 0 || matchGroups[0] != rule.formula) {
    // //   throw new Error("Formula is in invalid format!");
    // // }
    // return matchGroups[0];
  }

  async createRule(rule: Rule): Promise<Rule> {
    console.log(rule.formula);
    return rule;
    // this.mongoCRUD.create(rule).then(rule => { 
    //   console.log(rule);
    // })
  }

  static getInstance(): RuleService {
    if (!RuleService.instance) {
      RuleService.instance = new RuleService();
    }
    return RuleService.instance;
  }

}