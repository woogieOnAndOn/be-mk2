import { inject, injectable } from 'inversify';
import { CommonService } from '../common/common.service';
import { PoolConnection } from 'mysql2/promise';
import { TreeRepository } from './tree.repository';
import { RequestCreateTree, RequestDeleteTree, RequestGetTree, RequestUpdateSeqTree, RequestUpdateTree, Tree, TreeSearchCondition } from './tree.model';
import { DBConnectionFactory } from '../utils/dbConnectionFactory.util';
import { TransactionResult } from '../common/common.model';

@injectable()
export class TreeService {
  constructor(
    @inject('mysqlPool') protected mysqlPool: DBConnectionFactory,
    @inject('CommonService') protected commonService: CommonService,
    @inject('TreeRepository') private repository: TreeRepository
  ) {}

  async insertTree<T>(request: RequestCreateTree): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
        return await this.repository.insertTree(request, connection)
    })
  }

  
  async retrieveTree<T>(request: TreeSearchCondition): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.retrieveTree(request, connection);
    })
  }

  async updateTree<T>(request: RequestUpdateTree): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.updateTree(request, connection);
    })
  }

  async deleteTree<T>(request: RequestDeleteTree): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      const deleteTargetMinus = [];
      const deleteTargetPlus = [];

      deleteTargetMinus.push(request.id);
      deleteTargetPlus.push(request.id);

      let requestDeleteTarget: number = 0;

      while (deleteTargetMinus.length > 0) {
        requestDeleteTarget = Number(deleteTargetMinus.pop());
        let targetChildren: Tree[] = await this.repository.retrieveDeleteTarget(requestDeleteTarget, connection);
        for (let child of targetChildren) {
          deleteTargetMinus.push(child.id);
          deleteTargetPlus.push(child.id);
        }
      }
      console.log(deleteTargetPlus);

      const finalRequest =  deleteTargetPlus.toString();
      return await this.repository.deleteTree(finalRequest);
    });
  }

  async updateSeqTree<T>(request: RequestUpdateSeqTree): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      const result: TransactionResult = await this.repository.updateSeqSurroundingTree(request, connection);
      if (result.affectedRows === 1) {
        return await this.repository.updateSeqTargetTree(request, connection);
      } else {
        throw new Error;
      }
    })
  }

  async getTree<T>(request: RequestGetTree): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.getTree(request, connection);
    })
  }
}
