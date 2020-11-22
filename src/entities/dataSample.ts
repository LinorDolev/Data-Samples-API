import SampleType from './sampleType';
import { Expose, Transform } from 'class-transformer';
import { IsDefined, IsEnum, IsNumber, Validate, ValidateIf } from 'class-validator';
import * as moment from 'moment';

export default class DataSample {
  @Expose()
  _id: string;

  @IsDefined()
  @Transform((input) => { if (input) return moment.utc(input) })
  @Expose()
  timestamp: moment.Moment;

  @IsDefined()
  @IsEnum(SampleType)
  @Expose()
  sampleType: SampleType;

  @IsDefined()
  @IsNumber()
  @Expose()
  value: number;

  constructor(timestamp: moment.Moment, sampleType: SampleType, value: number) {
    this.timestamp = timestamp;
    this.sampleType = sampleType;
    this.value = value;
  }
}