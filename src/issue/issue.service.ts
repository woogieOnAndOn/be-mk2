import { inject, injectable } from 'inversify';
import { CommonService } from '../common/common.service';
import { IssueRepository } from './issue.repository';
import * as Issue from './issue.model';
import { TransactionResult } from '../common/common.model';
import { DBConnectionFactory } from '../utils/dbConnectionFactory.util';
import { IssueStateHistoryRepository } from './issueStateHistory.repository';
import { PoolConnection } from 'mysql2/promise';
import * as IssueCheck from './issueCheck.model';
import { IssueCheckRepository } from './issueCheck.repository';
import { IssueCheckService } from './issueCheck.service';

@injectable()
export class IssueService {
  constructor(
    @inject('mysqlPool') protected mysqlPool: DBConnectionFactory,
    @inject('CommonService') protected commonService: CommonService,
    @inject('IssueRepository') private repository: IssueRepository,
    @inject('IssueStateHistoryRepository') private issueStateHistoryRepository: IssueStateHistoryRepository,
    @inject('IssueCheckService') private issueCheckService: IssueCheckService,
    @inject('IssueCheckRepository') private issueCheckRepository: IssueCheckRepository,
  ) {}

  async insertIssue<T>(request: Issue.CreateReq): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.insertIssue(request, connection);
    });
  }

  async retrieveIssue<T>(request: Issue.RetrieveReq): Promise<T[]> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      const issues: Issue.RetrieveRes[] = await this.repository.retrieveIssue(request, connection);
      const allIssueChecks: IssueCheck.RetrieveRes[] = await this.issueCheckRepository.retrieveAllIssueCheck(request, connection);

      issues.forEach((issue, index) => {
        const issueChecks = allIssueChecks.filter((issueCheck) => {
          return issueCheck.issueId === issue.issueId;
        });
        issue.issueChecks = issueChecks;
      });

      return issues;
    });
  }

  async updateIssue<T>(request: Issue.UpdateReq): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      const updateIssueResult: TransactionResult =  await this.repository.updateIssue(request, connection);
      await this.issueCheckService.insertIssueCheck(request.newIssueChecks);
      await this.issueCheckService.updateIssueCheck(request.editIssueChecks);
      await this.issueCheckService.deleteIssueCheck(request.deleteIssueChecks);
      return updateIssueResult;
    });
  }

  async updateUseTime<T>(request: Issue.UpdateUseTimeReq): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.updateUseTime(request, connection);
    });
  }

  async updateState<T>(request: Issue.UpdateStateReq): Promise<T> {
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

  async deleteIssue<T>(request: Issue.DeleteReq): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.deleteIssue(request, connection);
    });
  }

}
