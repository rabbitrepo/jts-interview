import { Schema, Document } from 'mongoose';

// Interface for the Report object
interface IReportBase {
  sub_type_id: number;
  type_id: number;
  rec_year: number;
  rec_month: number;
  rec_day: number;
  amount: number;
}

// Document interface
export interface IReport extends Document, IReportBase {}

// Create the Schema
const ReportSchema = new Schema<IReport>(
  {
    sub_type_id: {
      type: Number,
      required: true,
      index: true,
    },
    type_id: {
      type: Number,
      required: true,
      index: true,
    },
    rec_year: {
      type: Number,
      required: true,
      min: 2020,
      max: 2030,
      index: true,
    },
    rec_month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
      index: true,
    },
    rec_day: {
      type: Number,
      required: true,
      min: 1,
      max: 31,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    collection: 'report',
  },
);

// Response interfaces
export interface DailyAmount {
  day: number;
  amount: number;
}

export interface SubTypeData {
  sub_type_id: number;
  sub_type_name: string;
  daily_amounts: DailyAmount[];
  total: number;
}

export interface TypeData {
  type_id: number;
  type_name: string;
  sub_types: SubTypeData[];
  total: number;
  daily_totals: DailyAmount[];
}

export interface TypeSummary {
  type_id: number;
  type_name: string;
  total: number;
  percentage: number;
}

export interface DailyTypeBreakdown {
  type_id: number;
  type_name: string;
  amount: number;
}

export interface DailySummary {
  day: number;
  amount: number;
  by_type: DailyTypeBreakdown[];
}

export interface ReportSummary {
  total: number;
  by_type: TypeSummary[];
  by_date: DailySummary[];
}

export interface ReportResponse {
  data: TypeData[];
  summary: ReportSummary;
}

export { ReportSchema };
