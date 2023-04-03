import { makeHTTPError } from "@assets/index";

export class UserSignInUseCase implements UserNS.UseCases.IUserSignIn {
  private readonly userRepository: UserNS.IUserRepository;
  private readonly userUtils: UserNS.IUserUtils

  constructor(userRepo: UserNS.IUserRepository, userUtils: UserNS.IUserUtils) {
    this.userRepository = userRepo
    this.userUtils = userUtils
  }

  async execute({ identifier, password }: { identifier: string, password: string }) {
    const foundUser = await this.userRepository.fetchUserByIdentifier(identifier)
    if (!foundUser) {
      throw makeHTTPError(403, "Invalid Identifier", ["Invalid Identifier of Password"])
    }
    if (!foundUser.email_confirmed) {
      throw makeHTTPError(403, "Invalid Identifier", ["Your Email is not confirmed yet!"])
    }
    const correctPass = await this.userUtils.checkPassword(foundUser.password, password)
    if (!correctPass) {
      throw makeHTTPError(403, "Invalid Identifier", ["Invalid Identifier of Password"])
    }
    const accessToken = await this.userUtils.makeJWT(foundUser, 5 * 60)
    const refreshToken = await this.userUtils.makeJWT(foundUser, 60 * 60 * 24 * 7)
    await this.userRepository.insertRefreshToken(foundUser.id, refreshToken)
    return {
      accessToken,
      refreshToken
    }
  }
}