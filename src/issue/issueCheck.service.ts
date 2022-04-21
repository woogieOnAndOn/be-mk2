import { inject, injectable } from 'inversify';
import { CommonService } from '../common/common.service';
import { IssueCheckRepository } from './issueCheck.repository';
import * as IssueCheck from './issueCheck.model';
import { DBConnectionFactory } from '../utils/dbConnectionFactory.util';
import { PoolConnection } from 'mysql2/promise';
import { TransactionResult } from '../common/common.model';

@injectable()
export class IssueCheckService {
  constructor(
    @inject('mysqlPool') protected mysqlPool: DBConnectionFactory,
    @inject('CommonService') protected commonService: CommonService,
    @inject('IssueCheckRepository') private repository: IssueCheckRepository,
  ) {}

  async insertIssueCheck<T>(request: IssueCheck.CreateReq[], existingConnection?: PoolConnection): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      const insertIssueCheckResult: TransactionResult = await this.repository.insertIssueCheck(request, connection);
      if (insertIssueCheckResult.affectedRows !== request.length) {
        throw new Error;
      }
      return insertIssueCheckResult;
    }, existingConnection);
  }

  async retrieveIssueCheck<T>(request: IssueCheck.RetrieveReq): Promise<T[]> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.retrieveIssueCheck(request, connection);
    });
  }

  async updateIssueCheck<T>(request: IssueCheck.UpdateReq[], existingConnection?: PoolConnection): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      const updateIssueCheckResult: TransactionResult[] = await this.repository.updateIssueCheck(request, connection);
      updateIssueCheckResult.forEach((result: TransactionResult, index: number) => {
        if (result.affectedRows !== 1) {
          throw new Error;
        }
      });
      return updateIssueCheckResult;
    }, existingConnection);
  }

  async updateIssueCheckCompleteYn<T>(request: IssueCheck.UpdateCompleteYnReq): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.updateIssueCheckCompleteYn(request, connection);
    });
  }

  async deleteIssueCheck<T>(request: IssueCheck.DeleteReq[], existingConnection?: PoolConnection): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.deleteIssueCheck(request, connection);
    }, existingConnection);
  }

  async retrieveAllIssueCheck<T>(request: IssueCheck.RetrieveAllReq): Promise<T[]> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.retrieveAllIssueCheck(request, connection);
    });
  }
}
