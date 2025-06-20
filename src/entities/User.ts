import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm'
import { Transaction } from './Transaction'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ length: 100 })
  name!: string

  @Column({ length: 100, unique: true })
  email!: string

  @Column('text')
  password!: string

  @Column({ length: 20, unique: true })
  account_number!: string

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  balance!: number

  @CreateDateColumn()
  created_at!: Date

  @OneToMany(() => Transaction, (transaction) => transaction.from_user)
  sentTransactions!: Transaction[]

  @OneToMany(() => Transaction, (transaction) => transaction.to_user)
  receivedTransactions!: Transaction[]
}
