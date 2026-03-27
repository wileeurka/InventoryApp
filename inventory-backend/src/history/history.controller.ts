import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { HistoryService } from './history.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { ExportHistoryDto } from './dto/export-history.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';

@Controller('history')
@UseGuards(JwtAuthGuard)
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  @Post()
  create(@Body() dto: CreateHistoryDto, @CurrentUser() user: any) {
    return this.historyService.create(dto, user.id);
  }

  @Get()
  findAll(
    @CurrentUser() user: any,
    @Query('sortBy') sortBy: 'newest' | 'oldest' = 'newest',
    @Query('month') month?: string,
  ) {
    return this.historyService.findAll(user.id, sortBy, month);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateHistoryDto) {
    return this.historyService.update(id, dto);
  }

  @Post('export')
  async exportXlsx(
    @Body() dto: ExportHistoryDto,
    @CurrentUser() user: any,
    @Res() res: Response,
  ) {
    const buffer = await this.historyService.exportXlsx(dto, user.id);
    const date = new Date().toISOString().split('T')[0];
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="raport_inwentaryzacji_${date}.xlsx"`,
    );
    res.end(buffer);
  }
}
