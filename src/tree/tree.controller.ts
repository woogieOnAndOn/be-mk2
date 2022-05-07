import * as express from "express";
import { interfaces, controller, httpGet, httpPost, httpDelete, request, queryParam, response, requestParam, httpPut } from "inversify-express-utils";
import { inject } from "inversify";
import { TreeService } from "./tree.service";
import { MethodType, ControllerType, TransactionResult } from '../common/common.model';
import * as Tree from './tree.model';
import { CommonController } from "../common/common.controller";
import * as userSession from '../userSession/userSession.model';
import { UserSessionService } from "../userSession/userSession.service";

@controller("")
export class TreeController extends CommonController implements interfaces.Controller {

  constructor( 
    @inject('TreeService') private treeService: TreeService,
    @inject('UserSessionService') userSessionService: UserSessionService
  ) {
    super(userSessionService);
  }

  @httpGet("/")
  private index(request: express.Request, res: express.Response, next: express.NextFunction): string {
    return "success!";
  }

  @httpPost("/tree")
  async insertTree(@request() request: express.Request, @response() res: express.Response) {
    return await this.errorHandlingExecutor(request, ControllerType.TREE, MethodType.CREATE, async (requestUser: userSession.getRes) => {
      const insertRequest: Tree.CreateReq = request.body;
      insertRequest.user = requestUser.userName;
      console.log('insert tree=========================================');
      const result: TransactionResult = await this.treeService.insertTree(insertRequest);
      const insertedTree: Tree.RetrieveRes = await this.treeService.getTree({ id: result.insertId, user: requestUser.userName });
      console.log(insertedTree);
      return insertedTree;
    });
  }
    
  @httpGet("/tree")
  async retrieveTree(@request() request: express.Request, @response() res: express.Response) {
    return await this.errorHandlingExecutor(request, ControllerType.TREE, MethodType.READ, async (requestUser: userSession.getRes) => {
      const searchRequest: Tree.RetrieveReq = {
        parent: request.query.parent ? Number(request.query.parent) : 0,
        user: requestUser.userName,
      };
      console.log('retrieve tree=========================================');
      console.log(searchRequest);
      return await this.treeService.retrieveTree(searchRequest);
    });
  }

  @httpPut("/tree/:id")
  async updateTree(@request() request: express.Request, @response() res: express.Response) {
    return await this.errorHandlingExecutor(request, ControllerType.TREE, MethodType.UPDATE, async (requestUser: userSession.getRes) => {
      const updateRequest: Tree.UpdateReq = request.body;
      updateRequest.id = Number(request.params.id);
      console.log('update tree=========================================');
      const result: TransactionResult = await this.treeService.updateTree(updateRequest);
      if (result.affectedRows !== 1) {
        throw new Error(JSON.stringify(result));
      }

      const updatedTree: Tree.RetrieveRes = await this.treeService.getTree({ id: updateRequest.id, user: requestUser.userName });
      console.log(updatedTree);
      return updatedTree;
    });
  }

  @httpDelete("/tree/:id")
  async deleteTree(@request() request: express.Request, @response() res: express.Response) {
    return await this.errorHandlingExecutor(request, ControllerType.TREE, MethodType.DELETE, async (requestUser: userSession.getRes) => {
      const deleteRequest: Tree.DeleteReq = request.body;
      deleteRequest.id = Number(request.params.id);
      console.log('delete tree=========================================');
      console.log(deleteRequest);
      return await this.treeService.deleteTree(deleteRequest);
    });
  }

  @httpPut("/tree/:id/seq")
  async updateSeqTree(@request() request: express.Request, @response() res: express.Response) {
    return await this.errorHandlingExecutor(request, ControllerType.TREE, MethodType.UPDATE, async (requestUser: userSession.getRes) => {
      const updateSeqRequest: Tree.UpdateSeqReq = request.body;
      updateSeqRequest.id = Number(request.params.id);
      console.log('update seq tree=========================================');
      console.log(updateSeqRequest);
      const result: TransactionResult = await this.treeService.updateSeqTree(updateSeqRequest);
      if (result.affectedRows !== 1) {
        throw new Error(JSON.stringify(result));
      }

      const updatedTree: Tree.RetrieveRes = await this.treeService.getTree({ id: updateSeqRequest.id, user: requestUser.userName });
      console.log(updatedTree);
      return updatedTree;
    });
  }

  @httpPut("/tree/:id/children")
  async updateLocationTree(@request() request: express.Request, @response() res: express.Response) {
    return await this.errorHandlingExecutor(request, ControllerType.TREE, MethodType.UPDATE, async (requestUser: userSession.getRes) => {
      const updateRequest: Tree.UpdateLocationReq = request.body;
      updateRequest.parent = Number(request.params.id);
      console.log('update location tree=========================================');
      const result: TransactionResult = await this.treeService.updateLocationTree(updateRequest);
      return result;
    }, '이동');
  }
}