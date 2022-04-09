import mysql, {Pool, PoolConnection} from 'mysql2/promise';
import { inject, injectable } from 'inversify';
import 'dotenv/config'

@injectable()
export class DBConnectionFactory {

	private static pool: Pool;
	private static instance: PoolConnection;

	public async getConnection(): Promise<PoolConnection> {
		const options = {
			host: process.env.DB_HOST,
			port: 3306,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DATABASE,
			waitForConnections: true,
			connectionLimit: 5,
			multipleStatements: true,
		};
		
		try {
			if (!DBConnectionFactory.pool) {
        DBConnectionFactory.pool = await mysql.createPool(options);
      }

			if (!DBConnectionFactory.instance) {
        DBConnectionFactory.instance = await DBConnectionFactory.pool.getConnection();
      }

			if (!DBConnectionFactory.instance.ping()) {
        DBConnectionFactory.instance = await DBConnectionFactory.pool.getConnection();
      }
		} catch(error) {
			throw error;
		}
		return DBConnectionFactory.instance;
	}
}