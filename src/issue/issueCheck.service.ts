import { inject, injectable } from 'inversify';
import { CommonService } from '../common/common.service';
import { IssueCheckRepository } from './issueCheck.repository';
import { RequestCreateIssueCheck, RequestRetrieveIssueCheck, RequestUpdateIssueCheckName, RequestUpdateIssueCheckCompleteYn, RequestDeleteIssueCheck } from './issueCheck.model';
import { DBConnectionFactory } from '../utils/dbConnectionFactory.util';
import { PoolConnection } from 'mysql2/promise';

@injectable()
export class IssueCheckService {
  constructor(
    @inject('mysqlPool') protected mysqlPool: DBConnectionFactory,
    @inject('CommonService') protected commonService: CommonService,
    @inject('IssueCheckRepository') private repository: IssueCheckRepository,
  ) {}

  async insertIssueCheck<T>(request: RequestCreateIssueCheck): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.insertIssueCheck(request, connection);
    });
  }

  async retrieveIssueCheck<T>(request: RequestRetrieveIssueCheck): Promise<T[]> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.retrieveIssueCheck(request, connection);
    });
  }

  async updateIssueCheckName<T>(request: RequestUpdateIssueCheckName): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.updateIssueCheckName(request, connection);
    });
  }

  async updateIssueCheckCompleteYn<T>(request: RequestUpdateIssueCheckCompleteYn): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.updateIssueCheckCompleteYn(request, connection);
    });
  }

  async deleteIssueCheck<T>(request: RequestDeleteIssueCheck): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.deleteIssueCheck(request, connection);
    });
  }
}
