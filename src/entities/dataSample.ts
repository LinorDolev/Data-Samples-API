import SampleType from './sampleType';
import { Expose, Transform } from 'class-transformer';
import { IsDefined, IsEnum, IsNumber } from 'class-validator';


export default class DataSample {
  @Expose()
  id: string;

  @IsDefined()
  @Transform((input) => new Date(input))
  @Expose()
  timestamp: Date;

  @IsDefined()
  @IsEnum(SampleType)
  @Expose()
  sampleType: SampleType;

  @IsDefined()
  @IsNumber()
  @Expose()
  value: number;

  constructor(timestamp: Date, sampleType: SampleType, value: number) {
    this.timestamp = timestamp;
    this.sampleType = sampleType;
    this.value = value;
  }
}