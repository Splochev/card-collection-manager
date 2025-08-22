import { AppDataSource } from '../../data-source';
import * as fs from 'fs';
import * as path from 'path';

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function escapeCsvValue(v: any): string {
  if (v === null || v === undefined) return '';
  if (Array.isArray(v)) v = v.join('|'); // keep arrays importable in one cell
  if (typeof v === 'object') v = JSON.stringify(v);
  const s = String(v);
  // If contains comma, quote or newline, wrap in quotes and escape inner quotes
  if (/[",\n\r]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function toCsv(rows: any[]): string {
  if (!rows || rows.length === 0) return '';
  const headers = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
  const lines = [headers.join(',')];
  for (const r of rows) {
    const row = headers.map((h) => escapeCsvValue(r[h]));
    lines.push(row.join(','));
  }
  return lines.join('\n');
}

async function runBackup() {
  try {
    await AppDataSource.initialize();
    console.info('Data Source has been initialized!');

    const cards = await AppDataSource.getRepository('cards').find();
    const cardEditions =
      await AppDataSource.getRepository('card-editions').find();

    const backupsDir = path.join(__dirname, 'backups');
    ensureDir(backupsDir);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    try {
      const csv = toCsv(cards as any[]);
      const out = path.join(backupsDir, `cards-${timestamp}.csv`);
      fs.writeFileSync(out, csv, 'utf8');
      console.info(`Wrote ${cards.length} rows to ${out}`);
    } catch (err) {
      console.error('Failed to write cards CSV:', err);
    }

    try {
      const csv = toCsv(cardEditions as any[]);
      const out = path.join(backupsDir, `card-editions-${timestamp}.csv`);
      fs.writeFileSync(out, csv, 'utf8');
      console.info(`Wrote ${cardEditions.length} rows to ${out}`);
    } catch (err) {
      console.error('Failed to write card-editions CSV:', err);
    }

    console.info('Cards and CardEditions were backed up successfully (CSV)!');
  } catch (error) {
    console.error('Error during backup execution:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

void runBackup();
