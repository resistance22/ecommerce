import { NextFunction, RequestHandler, Request, Response } from "express"
import { HTTPError } from '../assets/HTTPError'

export const reqBodyValidator = (validator: IValidator) => async (req: Request, _: Response, next: NextFunction) => {
  const { body } = req
  const { validated, messages } = validator.validate(body)
  if (validated) {
    return next()
  } else {
    return next(new HTTPError(422, 'Request Body Validation Failed!', messages))
  }
}