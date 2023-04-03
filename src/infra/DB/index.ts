import { DataSource } from "typeorm"
import { User } from '@DB/entities/User.entity'
import { Store } from '@DB/entities/Store.entity'
import { Admin } from "@DB/entities/Admin.entity"
import { Address } from "@DB/entities/Address.entity"

const generateDataSource = () => {
	const entities = [User, Store, Admin, Address]
	if (process.env.NODE_ENV == 'test') {
		return new DataSource({
			type: "sqlite",
			database: process.env.TEST_DATABASE_URL || ".temp/test.db",
			entities: entities,
			synchronize: true
		})
	}

	/* istanbul ignore next */
	return new DataSource({
		type: "sqlite",
		database: process.env.DATABASE_URL || ".temp/dev.db",
		entities: entities,
		synchronize: true
	})
}

export class DB {
	static dataSource: DataSource = generateDataSource()
	static isInitialized() {
		return DB.dataSource.isInitialized
	}
	static async initialize() {
		try {
			return await DB.dataSource.initialize()
		} catch (e) {
			console.log(e)
			throw e
		}
	}
	private constructor() { }
}


export const getDataSource = async () => {
	if (DB.isInitialized()) {
		return DB.dataSource
	} else {
		return await DB.initialize()
	}
}