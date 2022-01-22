import { inject, injectable } from 'inversify';
import { CommonRepository } from '../common/common.repository';
import { QueryInfo } from '../common/common.model';
import { IssueStateHistoryQuery, IssueStateHistoryQueryId } from './issueStateHistory.query';
import { RequestUpdateIssueState } from './issue.model';
import mysql from 'mysql2';

@injectable()
export class IssueStateHistoryRepository extends CommonRepository {
  constructor(
    @inject('mysqlPool') mysqlPool: any
  ) {
    super(mysqlPool);
    this.init();
  }

  async insertIssueStateHistory<T>(request: RequestUpdateIssueState, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = IssueStateHistoryQuery(IssueStateHistoryQueryId.insertIssueStateHistory, request);
    return await this.insertByObj<T>(queryInfo.query, queryInfo.queryParams, connection);
  }
}