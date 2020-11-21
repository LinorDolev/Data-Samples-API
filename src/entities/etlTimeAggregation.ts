import SampleType from "./sampleType";

export default class ETLTimeAggregation {
  sampleType: SampleType;
  startTime: Date;
  values: Array<number>;
  calculationType: CalculationType;
  periodMinutes: number;
  intervalMinutes: number;

  constructor(sampleType: SampleType, startTime: Date, values: Array<number>, calculationType: CalculationType,
    periodMinutes: number, intervalMinutes: number) {
    this.sampleType = sampleType;
    this.startTime = startTime;
    this.values = values;
    this.calculationType = calculationType;
    this.periodMinutes = periodMinutes;
    this.intervalMinutes = intervalMinutes;
  }
}

export enum CalculationType {
  Average = 'average',
  Max = 'max',
  Min = 'min',
  Count = 'count'
}