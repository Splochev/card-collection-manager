import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';
import { Injectable } from '@nestjs/common';
import { CardsService } from '../cards/cards.service';
import { ScrapeCardDto } from 'src/interfaces/cards/CardApiResponse.interface';

const SKIP_URLS = {
  'https://yugioh.fandom.com/wiki/Hobby_League_participation_cards': 0,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_World_Championship_Qualifier_National_Championships_2011_prize_cards': 0,
  'https://yugioh.fandom.com/wiki/2-Player_Starter_Deck:_Yuya_&_Declan': 1,
  'https://yugioh.fandom.com/wiki/Structure_Deck:_Marik': 1,
  'https://yugioh.fandom.com/wiki/Battle_Pack_Tournament_Prize_Cards': 1,
  'https://yugioh.fandom.com/wiki/Duelist_League_participation_cards': 1,
  'https://yugioh.fandom.com/wiki/Pharaoh_Tour_promotional_cards': 1,
  'https://yugioh.fandom.com/wiki/Shonen_Jump_Championship_Series_Prize_Cards': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_World_Championship_prize_cards': 1,
  'https://yugioh.fandom.com/wiki/KC_Grand_Tournament_2022_prize_card': 1,
  'https://yugioh.fandom.com/wiki/Attack_of_the_Giant_Card!!': 1,
  'https://yugioh.fandom.com/wiki/Custom_Token_Card': 1,
  'https://yugioh.fandom.com/wiki/Duelist_League_Promotional_Cards_-_Konami_Series': 1,
  'https://yugioh.fandom.com/wiki/Special_Promotional_Cards': 1,
  "https://yugioh.fandom.com/wiki/Kids'_WB!_Duel_of_Destiny_promotional_card": 1,
  'https://yugioh.fandom.com/wiki/Tin_Promotional_Cards': 1,
  'https://yugioh.fandom.com/wiki/Booster_Pack_Collectors_Tins_2002': 1,
  'https://yugioh.fandom.com/wiki/Collectible_Tins_2003': 1,
  'https://yugioh.fandom.com/wiki/Duelist_Pack_Collection_Tin_2007': 1,
  'https://yugioh.fandom.com/wiki/2013_Collectible_Tins': 1,
  'https://yugioh.fandom.com/wiki/Non-Video_Game_Product_Promotional_Cards': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_Elemental_Hero_Collections': 1,
  'https://yugioh.fandom.com/wiki/Duel_Disk_-_Yusei_Version': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_Adventskalender': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_Advent_Calendar_(2018)': 1,
  'https://yugioh.fandom.com/wiki/Oversized_Promotional_Cards': 1,
  'https://yugioh.fandom.com/wiki/Case_Topper_promotional_cards': 1,
  'https://yugioh.fandom.com/wiki/Magazine_and_Manga_Promotional_Cards': 1,
  'https://yugioh.fandom.com/wiki/Shonen_Jump': 1,
  'https://yugioh.fandom.com/wiki/Banzai': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_The_Official_Magazine': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_The_Movie_Ani-Manga': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_Duelist_Volume_16': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_Millennium_World_Volume_4': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_R_Volume_1': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_R_Volume_3': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_R_Volume_4': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_R_Volume_5': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_GX_Volume_1': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_GX_Volume_2': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_GX_Volume_3': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_GX_Volume_4': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_GX_Volume_5': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_GX_Volume_6': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_GX_Volume_7': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_GX_Volume_8': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_GX_Volume_9': 1,
  "https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_5D's_Volume_1": 1,
  "https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_5D's_Volume_2": 1,
  "https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_5D's_Volume_3": 1,
  "https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_5D's_Volume_4": 1,
  "https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_5D's_Volume_5": 1,
  "https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_5D's_Volume_6": 1,
  "https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_5D's_Volume_7": 1,
  "https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_5D's_Volume_8": 1,
  "https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_5D's_Volume_9": 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_ZEXAL_Volume_1': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_ZEXAL_Volume_2': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_ZEXAL_Volume_3': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_ZEXAL_Volume_4': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_ZEXAL_Volume_5': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_ZEXAL_Volume_6': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_ZEXAL_Volume_7': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_ZEXAL_Volume_8': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_ZEXAL_Volume_9': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_ARC-V_Volume_1': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_ARC-V_Volume_2': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_ARC-V_Volume_3': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_ARC-V_Volume_4': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_ARC-V_Volume_5': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_ARC-V_Volume_6': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_ARC-V_Volume_7': 1,
  'https://yugioh.fandom.com/wiki/Special_Edition_Promotional_Cards': 1,
  'https://yugioh.fandom.com/wiki/The_Lost_Art_Promotional_Cards': 1,
  'https://yugioh.fandom.com/wiki/Video_Game_Promotional_Cards_-_Xbox': 1,
  'https://yugioh.fandom.com/wiki/Video_Game_Promotional_Cards_-_Nintendo_DS': 1,
  'https://yugioh.fandom.com/wiki/Nightmare_Troubadour_Promotional_Cards': 1,
  'https://yugioh.fandom.com/wiki/Stardust_Accelerator_promotional_cards': 1,
  'https://yugioh.fandom.com/wiki/Video_Game_Promotional_Cards_-_Game_Boy_Advance': 1,
  'https://yugioh.fandom.com/wiki/Video_Game_Promotional_Cards_-_Nintendo_Game_Boy_Color': 1,
  'https://yugioh.fandom.com/wiki/Video_Game_Promotional_Cards_-_Nintendo_GameCube': 1,
  'https://yugioh.fandom.com/wiki/Video_Game_Promotional_Cards_-_Nintendo_Wii': 1,
  'https://yugioh.fandom.com/wiki/Video_Game_Promotional_Cards_-_Nintendo_Switch_(NS)': 1,
  'https://yugioh.fandom.com/wiki/Video_Game_Promotional_Cards_-_Personal_Computer_(PC)': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_Power_of_Chaos:_Kaiba_the_Revenge': 1,
  'https://yugioh.fandom.com/wiki/Video_Game_Promotional_Cards_-_Sony_Playstation_(PS)': 1,
  'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_Forbidden_Memories_Premium_Edition_promotional_cards': 1,
  'https://yugioh.fandom.com/wiki/Video_Game_Promotional_Cards_-_Sony_Playstation_2_(PS2)': 1,
  'https://yugioh.fandom.com/wiki/Video_Game_Promotional_Cards_-_Sony_Playstation_Portable_(PSP)': 1,
  'https://yugioh.fandom.com/wiki/Duel_Terminal': 1,
};

