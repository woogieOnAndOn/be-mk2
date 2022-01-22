import { inject, injectable } from 'inversify';
import { CommonRepository } from '../common/common.repository';
import { QueryInfo } from '../common/common.model';
import { IssueCheckQuery, IssueCheckQueryId } from './issueCheck.query';
import { RequestCreateIssueCheck, RequestRetrieveIssueCheck, RequestUpdateIssueCheckName, RequestUpdateIssueCheckCompleteYn, RequestDeleteIssueCheck } from './issueCheck.model';
import mysql from 'mysql2';

@injectable()
export class IssueCheckRepository extends CommonRepository {
  constructor(
    @inject('mysqlPool') mysqlPool: any
  ) {
    super(mysqlPool);
    this.init();
  }

  async insertIssueCheck<T>(request: RequestCreateIssueCheck, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = IssueCheckQuery(IssueCheckQueryId.insertIssueCheck, request);
    return await this.insertByObj<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async retrieveIssueCheck<T>(request: RequestRetrieveIssueCheck, connection?: any): Promise<T[]> {
    const queryInfo: QueryInfo = IssueCheckQuery(IssueCheckQueryId.retrieveIssueCheck, request);
    return await this.query<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async updateIssueCheckName<T>(request: RequestUpdateIssueCheckName, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = IssueCheckQuery(IssueCheckQueryId.updateIssueCheckName, request);
    return await this.execute<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async updateIssueCheckCompleteYn<T>(request: RequestUpdateIssueCheckCompleteYn, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = IssueCheckQuery(IssueCheckQueryId.updateIssueCheckCompleteYn, request);
    return await this.execute<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async deleteIssueCheck<T>(request: RequestDeleteIssueCheck, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = IssueCheckQuery(IssueCheckQueryId.deleteIssueCheck, request);
    return await this.execute<T>(queryInfo.query, queryInfo.queryParams, connection);
  }
}