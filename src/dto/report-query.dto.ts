import { IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class ReportQueryDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;

  @Type(() => Number)
  @IsNumber()
  @Min(2020)
  @Max(2030)
  year: number;
}
