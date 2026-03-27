import { IsArray, IsString } from 'class-validator';

export class ExportHistoryDto {
  @IsArray()
  @IsString({ each: true })
  dateKeys: string[]; // "YYYY-MM-DD"
}
