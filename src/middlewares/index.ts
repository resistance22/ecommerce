import { RequestHandler } from 'express'
import { reqBodyValidator } from './BodyValidator'
import { reqLogger } from './ReqLogger'

interface IBodyValidatorMiddlewareArg {
  type: "BodyValidator",
  dto: IValidator
}

interface IRequestLogger {
  type: "ReqLogger"
}

type middlewareArgs = IBodyValidatorMiddlewareArg | IRequestLogger

export const middlewareFactory: (arg: middlewareArgs) => RequestHandler = (arg) => {
  if (arg.type == 'BodyValidator') return reqBodyValidator(arg.dto)
  if (arg.type == 'ReqLogger') return reqLogger()
  throw new Error("Middleware type is incorrect!")
}