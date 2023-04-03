import { User as UserEntity } from '@DB/entities/User.entity'
import { makeUserfromDTO, User } from '@entities/User.entity'
import { DataSource, Repository } from 'typeorm'

export class TypeORMUserRepo implements UserNS.IUserRepository {
  private repo: Repository<UserEntity>
  private refreshTokens: { [key: string]: string } = {}
  private emailCodes: { [key: string]: string } = {}
  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(UserEntity)
  }

  async truncate() {
    await this.repo.delete({})
  }

  async hydrate(sampleData: UserNS.DTO.NewUser[]) {
    const sampleEnts = this.repo.create(sampleData)
    await this.repo.insert(sampleEnts)
  }

  async insertRefreshToken(id: string, refreshToken: string) {
    this.refreshTokens[id] = refreshToken
  }

  async fetchUserByIdentifier(identifier: string) {
    const foundUser = await this.repo.createQueryBuilder("user").where("user.email= :email OR user.phone_number= :phone_number", {
      email: identifier,
      phone_number: identifier
    }).getOne()
    if (!foundUser) return null
    return makeUserfromDTO({
      ...foundUser,
      registered_at: foundUser.registered_at.toJSON(),
      updated_at: foundUser.updated_at.toJSON()
    })
  }

  async fetchUserByPhoneNumber(phone_number: string) {
    const foundUser = await this.repo.findOne({
      where: {
        phone_number
      }
    })
    if (!foundUser) return null
    return makeUserfromDTO({
      ...foundUser,
      registered_at: foundUser.registered_at.toJSON(),
      updated_at: foundUser.updated_at.toJSON()
    })
  }

  async fetchUserByEmail(email: string) {
    const foundUser = await this.repo.findOne({
      where: {
        email
      }
    })
    if (!foundUser) return null
    return makeUserfromDTO({
      ...foundUser,
      registered_at: foundUser.registered_at.toJSON(),
      updated_at: foundUser.updated_at.toJSON()
    })
  }

  async fetchUserByID(id: string) {
    const foundUser = await this.repo.findOne({
      where: {
        id
      }
    })
    if (!foundUser) return null
    return makeUserfromDTO({
      ...foundUser,
      registered_at: foundUser.registered_at.toJSON(),
      updated_at: foundUser.updated_at.toJSON()
    })
  }

  async insertNewUser(user: UserNS.DTO.NewUser) {
    const newUser = this.repo.create(user)
    const insertedUser = await newUser.save()
    return makeUserfromDTO({
      ...insertedUser,
      registered_at: insertedUser.registered_at.toJSON(),
      updated_at: insertedUser.updated_at.toJSON()
    })
  }

  async insertEmailConfirmationCode(email: string, code: string) {
    // setTimeout(() => {
    //   delete this.emailCodes[email]
    // }, 1000 * 60 * 5)
    this.emailCodes[email] = code
    return code
  }

  async checkEmailCode(email: string, code: string) {

    const foundCode: string | undefined = this.emailCodes[email]
    if (!foundCode) {
      return {
        success: false as const,
        error: "Code has been expired"
      }
    }

    if (foundCode != code) {
      return {
        success: false as const,
        error: "Wrong Confirmation Code Provided"
      }
    }

    return {
      success: true as const
    }
  }

  async confirmUserEmail(email: string) {
    await this.repo.createQueryBuilder()
      .update()
      .set({ email_confirmed: true })
      .where("email = :email", { email })
      .execute()

    const foundUser = await this.repo.findOne({
      where: {
        email
      }
    })
    if (!foundUser) return null

    return makeUserfromDTO({
      ...foundUser,
      registered_at: foundUser.registered_at.toJSON(),
      updated_at: foundUser.updated_at.toJSON()
    })
  }
}