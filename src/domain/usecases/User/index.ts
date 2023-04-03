import { makeHTTPError } from "@assets/index"

export class UserUseCases implements UserNS.IUserUsecases {
  private readonly userRepository: UserNS.IUserRepository;
  private readonly userUtils: UserNS.IUserUtils
  constructor(userRepo: UserNS.IUserRepository, userUtils: UserNS.IUserUtils) {
    this.userRepository = userRepo
    this.userUtils = userUtils
  }

  async register(user: UserNS.DTO.NewUser) {
    const foundUserByEmail = await this.userRepository.fetchUserByEmail(user.email)
    const foundUserByPhone = await this.userRepository.fetchUserByPhoneNumber(user.phone_number)
    if (foundUserByEmail) {
      throw makeHTTPError(409, "Email Address Already Exists", ["Email Address Already Exists"])
    }
    if (foundUserByPhone) {
      throw makeHTTPError(409, "Phone Number Already Exists", ["Phone Number Already Exists"])
    }
    try {
      return await this.userRepository.insertNewUser(user)
    } catch (e) {
      throw makeHTTPError(400, "something went wrong!", ["something went wrong!"])
    }
  }

  async signIn({ identifier, password }: { identifier: string, password: string }) {
    const foundUser = await this.userRepository.fetchUserByIdentifier(identifier)
    if (!foundUser) {
      throw makeHTTPError(403, "Invalid Identifier", ["Invalid Identifier of Password"])
    }
    const correctPass = await this.userUtils.checkPassword(foundUser.password, password)
    if (!correctPass) {
      throw makeHTTPError(403, "Invalid Identifier", ["Invalid Identifier of Password"])
    }
    return (await this.userUtils.makeJWT(foundUser))
  }
}