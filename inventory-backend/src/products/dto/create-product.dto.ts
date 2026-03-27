import { IsString, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsString()
  @IsOptional()
  flavor?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
