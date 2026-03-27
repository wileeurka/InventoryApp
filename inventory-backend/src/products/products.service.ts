import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto, user: User): Promise<Product> {
    const existing = await this.productsRepository.findOne({
      where: { code: dto.code },
    });
    if (existing) {
      throw new ConflictException('Produkt z tym kodem już istnieje');
    }
    const product = this.productsRepository.create({ ...dto, createdBy: user });
    return this.productsRepository.save(product);
  }

  async findAll(search?: string): Promise<Product[]> {
    if (search) {
      return this.productsRepository.find({
        where: [
          { name: Like(`%${search}%`) },
          { code: Like(`%${search}%`) },
          { flavor: Like(`%${search}%`) },
        ],
        order: { createdAt: 'DESC' },
      });
    }
    return this.productsRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findByCode(code: string): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { code } });
    if (!product) throw new NotFoundException('Produkt nie został znaleziony');
    return product;
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Produkt nie został znaleziony');
    return product;
  }

  async count(): Promise<number> {
    return this.productsRepository.count();
  }
}
