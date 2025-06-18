import { AppDataSource } from '../../data-source';
import { readdirSync } from 'fs';
import { join, resolve } from 'path';

async function runSeeds() {
  try {
    await AppDataSource.initialize();
    console.info('Data Source has been initialized!');

    const seedsDir = resolve(__dirname, 'seeds');
    const seedFiles = readdirSync(seedsDir).filter((file) =>
      file.endsWith('.ts'),
    );

    for (const file of seedFiles) {
      const filePath = join(seedsDir, file);
      const module = (await import(filePath)) as Record<string, unknown>;
      const SeedClass = Object.values(module)[0] as new () => {
        up: (queryRunner: unknown) => Promise<void>;
      };
      const seedInstance = new SeedClass();
      await seedInstance.up(AppDataSource.createQueryRunner());
      console.info(`Executed seed: ${file}`);
    }

    console.info('All seeds executed successfully!');
  } catch (error) {
    console.error('Error during seed execution:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

void runSeeds();
