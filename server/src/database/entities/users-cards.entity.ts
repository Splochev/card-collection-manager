import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { CardEntity } from './card.entity';
import { User } from './user.entity';

@Entity('users-cards')
@Unique(['cardId', 'userId'])
export class UserCards {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: 0, nullable: false })
  count!: number;

  @ManyToOne(() => CardEntity, { nullable: false })
  @JoinColumn({ name: 'cardId' })
  cardId!: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  userId!: number;
}
