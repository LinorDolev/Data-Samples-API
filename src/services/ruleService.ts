import Rule from "../entities/rule";


export default class RuleService {
  NUM_REGEX = '((\\+|-)?(\\d+(\\.\\d*)?|\\.\\d+))'
  SAMPLE_TYPE_REGEX = '({(temperature|volume|pressure)})'
  LOGICAL_REGEX = '(or|and|AND|OR)'
  RELATIONAL_REGEX = '(<|>|==|!=)'
  SINGLE_OPERATOR_REGEX = `(${this.NUM_REGEX}\\s*${this.RELATIONAL_REGEX}\\s*${this.SAMPLE_TYPE_REGEX}|${this.SAMPLE_TYPE_REGEX}\\s*${this.RELATIONAL_REGEX}\\s*${this.NUM_REGEX})`

  FULL_REGEX = `^${this.SINGLE_OPERATOR_REGEX}\\s*(${this.LOGICAL_REGEX}\\s*${this.SINGLE_OPERATOR_REGEX}\\s*)*$`

  query(rule: Rule) {
    console.log(rule.formula)
    const matchGroups = rule.formula.match(this.FULL_REGEX);
    if (matchGroups.length == 0 || matchGroups[0] != rule.formula) {
      throw new Error("Formula is in invalid format!");
    }
    return matchGroups[0];
  }
}