import { Router } from 'express'

export class GlobalRouter {
  static apiRouter = Router()
  private constructor() { }

  static addApi(...controller: Array<IRoute>) {
    controller.forEach((cnt) => {
      const middlewares = cnt.middlewares || []
      switch (cnt.method) {
        case 'POST':
          GlobalRouter.apiRouter.post(cnt.endpoint, ...middlewares, cnt.controller)
          break
        case 'PUT':
          GlobalRouter.apiRouter.put(cnt.endpoint, ...middlewares, cnt.controller)
          break
        case 'DELETE':
          GlobalRouter.apiRouter.delete(cnt.endpoint, ...middlewares, cnt.controller)
          break
        case 'GET':
          GlobalRouter.apiRouter.get(cnt.endpoint, ...middlewares, cnt.controller)
          break
        default:
          break
      }
    })
  }
}