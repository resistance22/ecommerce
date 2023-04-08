import { GlobalRouter } from './globalRouter'
import { UserRegisterUseCase } from '@usecases/User/register.usecase'
import { makeRegisterController } from "../controllers/User/register.controller"
import { TypeORMUserRepo } from "@repos/TypeORMUserRepo"
import { getDataSource } from '@infra/DB'
import { UserEmailServices } from '@infra/services/UserEmailServices'
import { UserUtils } from '@infra/utils/userUtils'
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
    const userEmailServices = new UserEmailServices()
    const userUtils = new UserUtils()
    const userRegisterUseCase = new UserRegisterUseCase(this.repo, userUtils, userEmailServices)
    const registerRoute = makeRegisterController(userRegisterUseCase)
    this.globalRouer.addApi(registerRoute)
  }
}



export const setupAllRoutes = async () => {
  const userRoutes = new UserRoutes()
  await userRoutes.init()
  userRoutes.setupRoutes()
}

