import { User } from "@DB/entities/User.entity"
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm"

@Entity("address")
export class Address extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  first_line: string

  @Column({
    type: "varchar",
    nullable: true
  })
  second_line: string

  @Column({
    type: "character",
    length: 3
  })
  country_code: string

  @Column()
  state: string

  @Column()
  city: string

  @Column({
    type: "character",
    length: 100
  })
  zip_code: string

  @Column({
    type: "varchar",
    length: 150
  })
  title: string

  @Column({
    type: "varchar",
    length: 150,
    nullable: true
  })
  company: string


  @Column({ type: "uuid", nullable: true })
  user_id: string

  @ManyToOne(() => User, {
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "user_id" })
  user: User
}