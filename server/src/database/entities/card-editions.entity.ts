import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('card-editions')
@Index(['name', 'cardNumber'], { unique: true })
export class CardEditions {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: false })
  cardSetName!: string;

  @Column({ nullable: false, unique: true })
  cardNumber!: string;
}
