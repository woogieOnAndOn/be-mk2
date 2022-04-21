import { inject, injectable } from 'inversify';
import { CommonService } from '../common/common.service';
import { IssueCheckRepository } from './issueCheck.repository';
import * as IssueCheck from './issueCheck.model';
import { DBConnectionFactory } from '../utils/dbConnectionFactory.util';
import { PoolConnection } from 'mysql2/promise';

@injectable()
export class IssueCheckService {
  constructor(
    @inject('mysqlPool') protected mysqlPool: DBConnectionFactory,
    @inject('CommonService') protected commonService: CommonService,
    @inject('IssueCheckRepository') private repository: IssueCheckRepository,
  ) {}

  async insertIssueCheck<T>(request: IssueCheck.CreateReq[]): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.insertIssueCheck(request, connection);
    });
  }

  async retrieveIssueCheck<T>(request: IssueCheck.RetrieveReq): Promise<T[]> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.retrieveIssueCheck(request, connection);
    });
  }

  async updateIssueCheck<T>(request: IssueCheck.UpdateReq[]): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.updateIssueCheck(request, connection);
    });
  }

  async updateIssueCheckCompleteYn<T>(request: IssueCheck.UpdateCompleteYnReq): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.updateIssueCheckCompleteYn(request, connection);
    });
  }

  async deleteIssueCheck<T>(request: IssueCheck.DeleteReq[]): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.deleteIssueCheck(request, connection);
    });
  }

  async retrieveAllIssueCheck<T>(request: IssueCheck.RetrieveAllReq): Promise<T[]> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.retrieveAllIssueCheck(request, connection);
    });
  }
}
