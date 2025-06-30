import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('cardSets')
export class CardSets {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, nullable: false })
  name!: string;

  @Column('jsonb', { nullable: false })
  //   TODO: when creating migration files, uncomment the following lines
  //   @Index('IDX_card_sets_abbreviations_gin', { synchronize: false })
  //   await queryRunner.query(`CREATE INDEX "IDX_card_sets_abbreviations_gin" ON "cardSets" USING GIN ("abbreviations")`);
  abbreviations!: string[];

  @Column('boolean', { nullable: true, default: false })
  isMissing?: boolean;
}
