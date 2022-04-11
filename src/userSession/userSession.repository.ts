import { inject, injectable } from 'inversify';
import { CommonRepository } from '../common/common.repository';
import { QueryInfo } from '../common/common.model';
import { UserSessionQuery, UserSessionQueryId } from './userSession.query';
import { UserSession } from './userSession.model';

@injectable()
export class UserSessionRepository extends CommonRepository {
  constructor(
    @inject('mysqlPool') mysqlPool: any
  ) {
    super(mysqlPool);
    this.init();
  }

  async checkValidSession(request: UserSession, connection?: any): Promise<boolean> {
    const queryInfo: QueryInfo = UserSessionQuery(UserSessionQueryId.checkValidSession, request);
    const rows: Array<{ cnt: string }> = await this.query(queryInfo.query, queryInfo.queryParams, connection);
    return Number(rows[0]['cnt']) > 0 ? true : false;
  }
}