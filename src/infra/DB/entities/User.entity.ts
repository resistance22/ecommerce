import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  Index
} from "typeorm"
import bcrypt from "bcrypt"

@Entity("user")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Index()
  @Column({
    unique: true,
  })
  email: string

  @Index()
  @Column({
    unique: true,
  })
  phone_number: string

  @Column({
    type: "varchar"
  })
  password: string

  @Column()
  first_name: string

  @Column()
  last_name: string

  @CreateDateColumn()
  registered_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @Column({
    "type": "boolean",
    default: false
  })
  email_confirmed: boolean

  @Column({
    "type": "boolean",
    default: false
  })
  blocked: boolean

  @BeforeInsert()
  async beforeInsertHook() {
    this.password = await bcrypt.hash(this.password, 10)
  }
}