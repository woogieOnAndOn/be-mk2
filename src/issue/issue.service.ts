import { inject, injectable } from 'inversify';
import { CommonService } from '../common/common.service';
import { IssueRepository } from './issue.repository';
import { RequestCreateIssue, RequestUpdateIssueName, RequestUpdateIssueUseTime, RequestUpdateIssueState, RequestDeleteIssue, IssueState } from './issue.model';
import { TransactionResult } from '../common/common.model';
import { DBConnectionFactory } from '../utils/dbConnectionFactory.util';
import { IssueStateHistoryRepository } from './issueStateHistory.repository';
import { RequestCreateIssueStateHistory } from './issueStateHistory.model';
import { PoolConnection } from 'mysql2/promise';

@injectable()
export class IssueService {
  constructor(
    @inject('mysqlPool') protected mysqlPool: DBConnectionFactory,
    @inject('CommonService') protected commonService: CommonService,
    @inject('IssueRepository') private repository: IssueRepository,
    @inject('IssueStateHistoryRepository') private issueStateHistoryRepository: IssueStateHistoryRepository,
  ) {}

  async insertIssue<T>(request: RequestCreateIssue): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.insertIssue(request, connection);
    });
  }

  async retrieveIssue<T>(): Promise<T[]> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.retrieveIssue(connection);
    });
  }

  async updateIssueName<T>(request: RequestUpdateIssueName): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.updateIssueName(request, connection);
    });
  }

  async updateUseTime<T>(request: RequestUpdateIssueUseTime): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.updateUseTime(request, connection);
    });
  }

  async updateState<T>(request: RequestUpdateIssueState): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      let result;
      
      const stateResult: TransactionResult = await this.repository.updateState(request, connection);
      if (stateResult.affectedRows !== 1) throw new Error;

      const historyResult: TransactionResult = await this.issueStateHistoryRepository.insertIssueStateHistory(request, connection);
      if (historyResult.affectedRows !== 1) throw new Error;
      
      result = historyResult;
      return result;
    });
  }

  async deleteIssue<T>(request: RequestDeleteIssue): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.deleteIssue(request, connection);
    });
  }

}
