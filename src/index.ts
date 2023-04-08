require("module-alias/register")
import express from "express"
import { ErrorHandlerMiddleWare } from '@middlewares/ErrorHandler'
import { middlewareFactory } from "@middlewares/index"
import { setupAllRoutes } from './infra/routes/index'
import { GlobalRouter } from './infra/routes/globalRouter'
import dotenv from "dotenv"

async function main() {
  dotenv.config()
  const port = process.env.PORT
  const app = express()
  const reqLogger = middlewareFactory({
    type: "ReqLogger"
  })
  await setupAllRoutes()
  app.use(express.static("public"))
  app.use(express.json())
  app.use(reqLogger)
  app.use(GlobalRouter.apiRouter)
  app.use(ErrorHandlerMiddleWare)



  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
  })
}



main()
