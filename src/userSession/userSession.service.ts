import { inject, injectable } from 'inversify';
import { CommonService } from '../common/common.service';
import { PoolConnection } from 'mysql2/promise';
import { UserSessionRepository } from './userSession.repository';
import { DBConnectionFactory } from '../utils/dbConnectionFactory.util';
import { UserSession } from './userSession.model';

@injectable()
export class UserSessionService {
  constructor(
    @inject('mysqlPool') protected mysqlPool: DBConnectionFactory,
    @inject('CommonService') protected commonService: CommonService,
    @inject('UserSessionRepository') private repository: UserSessionRepository
  ) {}
  
  async checkValidSession<T>(request: UserSession): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.checkValidSession(request, connection);
    })
  }
}
