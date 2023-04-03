/* istanbul ignore file */

import { BaseEntity, DeepPartial, Repository, } from "typeorm"
import { HTTPError } from "../assets/HTTPError"
import { User } from "@DB/entities/User.entity";

export const truncateTable = <T extends BaseEntity>(repo: Repository<T>) => {
  return repo.delete({})
}

export const seedTable = async <T extends BaseEntity>(repo: Repository<T>, entries: DeepPartial<T>[]) => {
  try {
    await repo.save(entries)
  } catch (e) {
    throw e
  }
}

export const assertHttpError = (err: unknown | any, status: number | undefined = undefined) => {
  expect(err).toBeInstanceOf(HTTPError)
  expect(err).toHaveProperty('status')
  expect(err).toHaveProperty('messages')
  if (!(err instanceof HTTPError)) {
    throw err
  }
  if (status) {
    expect(err.status).toBe(status)
  }
}



export const assertUser = (source: DeepPartial<User>, check: DeepPartial<User>) => {
  expect(source.email).toBe(check.email)
  expect(source.first_name).toBe(check.first_name)
  expect(source.last_name).toBe(check.last_name)
  expect(source).not.toHaveProperty("password")
  expect(source.phone_number).toBe(check.phone_number)
  expect(source.email_confirmed).toBe(false)
}