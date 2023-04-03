import { RequestHandler } from 'express'
import { reqBodyValidator } from './BodyValidator'

interface IBodyValidatorMiddlewareArg {
  type: "BodyValidator",
  dto: IValidator
}

type middlewareArgs = IBodyValidatorMiddlewareArg

export const middlewareFactory: (arg: middlewareArgs) => RequestHandler = (arg) => {
  return reqBodyValidator(arg.dto)
}