@Injectable()
export class ScrapeService {
  constructor(private readonly cardService: CardsService) {}

  async scrapeCardCollection(
    collectionName: string,
    failedExtractions: Set<string>,
  ): Promise<void> {
    const urlCollectionName = collectionName.replace(/ /g, '_');
    const url = `https://yugioh.fandom.com/wiki/${urlCollectionName}`;

    if (SKIP_URLS[url]) {
      console.log(`Skipping ${collectionName} as it is in the skip list.`);
      return;
    }

    failedExtractions.add(url);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 180000 });

    const tableHtml = await page.evaluate(() => {
      const table = document.querySelector('table.sortable');
      return table ? table.outerHTML : null;
    });

    if (!tableHtml) {
      console.error(`No table found on the page for ${collectionName}.`);
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
        const index = headers.findIndex((h) => {
          const lowerCaseHeader = h.toLowerCase();
          return (
            lowerCaseHeader === 'card number' ||
            lowerCaseHeader === 'set number'
          );
        });

        if (index !== -1) {
          headers[index] = 'Card Number';
        } else {
          throw new Error(
            `Expected header "Card Number" or "Set Number" not found in ${collectionName}`,
          );
        }

        headers.push('Collection Name');
      } else {
        const rowObject = { 'Collection Name': collectionName };
        rowData.forEach((val, i) => {
          val = val.replace(/"/g, '').trim();
          val = val.replace(/\s*\(.*?\)\s*/g, '').trim();

          rowObject[headers[i] || `col${i}`] = val;
        });
        rows.push(rowObject);
      }
    });

    await browser.close();
    void this.cardService.saveCards(
      collectionName,
      rows as unknown as ScrapeCardDto[],
    );

    console.log(`Scraped ${collectionName} successfully!`);
    failedExtractions.delete(url);
  }

  async scrapeCards(collectionNames: string[]): Promise<void> {
    console.log('Scraping started...');
    // delete everything from folder logs
    const logsPath = path.join(__dirname, `../../../../src/logs`);
    fs.rmSync(logsPath, { recursive: true, force: true });
    fs.mkdirSync(logsPath, { recursive: true });

    collectionNames = collectionNames.reverse();
    const failedExtractions: Set<string> = new Set();
    while (collectionNames.length) {
      const collectionName = collectionNames.pop() || '';
      try {
        await this.scrapeCardCollection(collectionName, failedExtractions);
      } catch (error) {
        const message =
          error instanceof Error ? error.message.toUpperCase() : String(error);
        if (
          message.includes('ERR_SOCKET_NOT_CONNECTED') ||
          message.includes('ERR_CONNECTION_CLOSED') ||
          message.includes('ERR_CERT_VERIFIER_CHANGED') ||
          message.includes('ERR_NAME_NOT_RESOLVED')
        ) {
          collectionNames.push(collectionName);
          await new Promise((r) => setTimeout(r, 20000));
        } else {
          console.error(`Error scraping ${collectionName}:`, error);
        }
      }
    }

    if (failedExtractions.size) {
      const seedFilePath = path.join(
        __dirname,
        `../../../../src/logs/scrape.status.json`,
      );

      fs.writeFileSync(
        seedFilePath,
        JSON.stringify(failedExtractions, null, 2),
      );
      console.log('Scrape completed...');
    }
  }
}
