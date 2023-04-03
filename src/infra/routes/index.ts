import { GlobalRouter } from './globalRouter'
import { UserRegisterUseCase } from '@usecases/User/register.usecase'
import { makeRegisterController } from "../controllers/User/register.controller"
import { TypeORMUserRepo } from "@repos/TypeORMUserRepo"
import { getDataSource } from '@infra/DB'
import { DataSource } from 'typeorm'

export class UserRoutes {
  ds: DataSource
  repo: UserNS.IUserRepository
  private readonly globalRouer = GlobalRouter
  private initialized: boolean = false

  isInitialiazed() { return this.initialized }

  async init() {
    this.ds = await getDataSource()
    this.repo = new TypeORMUserRepo(this.ds)
    this.initialized = true
  }

  setupRoutes() {
    if (!this.initialized) {
      throw Error("The DataSrource is not initialized!")
    }
    const userRegisterUseCase = new UserRegisterUseCase(this.repo)
    const registerRoute = makeRegisterController(userRegisterUseCase)
    this.globalRouer.addApi(registerRoute)
  }
}



export const setupAllRoutes = async () => {
  const userRoutes = new UserRoutes()
  await userRoutes.init()
  userRoutes.setupRoutes()
}

