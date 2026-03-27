import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoryItem } from './history-item.entity';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { ExportHistoryDto } from './dto/export-history.dto';
import { Product } from '../products/product.entity';
import * as ExcelJS from 'exceljs';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(HistoryItem)
    private historyRepository: Repository<HistoryItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(dto: CreateHistoryDto, userId: string): Promise<HistoryItem> {
    const product = await this.productsRepository.findOne({
      where: { id: dto.productId },
    });
    if (!product) throw new NotFoundException('Produkt nie został znaleziony');

    const item = this.historyRepository.create({
      product,
      user: { id: userId } as any,
      quantity: dto.quantity,
      notes: dto.notes,
    });
    return this.historyRepository.save(item);
  }

  async findAll(
    userId: string,
    sortBy: 'newest' | 'oldest' = 'newest',
    month?: string,
  ): Promise<HistoryItem[]> {
    const query = this.historyRepository
      .createQueryBuilder('h')
      .leftJoinAndSelect('h.product', 'product')
      .where('h.user_id = :userId', { userId });

    if (month) {
      const [year, mon] = month.split('-').map(Number);
      const start = new Date(year, mon - 1, 1);
      const end = new Date(year, mon, 1);
      query.andWhere('h.scannedAt >= :start AND h.scannedAt < :end', { start, end });
    }

    query.orderBy('h.scannedAt', sortBy === 'newest' ? 'DESC' : 'ASC');
    return query.getMany();
  }

  async update(id: string, dto: UpdateHistoryDto): Promise<HistoryItem> {
    const item = await this.historyRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Wpis nie został znaleziony');
    item.quantity = dto.quantity;
    return this.historyRepository.save(item);
  }

  async exportXlsx(dto: ExportHistoryDto, userId: string): Promise<Buffer> {
    // Collect items for each selected date group
    const allItems: HistoryItem[] = [];
    for (const dateKey of dto.dateKeys) {
      const [year, mon, day] = dateKey.split('-').map(Number);
      const start = new Date(year, mon - 1, day, 0, 0, 0);
      const end = new Date(year, mon - 1, day, 23, 59, 59);
      const items = await this.historyRepository
        .createQueryBuilder('h')
        .leftJoinAndSelect('h.product', 'product')
        .where('h.user_id = :userId', { userId })
        .andWhere('h.scannedAt >= :start AND h.scannedAt <= :end', { start, end })
        .orderBy('h.scannedAt', 'ASC')
        .getMany();
      allItems.push(...items);
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'InventoryApp';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Raport Inwentaryzacji', {
      pageSetup: { paperSize: 9, orientation: 'portrait', fitToPage: true },
    });

    // ── Logo / Title row ──────────────────────────────────────────
    sheet.mergeCells('A1:F1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = 'RAPORT INWENTARYZACJI';
    titleCell.font = { size: 18, bold: true, color: { argb: 'FF1A1A2E' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8EAF6' } };
    sheet.getRow(1).height = 36;

    sheet.mergeCells('A2:F2');
    const subtitleCell = sheet.getCell('A2');
    const dateRange =
      dto.dateKeys.length === 1
        ? dto.dateKeys[0]
        : `${dto.dateKeys[0]} – ${dto.dateKeys[dto.dateKeys.length - 1]}`;
    subtitleCell.value = `Okres: ${dateRange}   |   Wygenerowano: ${new Date().toLocaleString('pl-PL')}`;
    subtitleCell.font = { size: 11, italic: true, color: { argb: 'FF555555' } };
    subtitleCell.alignment = { horizontal: 'center' };
    subtitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8EAF6' } };
    sheet.getRow(2).height = 22;

    // ── Empty spacer ──────────────────────────────────────────────
    sheet.addRow([]);

    // ── Header row ────────────────────────────────────────────────
    const headers = ['Lp.', 'Data', 'Nazwa produktu', 'Kod', 'Smak', 'Ilość'];
    const headerRow = sheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A237E' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        bottom: { style: 'medium', color: { argb: 'FF8E99F3' } },
      };
    });
    headerRow.height = 26;

    // ── Data rows ─────────────────────────────────────────────────
    let totalQuantity = 0;
    allItems.forEach((item, i) => {
      const dateStr = item.scannedAt
        ? item.scannedAt.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : '—';
      const row = sheet.addRow([
        i + 1,
        dateStr,
        item.product?.name || '—',
        item.product?.code || '—',
        item.product?.flavor || '—',
        item.quantity,
      ]);
      totalQuantity += item.quantity;

      const isEven = i % 2 === 0;
      row.eachCell((cell, colNum) => {
        cell.alignment = { vertical: 'middle', horizontal: colNum === 3 ? 'left' : 'center' };
        if (isEven) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4FC' } };
        }
        cell.border = {
          bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        };
      });
      row.height = 22;
    });

    // ── Summary row ───────────────────────────────────────────────
    sheet.addRow([]);
    const summaryRow = sheet.addRow(['', '', '', '', 'RAZEM SZTUK:', totalQuantity]);
    summaryRow.eachCell((cell) => {
      cell.font = { bold: true, size: 12 };
    });
    const totalCell = summaryRow.getCell(6);
    totalCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE082' } };
    totalCell.border = { top: { style: 'medium' }, bottom: { style: 'medium' } };

    // ── Column widths ─────────────────────────────────────────────
    sheet.columns = [
      { key: 'lp', width: 6 },
      { key: 'date', width: 14 },
      { key: 'name', width: 38 },
      { key: 'code', width: 14 },
      { key: 'flavor', width: 18 },
      { key: 'qty', width: 10 },
    ];

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async countForUser(userId: string): Promise<number> {
    return this.historyRepository.count({ where: { user: { id: userId } } });
  }
}
