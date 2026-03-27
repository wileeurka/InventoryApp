import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { HistoryModule } from './history/history.module';
import { StatsModule } from './stats/stats.module';
import { SeedModule } from './seed/seed.module';
import { User } from './users/user.entity';
import { Product } from './products/product.entity';
import { HistoryItem } from './history/history-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'inventoryapp',
      entities: [User, Product, HistoryItem],
      synchronize: true, // auto-creates tables — disable in production!
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    HistoryModule,
    StatsModule,
    SeedModule,
  ],
})
export class AppModule {}
