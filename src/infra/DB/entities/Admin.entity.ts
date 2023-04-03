import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  Index,
  Check,
  ManyToOne,
  JoinColumn
} from "typeorm"
import bcrypt from "bcrypt"
import { Store } from "./Store.entity"

enum UserRoles {
  ADMIN = "admin",
  SHOPKEEPER = "shopkeeper",
}

@Entity("admin")
@Check(`role = "admin" OR role = "shopkeeper"`)
export class Admin extends BaseEntity {
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
    type: "varchar",
    select: false
  })
  password: string

  @Column()
  first_name: string

  @Column()
  last_name: string

  @Column({
    type: "varchar",
    default: UserRoles.SHOPKEEPER
  })
  role: UserRoles

  @CreateDateColumn()
  registerd_at: string

  @UpdateDateColumn()
  updated_at: string

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

  @Column({ type: "uuid", nullable: true })
  store_id: string

  @ManyToOne(() => Store, {
    onDelete: "SET NULL"
  })
  @JoinColumn({ name: "store_id" })
  store: Store

  @BeforeInsert()
  async beforeInsertHook() {
    this.password = await bcrypt.hash(this.password, 10)
  }
}