import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { CardEntity } from './card.entity';
import { User } from './user.entity';

@Entity('users-cards')
export class UserCards {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: 0, nullable: false })
  count!: number;

  @OneToOne(() => CardEntity, { nullable: false })
  @JoinColumn({ name: 'cardId' })
  cardId!: number;

  @OneToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  userId!: number;
}
