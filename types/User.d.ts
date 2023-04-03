import { User } from "@infra/DB/entities/User.entity"
import { RequestHandler } from "express"
import { Repository } from "typeorm"
import { User as UserEntitiy } from "../src/domain/entities/User.entity"
export { }

declare global {
  declare namespace UserNS {
    declare namespace DTO {
      interface NewUser {
        first_name: string
        last_name: string
        email: string
        phone_number: string
        password: string
        email_confirmed?: boolean
        blocked?: boolean
      }
      interface IUser extends NewUser {
        id: string
        registered_at: string
        updated_at: string
        email_confirmed: boolean
        blocked: boolean
      }
    }

    interface IUserUsecases {
      register: (userData: UserNS.DTO.NewUser) => Promise<UserEntitiy>,
      signIn: (userData: { identifier: string, password: string }) => Promise<string>
    }

    declare namespace UseCases {
      interface IUserRegister {
        execute: (userData: UserNS.DTO.NewUser) => Promise<UserEntitiy>,
      }

      interface IUserSignIn {
        execute: (userData: { identifier: string, password: string }) => Promise<{
          accessToken: string,
          refreshToken: string
        }>
      }

      interface IUserConfirmMail {
        execute: (email: string, code: string) => Promise<{
          accessToken: string,
          refreshToken: string
        }>
      }
    }

    declare namespace Controllers {
      type register = (usecase: UseCases.IUserRegister) => IRoute
    }


    interface IUserRepository {
      hydrate: (sampleData: UserNS.DTO.NewUser[]) => Promise<void>
      truncate: () => Promise<void>
      insertNewUser: (user: UserNS.DTO.NewUser) => Promise<UserEntitiy>
      fetchUserByPhoneNumber: (phone_number: string) => Promise<UserEntitiy | null>
      fetchUserByEmail: (email: string) => Promise<UserEntitiy | null>
      fetchUserByIdentifier: (identifier: string) => Promise<UserEntitiy | null>
      fetchUserByID: (id: string) => Promise<UserEntitiy | null>
      insertRefreshToken: (id: string, refreshToken: string) => Promise<void>
      insertEmailConfirmationCode: (email: string, code: string) => Promise<string>
      checkEmailCode: (email: string, code: string) => Promise<{ success: true } | { success: false, error: string }>
      confirmUserEmail: (email: string) => Promise<UserEntitiy | null>
    }

    interface IUserUtils {
      checkPassword: (encryptedPass: string, plainPass: string) => Promise<boolean>
      makeJWT: (user: UserEntitiy, expiresIn?: number) => Promise<string>
      generateEmailConfirmationCode: () => string
    }

    interface EmailServices {
      sendEmailConfirmationCode: (user: UserEntitiy, code: string) => Promise<void>
    }

  }
}