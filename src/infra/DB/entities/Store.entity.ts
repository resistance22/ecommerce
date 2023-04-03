import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Index,
} from "typeorm"

@Entity("store")
export class Store extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Index()
  @Column()
  title: string

  @Column({
    nullable: true,
    type: "varchar"
  })
  description: string
}