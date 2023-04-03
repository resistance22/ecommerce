import { UserRegisterUseCase } from '@usecases/User/register.usecase'
import { TypeORMUserRepo } from '@repos/TypeORMUserRepo'
import { assertUser } from '@usecases/User/__tests__/user.testutils'
import { assertHttpError } from '../../../../test/global.testutils'
import { getDataSource } from '@DB/index'
import { makeUserfromDTO, User } from '@entities/User.entity'
import { UserUtils } from '@infra/utils/userUtils'
import { UserEmailServices } from '@infra/services/UserEmailServices'

let repo: UserNS.IUserRepository
let registerUseCase: UserNS.UseCases.IUserRegister

const sampleData: UserNS.DTO.NewUser[] = [
  {
    first_name: "Amin",
    last_name: "Foroutan",
    email: "aminforoutan7@gmail.com",
    phone_number: "09301112524",
    password: "hellothisisthepassword"
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

beforeAll(async () => {
  const ds = await getDataSource()
  repo = new TypeORMUserRepo(ds)
  const utils = new UserUtils()
  const services = new UserEmailServices()
  registerUseCase = new UserRegisterUseCase(repo, utils, services)
})

beforeEach(async () => {
  await repo.hydrate(sampleData)
})

afterEach(async () => {
  await repo.truncate()
})

describe("UserRegisterUseCase", () => {
  describe("UserUseCases.execute", () => {
    test("Given Valid User Should insert it into repo", async () => {
      const validUserToInsert = {
        id: "",
        first_name: "Amin",
        last_name: "Foroutan",
        email: "aminforoutan10@gmail.com",
        phone_number: "09301112527",
        password: "hellothisisthepassword",
        email_confirmed: false,
        blocked: false,
        registered_at: "12/05/2018",
        updated_at: "12/05/2018",
      }
      const insertedUser = await registerUseCase.execute(validUserToInsert)
      const exptectedReturnUser = new User(validUserToInsert)
      assertUser(makeUserfromDTO({
        ...insertedUser,
        registered_at: insertedUser.registered_at?.toJSON(),
        updated_at: insertedUser.updated_at?.toJSON()
      }), exptectedReturnUser)
    })
    test("Given Duplicate Email Should throw 409 HTTPError", async () => {
      const duplicateEmail = {
        first_name: "Amin",
        last_name: "Foroutan",
        email: "aminforoutan7@gmail.com",
        phone_number: "09301112527",
        password: "hellothisisthepassword"
      }
      try {
        await registerUseCase.execute(duplicateEmail)
        throw new Error("Error not Thrown")
      } catch (e) {
        assertHttpError(e, 409)
      }
    })
    test("Given Duplicate Phone Number Should throw 409 HTTPError", async () => {
      const duplicatePhoneNumber = {
        first_name: "Amin",
        last_name: "Foroutan",
        email: "aminforoutan10@gmail.com",
        phone_number: "09301112524",
        password: "hellothisisthepassword"
      }
      try {
        await registerUseCase.execute(duplicatePhoneNumber)
        throw new Error("Error not Thrown")
      } catch (e) {
        assertHttpError(e, 409)
      }
    })
  })
})