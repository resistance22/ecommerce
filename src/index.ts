require("module-alias/register")
import express from "express"
import { ErrorHandlerMiddleWare } from '@middlewares/ErrorHandler'
import { setupAllRoutes } from './infra/routes/index'
import { GlobalRouter } from './infra/routes/globalRouter'
import dotenv from "dotenv"

async function main() {
  dotenv.config()
  const port = process.env.PORT
  const app = express()
  await setupAllRoutes()
  app.use(express.static("public"))
  app.use(express.json())
  app.use(GlobalRouter.apiRouter)
  app.use(ErrorHandlerMiddleWare)



  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
  })
}



main()
