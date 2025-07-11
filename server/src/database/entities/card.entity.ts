import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('cards')
@Index(['cardSet', 'cardId', 'name'], { unique: true })
export class CardEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  type!: string;

  @Column({ nullable: true })
  desc?: string;

  @Column()
  race!: string;

  @Column()
  cardSet!: string;

  @Column()
  cardId!: string;

  @Column({ type: 'text', nullable: true })
  imageUrl!: string | null;

  @Column('simple-array', { nullable: true })
  typeline?: string[];

  @Column({ type: 'int', nullable: true })
  atk?: number;

  @Column({ type: 'int', nullable: true })
  def?: number;

  @Column({ type: 'int', nullable: true })
  level?: number;

  @Column({ nullable: true })
  attribute?: string;

  @Column({ type: 'int', nullable: true })
  linkval?: number;

  @Column('simple-array', { nullable: true })
  linkmarkers?: string[];

  @Column({ nullable: true })
  pend_desc?: string;

  @Column({ nullable: true })
  monster_desc?: string;

  @Column({ type: 'int', nullable: true })
  scale?: number;

  @Column({ nullable: true })
  humanReadableCardType?: string;

  @Column({ nullable: true })
  frameType?: string;

  @Column({ nullable: true })
  archetype?: string;
}
