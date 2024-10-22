// @/types/data

// Daily amount record
export interface DailyAmount {
  day: number;
  amount: number;
}

// Sub-type data (e.g., อะคิตะ, American Short Hair)
export interface SubTypeData {
  sub_type_id: number;
  sub_type_name: string;
  daily_amounts: DailyAmount[];
  total: number;
}

// Type data (e.g., DOG, CAT)
export interface TypeData {
  type_id: number;
  type_name: string;
  sub_types: SubTypeData[];
  total: number;
  daily_totals: DailyAmount[];
}

// Summary data for each type (for pie chart)
export interface TypeSummary {
  type_id: number;
  type_name: string;
  total: number;
  percentage: number;
}

// Daily type breakdown
export interface DailyTypeBreakdown {
  type_id: number;
  type_name: string;
  amount: number;
}

// Daily summary data
export interface DailySummary {
  day: number;
  amount: number;
  by_type: DailyTypeBreakdown[];
}

// Overall summary
export interface DataSummary {
  total: number;
  by_type: TypeSummary[];
  by_date: DailySummary[];
}

// Main data interface
export interface Data {
  data: TypeData[];
  summary: DataSummary;
}

// Optional: Search/Filter parameters interface
export interface SearchParams {
  year: number;
  month: number;
}
