import { middlewareFactory } from "@middlewares/index"
import { NewUserValidator } from "@validators/User.validator"
import { RequestHandler } from "express"

export const makeRegisterController: UserNS.Controllers.register = (registerUseCase) => {
  const validator = middlewareFactory({
    type: "BodyValidator",
    dto: NewUserValidator
  })

  const controller: RequestHandler = async (req, res, next) => {
    const { body } = req
    try {
      const registeredUser = await registerUseCase.execute(body)
      const { password, ...rest } = registeredUser
      return res.json(rest)
    } catch (e) {
      return next(e)
    }
  }

  return {
    method: "POST",
    middlewares: [validator],
    endpoint: "/api/v1/register",
    controller: controller
  }
}