import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Product } from '../products/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [SeedService],
})
export class SeedModule {}
