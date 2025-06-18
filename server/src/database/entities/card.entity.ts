import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  cardType!: string;

  @Column()
  effect!: string;

  @Column()
  artwork!: string;

  @Column({ unique: true })
  cardSetCode!: string;

  @Column('jsonb', { nullable: true })
  metadata?: any;
}
