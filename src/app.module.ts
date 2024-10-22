import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportSchema } from './schemas/report.schema';
import { SubTypeSchema } from './schemas/sub-type.schema';
import { TypeSchema } from './schemas/type.schema';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      dbName: 'JTS',
    }),
    MongooseModule.forFeature([
      { name: 'Report', schema: ReportSchema },
      { name: 'SubType', schema: SubTypeSchema },
      { name: 'Type', schema: TypeSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
