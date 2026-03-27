import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/product.entity';
import { HistoryItem } from '../history/history-item.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(HistoryItem)
    private historyRepository: Repository<HistoryItem>,
  ) {}

  async getStats(userId: string) {
    const articlesCount = await this.productsRepository.count();
    const scannedCount = await this.historyRepository.count({
      where: { user: { id: userId } },
    });
    return { articlesCount, scannedCount };
  }
}
