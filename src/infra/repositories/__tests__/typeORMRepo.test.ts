import { getDataSource } from "@infra/DB"
import { TypeORMUserRepo } from "@infra/repositories/TypeORMUserRepo"
import { User as UserENT } from "@DB/entities/User.entity"
import { DataSource } from "typeorm"
import { assertHttpError } from "test/global.testutils"

let repo: TypeORMUserRepo
let ds: DataSource
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
  ds = await getDataSource()
  repo = new TypeORMUserRepo(ds)
})

beforeEach(async () => {
  await repo.hydrate(sampleData)
})

afterEach(async () => {
  await repo.truncate()
})

describe("TypeORMRepo", () => {
  describe("TypeORMRepo.fetchUserByEmail()", () => {
    test("Given a valid email should return the right user", async () => {
      const foundUser = await repo.fetchUserByEmail("aminforoutan7@gmail.com")
      expect(foundUser).not.toBe(null)
      if (foundUser) {
        expect(foundUser).toHaveProperty("id")
        expect(foundUser).toHaveProperty("registered_at")
        expect(foundUser).toHaveProperty("updated_at")
        expect(foundUser).toHaveProperty("password")
        expect(foundUser.password).not.toBe("hellothisisthepassword")
        expect(foundUser.first_name).toBe("Amin")
        expect(foundUser.last_name).toBe("Foroutan")
        expect(foundUser.email).toBe("aminforoutan7@gmail.com")
        expect(foundUser.email_confirmed).toBe(false)
        expect(foundUser.blocked).toBe(false)
        expect(foundUser.phone_number).toBe("09301112524")
      }
    })
    test("Given an invalid email should return null", async () => {
      const foundUser = await repo.fetchUserByEmail("aminforoutan222@gmail.com")
      expect(foundUser).toBe(null)
    })
  })
  describe("TypeORMRepo.fetchUserByPhoneNumber()", () => {
    test("Given a valid phone number should return the right user", async () => {
      const foundUser = await repo.fetchUserByPhoneNumber("09301112524")
      expect(foundUser).not.toBe(null)
      if (foundUser) {
        expect(foundUser).toHaveProperty("id")
        expect(foundUser).toHaveProperty("registered_at")
        expect(foundUser).toHaveProperty("updated_at")
        expect(foundUser).toHaveProperty("password")
        expect(foundUser.password).not.toBe("hellothisisthepassword")
        expect(foundUser.first_name).toBe("Amin")
        expect(foundUser.last_name).toBe("Foroutan")
        expect(foundUser.email).toBe("aminforoutan7@gmail.com")
        expect(foundUser.email_confirmed).toBe(false)
        expect(foundUser.blocked).toBe(false)
        expect(foundUser.phone_number).toBe("09301112524")
      }
    })
    test("Given an invalid phone number should return null", async () => {
      const foundUser = await repo.fetchUserByPhoneNumber("09301112520")
      expect(foundUser).toBe(null)
    })
  })
  describe("TypeORMRepo.fetchUserByID()", () => {
    test("Given valid ID should return valid user", async () => {
      const userToCreate = ds.getRepository(UserENT).create({
        first_name: "First",
        last_name: "Last",
        phone_number: "09301112590",
        email: "aa@gg.com",
        password: "helloworld"
      })
      const insertedUser = await userToCreate.save()
      const foundUser = await repo.fetchUserByID(insertedUser.id)
      expect(foundUser).not.toBe(null)
      if (foundUser) {
        expect(foundUser).toHaveProperty("id")
        expect(foundUser).toHaveProperty("registered_at")
        expect(foundUser).toHaveProperty("updated_at")
        expect(foundUser).toHaveProperty("password")
        expect(foundUser.password).toBe(userToCreate.password)
        expect(foundUser.first_name).toBe(userToCreate.first_name)
        expect(foundUser.last_name).toBe(userToCreate.last_name)
        expect(foundUser.email).toBe(userToCreate.email)
        expect(foundUser.phone_number).toBe(userToCreate.phone_number)
        expect(foundUser.email_confirmed).toBe(false)
        expect(foundUser.blocked).toBe(false)
      }
    })
    test("Given invalid ID should return null", async () => {
      const foundUser = await repo.fetchUserByID("jfkldsjkldf")
      expect(foundUser).toBe(null)
    })
  })
  describe("TypeORMRepo.inertNewUser()", () => {
    test("Given valid user should insert it into database", async () => {
      const userToInsert = {
        first_name: "First",
        last_name: "Last",
        phone_number: "09301112590",
        email: "aa@gg.com",
        password: "helloworld"
      }
      const insertedUser = await repo.insertNewUser(userToInsert)
      const foundUser = await ds.getRepository(UserENT).findOne({
        where: {
          id: insertedUser.id
        }
      })
      expect(foundUser).not.toBe(null)
      if (foundUser) {
        expect(foundUser).toHaveProperty("id")
        expect(foundUser).toHaveProperty("registered_at")
        expect(foundUser).toHaveProperty("updated_at")
        expect(foundUser).toHaveProperty("password")
        expect(foundUser.password).not.toBe(userToInsert.password)
        expect(foundUser.first_name).toBe(userToInsert.first_name)
        expect(foundUser.last_name).toBe(userToInsert.last_name)
        expect(foundUser.email).toBe(userToInsert.email)
        expect(foundUser.phone_number).toBe(userToInsert.phone_number)
        expect(foundUser.email_confirmed).toBe(false)
        expect(foundUser.blocked).toBe(false)
      }
    })
    test("Given duplicate email should throw error", async () => {
      const userToInsert = {
        first_name: "First",
        last_name: "Last",
        phone_number: "09301112590",
        email: "aminforoutan7@gmail.com",
        password: "helloworld"
      }
      try {
        await repo.insertNewUser(userToInsert)
      } catch (e) {
        return true
      }
      throw Error("Error not thrown")
    })
    test("Given duplicate phone number should throw error", async () => {
      const userToInsert = {
        first_name: "First",
        last_name: "Last",
        phone_number: "09301112524",
        email: "aa@gg.com",
        password: "helloworld"
      }
      try {
        await repo.insertNewUser(userToInsert)
      } catch (e) {
        return true
      }
      throw Error("Error not thrown")
    })
  })
  describe("TypeORMRepo.checkEmailCode()", () => {
    test("Given None Existance email should return error message", async () => {
      const res = await repo.checkEmailCode("aa@gg.com", "12345")
      expect(res.success).toBe(false)
      expect(res).toHaveProperty("error")
    })
    test("Given wrong code should return error message", async () => {
      await repo.insertEmailConfirmationCode("aa@gg.com", "12345")
      const res = await repo.checkEmailCode("aa@gg.com", "12346")
      expect(res.success).toBe(false)
      expect(res).toHaveProperty("error")
    })

    test("Given right code should return true", async () => {
      await repo.insertEmailConfirmationCode("aa@gg.com", "12345")
      const res = await repo.checkEmailCode("aa@gg.com", "12345")
      expect(res.success).toBe(true)
      expect(res).not.toHaveProperty("error")
    })
  })
  describe("TypeORM.confirmUserEmail()", () => {
    test("Given right email should set email_confirmed to true", async () => {
      const updated_user = await repo.confirmUserEmail("aminforoutan7@gmail.com")
      if (!updated_user) {
        throw Error("No User Returned")
      }
      expect(updated_user).not.toBe(null)
      expect(updated_user.email_confirmed).toBe(true)
    })
    test("Given wrong email should return null", async () => {
      const updated_user = await repo.confirmUserEmail("aminforoutan111@gmail.com")
      expect(updated_user).toBe(null)
    })
  })
})