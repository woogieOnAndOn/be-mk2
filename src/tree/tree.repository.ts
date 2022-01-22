import { inject, injectable } from 'inversify';
import { CommonRepository } from '../common/common.repository';
import { RequestCreateTree, RequestUpdateSeqTree, RequestUpdateTree, Tree, TreeSearchCondition } from './tree.model';
import { QueryInfo } from '../common/common.model';
import { TreeQuery, TreeQueryId } from './tree.query';
import mysql from 'mysql2';

@injectable()
export class TreeRepository extends CommonRepository {
  constructor(
    @inject('mysqlPool') mysqlPool: any
  ) {
    super(mysqlPool);
    this.init();
  }

  async insertTree<T>(request: RequestCreateTree, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = TreeQuery(TreeQueryId.insertTree, request);
    return await this.insertByObj<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async retrieveTree<T>(request: TreeSearchCondition, connection?: any): Promise<T[]> {
    const queryInfo: QueryInfo = TreeQuery(TreeQueryId.retrieveTree, request);
    return await this.query<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async updateTree<T>(request: RequestUpdateTree, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = TreeQuery(TreeQueryId.updateTree, request);
    return await this.execute<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async retrieveDeleteTarget<T>(request: number, connection?: any): Promise<T[]> {
    const queryInfo: QueryInfo = TreeQuery(TreeQueryId.retrieveDeleteTarget, request);
    return await this.query<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async deleteTree<T>(request: string, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = TreeQuery(TreeQueryId.deleteTree, request);
    return await this.execute<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async updateSeqSurroundingTree<T>(request: RequestUpdateSeqTree, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = TreeQuery(TreeQueryId.updateSeqSurroundingTree, request);
    return await this.execute<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async updateSeqTargetTree<T>(request: RequestUpdateSeqTree, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = TreeQuery(TreeQueryId.updateSeqTargetTree, request);
    return await this.execute<T>(queryInfo.query, queryInfo.queryParams, connection);
  }
}