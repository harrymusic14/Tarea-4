import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm'
import { User } from './User'

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(() => User, user => user.sentTransactions)
  from_user!: User

  @ManyToOne(() => User, user => user.receivedTransactions)
  to_user!: User

  @Column('float')
  amount!: number

  @CreateDateColumn()
  created_at!: Date
}
