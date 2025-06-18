import { Entity, PrimaryColumn, OneToOne, JoinColumn, Column } from 'typeorm';
import { Card } from './card.entity';

@Entity('monsters')
export class Monster {
  @PrimaryColumn({ name: 'cards_id', type: 'int' })
  cardsId!: number;

  @OneToOne(() => Card, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cards_id' })
  card!: Card;

  @Column({ nullable: true, type: 'int' })
  atk?: number;

  @Column({ nullable: true, type: 'int' })
  def?: number;

  @Column({ nullable: true, type: 'int' })
  level?: number;

  @Column({ nullable: true })
  attribute?: string;

  @Column({ nullable: true, type: 'int' })
  scale?: number;

  @Column('text', { nullable: true })
  pendulumDesc?: string;

  @Column('text', { nullable: true })
  monsterDesc?: string;

  @Column({ nullable: true })
  race!: string;
}
