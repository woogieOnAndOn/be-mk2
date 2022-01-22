import { inject, injectable } from 'inversify';
import { CommonRepository } from '../common/common.repository';
import { QueryInfo } from '../common/common.model';
import { IssueQuery, IssueQueryId } from './issue.query';
import { RequestCreateIssue, RequestUpdateIssueName, RequestUpdateIssueUseTime, RequestUpdateIssueState, RequestDeleteIssue } from './issue.model';
import mysql from 'mysql2';

@injectable()
export class IssueRepository extends CommonRepository {
  constructor(
    @inject('mysqlPool') mysqlPool: any
  ) {
    super(mysqlPool);
    this.init();
  }

  async insertIssue<T>(request: RequestCreateIssue, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = IssueQuery(IssueQueryId.insertIssue, request);
    return await this.insertByObj<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async retrieveIssue<T>(connection?: any): Promise<T[]> {
    const queryInfo: QueryInfo = IssueQuery(IssueQueryId.retrieveIssue);
    return await this.query<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async updateIssueName<T>(request: RequestUpdateIssueName, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = IssueQuery(IssueQueryId.updateIssueName, request);
    return await this.execute<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async updateUseTime<T>(request: RequestUpdateIssueUseTime, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = IssueQuery(IssueQueryId.updateUseTime, request);
    return await this.execute<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async updateState<T>(request: RequestUpdateIssueState, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = IssueQuery(IssueQueryId.updateState, request);
    return await this.execute<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async deleteIssue<T>(request: RequestDeleteIssue, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = IssueQuery(IssueQueryId.deleteIssue, request);
    return await this.execute<T>(queryInfo.query, queryInfo.queryParams, connection);
  }
}