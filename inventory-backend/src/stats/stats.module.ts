import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { Product } from '../products/product.entity';
import { HistoryItem } from '../history/history-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, HistoryItem])],
  providers: [StatsService],
  controllers: [StatsController],
})
export class StatsModule {}
