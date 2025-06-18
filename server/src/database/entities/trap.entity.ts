import { Entity, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { Card } from './card.entity';

@Entity('traps')
export class Trap {
  @PrimaryColumn({ name: 'cards_id', type: 'int' })
  cardsId!: number;

  @OneToOne(() => Card, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cards_id' })
  card!: Card;
}
