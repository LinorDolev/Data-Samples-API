export default class ETLTimeAggregation {
  startTime: Date;
  values: Array<number>;
  calculationType: Calculation;
  periodMinutes: number;
  intervalMinutes: number;

  constructor(startTime: Date, values: Array<number>, calculationType: Calculation,
    periodMinutes: number, intervalMinutes: number) {
    this.startTime = startTime;
    this.values = values;
    this.calculationType = calculationType;
    this.periodMinutes = periodMinutes;
    this.intervalMinutes = intervalMinutes;
  }
}

export enum Calculation {
  Average = 'average',
  Max = 'max',
  Min = 'min',
  Count = 'count'
}