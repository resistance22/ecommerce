import { UserSignInUseCase } from '@usecases/User/signIn.usecase'
import { TypeORMUserRepo } from '@repos/TypeORMUserRepo'
import { getDataSource } from '@DB/index'
import { UserUtils } from '@infra/utils/userUtils'
import { JwtPayload, verify } from 'jsonwebtoken'
import { assertHttpError } from '../../../../test/global.testutils'

const sampleData: UserNS.DTO.NewUser[] = [
  {
    first_name: "Amin",
    last_name: "Foroutan",
    email: "aminforoutan7@gmail.com",
    phone_number: "09301112524",
    password: "hellothisisthepassword",
    email_confirmed: true
  },
  {
    first_name: "Amin",
    last_name: "Foroutan",
    email: "aminforoutan8@gmail.com",
    phone_number: "09301112525",
    password: "hellothisisthepassword"
  },
  {
    first_name: "Amin",
    last_name: "Foroutan",
    email: "aminforoutan9@gmail.com",
    phone_number: "09301112526",
    password: "hellothisisthepassword"
  }
]

let repo: UserNS.IUserRepository
let signInUseCase: UserNS.UseCases.IUserSignIn

beforeAll(async () => {
  const ds = await getDataSource()
  const userUtils = new UserUtils()
  repo = new TypeORMUserRepo(ds)
  signInUseCase = new UserSignInUseCase(repo, userUtils)
})

beforeEach(async () => {
  await repo.hydrate(sampleData)
})

afterEach(async () => {
  await repo.truncate()
})

describe("UserSignInUseCase", () => {
  describe("UserSignInUserCase.execute", () => {
    test("Given Valid email Identifier and password Should Return Valid access token", async () => {
      const { accessToken } = await signInUseCase.execute({
        identifier: "aminforoutan7@gmail.com",
        password: "hellothisisthepassword"
      })
      const decoded: JwtPayload = verify(accessToken, process.env.JWT_SECRET || "verySecretKey") as JwtPayload
      expect(decoded).toHaveProperty("id")
      expect(decoded.first_name).toBe("Amin")
      expect(decoded.last_name).toBe("Foroutan")
      expect(decoded.email).toBe("aminforoutan7@gmail.com")
      expect(decoded.phone_number).toBe("09301112524")
      expect(decoded).toHaveProperty("registered_at")
      expect(decoded).toHaveProperty("updated_at")
      expect(decoded).toHaveProperty("iat")
      expect(decoded).toHaveProperty("exp")
      expect(decoded).not.toHaveProperty("password")
      expect(decoded.blocked).toBe(false)
      expect(decoded.email_confirmed).toBe(true)
    })
    test("Given Valid email Identifier and password Should Return Valid refresht token", async () => {
      const { refreshToken } = await signInUseCase.execute({
        identifier: "aminforoutan7@gmail.com",
        password: "hellothisisthepassword"
      })
      const decoded: JwtPayload = verify(refreshToken, process.env.JWT_SECRET || "verySecretKey") as JwtPayload
      expect(decoded).toHaveProperty("id")
      expect(decoded.first_name).toBe("Amin")
      expect(decoded.last_name).toBe("Foroutan")
      expect(decoded.email).toBe("aminforoutan7@gmail.com")
      expect(decoded.phone_number).toBe("09301112524")
      expect(decoded).toHaveProperty("registered_at")
      expect(decoded).toHaveProperty("updated_at")
      expect(decoded).toHaveProperty("iat")
      expect(decoded).toHaveProperty("exp")
      expect(decoded).not.toHaveProperty("password")
      expect(decoded.blocked).toBe(false)
      expect(decoded.email_confirmed).toBe(true)
    })
    test("Given Valid phone number Identifier and password Should Return Valid access token", async () => {
      const { accessToken, } = await signInUseCase.execute({
        identifier: "09301112524",
        password: "hellothisisthepassword"
      })
      const decoded: JwtPayload = verify(accessToken, process.env.JWT_SECRET || "verySecretKey") as JwtPayload
      expect(decoded).toHaveProperty("id")
      expect(decoded.first_name).toBe("Amin")
      expect(decoded.last_name).toBe("Foroutan")
      expect(decoded.email).toBe("aminforoutan7@gmail.com")
      expect(decoded.phone_number).toBe("09301112524")
      expect(decoded).toHaveProperty("registered_at")
      expect(decoded).toHaveProperty("updated_at")
      expect(decoded).toHaveProperty("iat")
      expect(decoded).toHaveProperty("exp")
      expect(decoded).not.toHaveProperty("password")
      expect(decoded.blocked).toBe(false)
      expect(decoded.email_confirmed).toBe(true)
    })
    test("Given Valid phone number Identifier and password Should Return Valid refresh token", async () => {
      const { refreshToken, } = await signInUseCase.execute({
        identifier: "09301112524",
        password: "hellothisisthepassword"
      })
      const decoded: JwtPayload = verify(refreshToken, process.env.JWT_SECRET || "verySecretKey") as JwtPayload
      expect(decoded).toHaveProperty("id")
      expect(decoded.first_name).toBe("Amin")
      expect(decoded.last_name).toBe("Foroutan")
      expect(decoded.email).toBe("aminforoutan7@gmail.com")
      expect(decoded.phone_number).toBe("09301112524")
      expect(decoded).toHaveProperty("registered_at")
      expect(decoded).toHaveProperty("updated_at")
      expect(decoded).toHaveProperty("iat")
      expect(decoded).toHaveProperty("exp")
      expect(decoded).not.toHaveProperty("password")
      expect(decoded.blocked).toBe(false)
      expect(decoded.email_confirmed).toBe(true)
    })
    test("Given InValid email identifier Throw HTTPError with status 403", async () => {
      try {
        const jwtStr = await signInUseCase.execute({
          identifier: "aminforoutan12@gmail.com",
          password: "hellothisisthepassword"
        })
        throw new Error("Did not throw right error")
      } catch (e) {
        assertHttpError(e, 403)
      }
    })
    test("Given InValid phoneNumber identifier Throw HTTPError with status 403", async () => {
      try {
        await signInUseCase.execute({
          identifier: "09301112520",
          password: "hellothisisthepassword"
        })
        throw new Error("Did not throw right error")
      } catch (e) {
        assertHttpError(e, 403)
      }
    })
    test("Given valid identifier and wrong password Throw HTTPError with status 403", async () => {
      try {
        await signInUseCase.execute({
          identifier: "09301112524",
          password: "hellothisisthepassword1"
        })
        throw new Error("Did not throw right error")
      } catch (e) {
        assertHttpError(e, 403)
      }
    })
    test("Given identifier without email_confirmed should thro HTTPError with status 403", async () => {
      try {
        await signInUseCase.execute({
          identifier: "09301112525",
          password: "hellothisisthepassword"
        })
        throw new Error("Did not throw right error")
      } catch (e) {
        assertHttpError(e, 403)
      }
    })
  })
})