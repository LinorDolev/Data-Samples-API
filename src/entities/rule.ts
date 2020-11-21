import { Expose } from "class-transformer";
import { IsDefined, IsString, Matches } from "class-validator";


export default class Rule {
  static NUM_REGEX = '((\\+|-)?(\\d+(\\.\\d*)?|\\.\\d+))';
  static SAMPLE_TYPE_REGEX = '({(temperature|volume|pressure)})';
  static LOGICAL_REGEX = '(or|and|AND|OR)';
  static RELATIONAL_REGEX = '(<|>|==|!=)';
  static SINGLE_OPERATOR_REGEX = `(${Rule.NUM_REGEX}\\s*${Rule.RELATIONAL_REGEX}\\s*${Rule.SAMPLE_TYPE_REGEX}|${Rule.SAMPLE_TYPE_REGEX}\\s*${Rule.RELATIONAL_REGEX}\\s*${Rule.NUM_REGEX})`;

  static RULE_REGEX = `^${Rule.SINGLE_OPERATOR_REGEX}\\s*(${Rule.LOGICAL_REGEX}\\s*${Rule.SINGLE_OPERATOR_REGEX}\\s*)*$`;

  @Expose()  
  _id: string;
  
  @Expose()
  @IsDefined()
  @IsString()
  @Matches(RegExp(Rule.RULE_REGEX),
    { message: 'Invalid Syntax for formula, you can learn about the correct syntax at the ReadMe.md file' })
  formula: string;

  constructor(formula: string) {
    this.formula = formula;
  }
}