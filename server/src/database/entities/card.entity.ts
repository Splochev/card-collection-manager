import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  @Index()
  cardId!: string;

  @Column()
  name!: string;

  @Column()
  type!: string;

  @Column('text')
  description!: string;

  @Column()
  imageUrl!: string;

  @Column()
  cardSet!: string;

  @Column('simple-array', { nullable: true })
  typeline?: string[];
}
