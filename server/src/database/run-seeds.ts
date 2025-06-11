import { AppDataSource } from '../../data-source';
import { DefaultUser1749675347730 } from './seeds/1749675347730-default-user';

async function runSeeds() {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');

    const seed = new DefaultUser1749675347730();
    await seed.up(AppDataSource.createQueryRunner());

    console.log('Seed executed successfully!');
  } catch (error) {
    console.error('Error during seed execution:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

runSeeds();
