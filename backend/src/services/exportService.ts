import ExcelJS from 'exceljs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function fmtDate(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${d}/${m}/${date.getFullYear()}`;
}

export async function generateTransactionsXlsx(userId: string): Promise<Buffer> {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  });

  const wb = new ExcelJS.Workbook();
  wb.creator = 'Radar de Gastos';

  const ws = wb.addWorksheet('Transações', {
    views: [{ state: 'frozen', ySplit: 1 }],
  });

  ws.columns = [
    { header: 'ID (não edite)', key: 'id',          width: 32 },
    { header: 'Data',           key: 'date',         width: 13 },
    { header: 'Descrição',      key: 'description',  width: 36 },
    { header: 'Categoria',      key: 'category',     width: 16 },
    { header: 'Tipo',           key: 'type',         width: 11 },
    { header: 'Valor (R$)',     key: 'amount',       width: 14 },
  ];

  const headerRow = ws.getRow(1);
  headerRow.height = 24;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = { bottom: { style: 'thin', color: { argb: 'FF334155' } } };
  });

  ws.autoFilter = { from: 'A1', to: 'F1' };

  transactions.forEach((t) => {
    const isIncome = t.type === 'INCOME';
    const row = ws.addRow({
      id:          t.id,
      date:        fmtDate(t.date),
      description: t.description,
      category:    t.category,
      type:        isIncome ? 'Receita' : 'Despesa',
      amount:      t.amount,
    });

    const rowBg = isIncome ? 'FFF0FDF4' : 'FFFFF1F2';

    row.eachCell({ includeEmpty: true }, (cell, col) => {
      if (col === 1) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
        cell.font = { color: { argb: 'FF94A3B8' }, size: 9 };
      } else {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBg } };
        cell.font = { size: 11 };
      }
      cell.alignment = { vertical: 'middle' };
    });

    const amountCell = row.getCell(6);
    amountCell.numFmt = '#,##0.00';
    amountCell.alignment = { horizontal: 'right', vertical: 'middle' };

    const typeCell = row.getCell(5);
    typeCell.font = { size: 11, bold: true, color: { argb: isIncome ? 'FF16A34A' : 'FFDC2626' } };
    typeCell.alignment = { horizontal: 'center', vertical: 'middle' };

    row.height = 20;
  });

  return wb.xlsx.writeBuffer() as unknown as Promise<Buffer>;
}
