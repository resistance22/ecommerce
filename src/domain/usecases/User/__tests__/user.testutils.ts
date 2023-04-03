import { User } from "@entities/User.entity";
import { JwtPayload } from "jsonwebtoken";

export const assertUser = (expected: User, check: User) => {
  expect(expected).toHaveProperty("id")
  expect(expected).toHaveProperty("email_confirmed")
  expect(expected).toHaveProperty("blocked")
  expect(expected).toHaveProperty("registered_at")
  expect(expected).toHaveProperty("updated_at")
  expect(expected.email).toBe(check.email)
  expect(expected.phone_number).toBe(check.phone_number)
  expect(expected.first_name).toBe(check.first_name)
  expect(expected.last_name).toBe(check.last_name)
  expect(expected.password).not.toBe(check.password)
}
