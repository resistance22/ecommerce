import { makeHTTPError } from "@assets/index";

export class UserRegisterUseCase implements UserNS.UseCases.IUserRegister {
  private readonly userRepository: UserNS.IUserRepository;
  private readonly userUtils: UserNS.IUserUtils
  private readonly emailServices: UserNS.EmailServices
  constructor(
    userRepo: UserNS.IUserRepository,
    userUtils: UserNS.IUserUtils,
    emailService: UserNS.EmailServices
  ) {
    this.userRepository = userRepo
    this.userUtils = userUtils
    this.emailServices = emailService
  }

  async execute(userData: UserNS.DTO.NewUser) {
    const foundUserByEmail = await this.userRepository.fetchUserByEmail(userData.email)
    const foundUserByPhone = await this.userRepository.fetchUserByPhoneNumber(userData.phone_number)
    if (foundUserByEmail) {
      throw makeHTTPError(409, "Email Address Already Exists", ["Email Address Already Exists"])
    }
    if (foundUserByPhone) {
      throw makeHTTPError(409, "Phone Number Already Exists", ["Phone Number Already Exists"])
    }
    try {
      const createdUser = await this.userRepository.insertNewUser(userData)
      const code = this.userUtils.generateEmailConfirmationCode()
      await this.userRepository.insertEmailConfirmationCode(createdUser.email, code)
      try {
        await this.emailServices.sendEmailConfirmationCode(createdUser, code)
      } catch (e) {
        console.log(e)
      }
      return createdUser
    } catch (e) {
      console.log(e)
      throw makeHTTPError(400, "something went wrong!", ["something went wrong!"])
    }
  }
}