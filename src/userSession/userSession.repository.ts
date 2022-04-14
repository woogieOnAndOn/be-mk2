import { inject, injectable } from 'inversify';
import { CommonRepository } from '../common/common.repository';
import { QueryInfo } from '../common/common.model';
import { UserSessionQuery, UserSessionQueryId } from './userSession.query';
import * as userSession from './userSession.model';

@injectable()
export class UserSessionRepository extends CommonRepository {
  constructor(
    @inject('mysqlPool') mysqlPool: any
  ) {
    super(mysqlPool);
    this.init();
  }

  async getUserSession(request: userSession.getRequest, connection?: any): Promise<userSession.getResponse> {
    const queryInfo: QueryInfo = UserSessionQuery(UserSessionQueryId.getUserSession, request);
    const rows: Array<userSession.getResponse> = await this.query(queryInfo.query, queryInfo.queryParams, connection);
    return rows[0];
  }
}