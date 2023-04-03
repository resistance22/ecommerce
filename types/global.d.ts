import { RequestHandler } from "express"

export { }

declare global {
  type Method = "PUT" | "GET" | "POST" | "DELETE"
  interface IRoute {
    method: Method
    controller: RequestHandler
    endpoint: string
    middlewares?: Array<RequestHandler>
  }

  type ValidationsResult = { validated: false, messages: [string] } | { validated: true, messages: null }

  interface IValidator {
    validate: (entity: Object) => ValidationsResult
  }

}