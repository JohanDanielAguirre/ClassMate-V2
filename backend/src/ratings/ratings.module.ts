import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Rating, RatingSchema } from './schemas/rating.schema';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import {
  MonitoriaConfirmada,
  MonitoriaConfirmadaSchema,
} from '../monitorias-confirmadas/schemas/monitoria-confirmada.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Rating.name, schema: RatingSchema },
      { name: MonitoriaConfirmada.name, schema: MonitoriaConfirmadaSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [RatingsController],
  providers: [RatingsService],
  exports: [RatingsService],
})
export class RatingsModule {}
