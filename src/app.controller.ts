import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ReportQueryDto } from './dto/report-query.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/reports')
  async getReport(@Query() query: ReportQueryDto) {
    const result = await this.appService.getReport(query.year, query.month);

    if (!result) {
      throw new NotFoundException(
        'No data available for the specified month and year',
      );
    }

    return {
      success: true,
      data: result,
    };
  }
}
