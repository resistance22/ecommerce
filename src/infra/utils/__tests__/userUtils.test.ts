import { UserUtils } from "../userUtils"
import { hash } from "bcrypt"
import { makeUserfromDTO } from "@entities/User.entity"
import { JwtPayload, verify } from "jsonwebtoken"

let utils: UserUtils
beforeAll(() => {
  utils = new UserUtils()
})

describe("UserUtils", () => {
  describe("UserUtils.checkPassword()", () => {
    test("Given right plain password should return true", async () => {
      const plainPass = "theplainpassword"
      const encrypted = await hash(plainPass, 10)
      const check = await utils.checkPassword(encrypted, plainPass)
      expect(check).toBe(true)
    })
    test("Given wrong plain password should return false", async () => {
      const plainPass = "theplainpassword"
      const encrypted = await hash(plainPass, 10)
      const check = await utils.checkPassword(encrypted, "thewrongplainpass")
      expect(check).toBe(false)
    })
  })
  describe("UserUtils.makeJWT()", () => {
    test("Given right User should return the right jwt", async () => {
      const userObj = makeUserfromDTO({
        id: "therandomid",
        first_name: "First",
        last_name: "Last",
        phone_number: "09301112524",
        email: "a@gg.com",
        email_confirmed: false,
        blocked: false,
        password: "thisisthepassword",
        registered_at: "07/07/2020",
        updated_at: "07/07/2020",
      })
      const jwtSTR = await utils.makeJWT(userObj)
      try {
        const decoded = await verify(jwtSTR, process.env.JWT_SECRET || "verySecretKey") as JwtPayload
        expect(decoded.first_name).toBe("First")
        expect(decoded.last_name).toBe("Last")
        expect(decoded.email).toBe("a@gg.com")
        expect(decoded).toHaveProperty("id")
        expect(decoded.blocked).toBe(false)
        expect(decoded.email_confirmed).toBe(false)
        expect(decoded.phone_number).toBe("09301112524")
        expect(decoded).toHaveProperty("registered_at")
        expect(decoded).toHaveProperty("updated_at")
        expect(decoded).toHaveProperty("iat")
        expect(decoded).toHaveProperty("exp")
        expect(decoded).not.toHaveProperty("password")
      } catch (e) {
        throw e
      }
    })
  })
})