import { User } from "@entities/User.entity"
import { compare } from "bcrypt"
import { sign } from 'jsonwebtoken'

export class UserUtils implements UserNS.IUserUtils {
  checkPassword: (encryptedPass: string, plainPass: string) => Promise<boolean> = async function (encryptedPass: string, plainPass: string) {
    const check = await compare(plainPass, encryptedPass)
    return check
  }
  /**
   * Recieved a User and encodes it in jwt
   * @param user The User Object to be encoded
   * @param expiresIn [optional],The seconds from now that the token is valid if not provided defaults to 1 hour
   * @returns The jwt token genererated
   */
  makeJWT: (user: User, expiresIn?: number) => Promise<string> = async function (user, expiresIn = 60 * 60) {
    const {
      password,
      ...rest
    } = user
    const jwt = await sign(rest, process.env.JWT_SECRET || "verySecretKey", {
      expiresIn
    })
    return jwt
  }

  generateEmailConfirmationCode() {
    return `${Math.floor(Math.random() * 90000) + 10000}`
  }
}