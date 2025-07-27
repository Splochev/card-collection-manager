import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ScrapeService {
  constructor() {}

  async scrapeCardSet(setName: string): Promise<void> {
    const url = `https://yugioh.fandom.com/wiki/${setName}`;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 180000 });

    const tableHtml = await page.evaluate(() => {
      const table = document.querySelector('table.sortable');
      return table ? table.outerHTML : null;
    });

    if (!tableHtml) {
      console.error('No table found on the page.');
      await browser.close();
      return;
    }

    const $c = cheerio.load(tableHtml);

    const headers: string[] = [];
    const rows: Record<string, string>[] = [];

    $c('tr').each((rowIdx, row) => {
      const cells = $c(row).find('th, td');
      const rowData: string[] = [];

      cells.each((cellIdx, cell) => {
        rowData.push($c(cell).text().trim());
      });

      if (rowIdx === 0) {
        headers.push(...rowData);
      } else {
        const rowObject = {};
        rowData.forEach((val, i) => {
          val = val.replace(/"/g, '').trim();
          rowObject[headers[i] || `col${i}`] = val;
        });
        rows.push(rowObject);
      }
    });

    await browser.close();
    const seedFilePath = path.join(
      __dirname,
      '../../../../src/database/seed-files/card-sets-mapping',
      `${setName.replaceAll(':', '')}.jsonc`,
    );

    fs.writeFileSync(seedFilePath, JSON.stringify(rows, null, 2));
    console.log(`Scraped ${setName} successfully!`);
  }

  async scrapeCardSets(setNames: string[]): Promise<void> {
    console.log('Scraping started...');
    setNames = setNames.reverse();
    while (setNames.length) {
      const setName = setNames.pop() || '';
      try {
        await this.scrapeCardSet(setName.replace(/ /g, '_'));
      } catch (error) {
        const message =
          error instanceof Error ? error.message.toUpperCase() : String(error);
        if (
          message.includes('ERR_SOCKET_NOT_CONNECTED') ||
          message.includes('ERR_CONNECTION_CLOSED') ||
          message.includes('ERR_CERT_VERIFIER_CHANGED')
        ) {
          setNames.push(setName);
          await new Promise((r) => setTimeout(r, 20000));
        } else {
          // eslint-disable-next-line no-debugger
          debugger;
          console.error(`Error scraping ${setName}:`, error);
        }
      }
    }
    console.log('Scraping completed.');
  }
}
