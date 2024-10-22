import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DailyAmount,
  DailySummary,
  IReport,
  SubTypeData,
  TypeData,
  TypeSummary,
} from './schemas/report.schema';
import { ISubType } from './schemas/sub-type.schema';
import { IType } from './schemas/type.schema';
import { Data } from './interface/data';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('Report')
    private readonly reportModel: Model<IReport>,

    @InjectModel('SubType')
    private readonly subTypeModel: Model<ISubType>,

    @InjectModel('Type')
    private readonly typeModel: Model<IType>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getReport(year: number, month: number): Promise<Data> {
    // // Fetch all required data in parallel
    const [types, subTypes, reports] = await Promise.all([
      this.typeModel.find().lean(),
      this.subTypeModel.find().lean(),
      this.reportModel
        .find({
          rec_year: year,
          rec_month: month,
        })
        .lean(),
    ]);

    // console.log('Fetched data:', { types, subTypes, reports });

    // Process main data array
    const processedData: TypeData[] = types.map((type) => {
      // Get all subtypes for this type
      const typeSubTypes = subTypes.filter((st) => st.type_id === type.type_id);

      // Process each subtype
      const sub_types: SubTypeData[] = typeSubTypes.map((subType) => {
        // Get all reports for this subtype
        const subTypeReports = reports.filter(
          (r) => r.sub_type_id === subType.sub_type_id,
        );

        // Create daily amounts array
        const daily_amounts: DailyAmount[] = subTypeReports
          .sort((a, b) => a.rec_day - b.rec_day)
          .map((report) => ({
            day: report.rec_day,
            amount: report.amount,
          }));

        // Calculate subtype total
        const total = daily_amounts.reduce(
          (sum, record) => sum + record.amount,
          0,
        );

        return {
          sub_type_id: subType.sub_type_id,
          sub_type_name: subType.sub_type_name,
          daily_amounts,
          total,
        };
      });

      // Calculate daily totals for this type
      const daily_totals: DailyAmount[] = Array.from(
        new Set(reports.map((r) => r.rec_day)),
      )
        .sort((a, b) => a - b)
        .map((day) => {
          const amount = reports
            .filter(
              (r) =>
                r.rec_day === day &&
                typeSubTypes.some((st) => st.sub_type_id === r.sub_type_id),
            )
            .reduce((sum, r) => sum + r.amount, 0);

          return { day, amount };
        });

      // Calculate type total
      const total = sub_types.reduce((sum, subType) => sum + subType.total, 0);

      return {
        type_id: type.type_id,
        type_name: type.type_name,
        sub_types,
        total,
        daily_totals,
      };
    });

    // Calculate grand total
    const grandTotal = processedData.reduce((sum, type) => sum + type.total, 0);

    // Create summary data
    const by_type: TypeSummary[] = processedData.map((type) => ({
      type_id: type.type_id,
      type_name: type.type_name,
      total: type.total,
      percentage: Number(((type.total / grandTotal) * 100).toFixed(1)),
    }));

    // Create daily summaries
    const by_date: DailySummary[] = Array.from(
      new Set(reports.map((r) => r.rec_day)),
    )
      .sort((a, b) => a - b)
      .map((day) => {
        const by_type = processedData.map((type) => ({
          type_id: type.type_id,
          type_name: type.type_name,
          amount: type.daily_totals.find((dt) => dt.day === day)?.amount || 0,
        }));

        const amount = by_type.reduce((sum, type) => sum + type.amount, 0);

        return {
          day,
          amount,
          by_type,
        };
      });

    // Return formatted data
    return {
      data: processedData,
      summary: {
        total: grandTotal,
        by_type,
        by_date,
      },
    };
  }
}
