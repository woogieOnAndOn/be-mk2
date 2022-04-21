import * as express from "express";
import { interfaces, controller, httpGet, httpPost, httpDelete, request, queryParam, response, requestParam, httpPut } from "inversify-express-utils";
import { inject } from "inversify";
import { TreeService } from "./tree.service";
import { MethodType, ControllerType, TransactionResult } from '../common/common.model';
import * as Tree from './tree.model';
import { CommonController } from "../common/common.controller";
import * as userSession from '../userSession/userSession.model';

@controller("")
export class TreeController implements interfaces.Controller {

  constructor( 
    @inject('TreeService') private treeService: TreeService,
    @inject('CommonController') private commonController: CommonController,
  ) {}

  @httpGet("/")
  private index(request: express.Request, res: express.Response, next: express.NextFunction): string {
      return "success!";
  }

  @httpPost("/tree")
  async insertTree(@request() request: express.Request, @response() res: express.Response) {
    const userSession: userSession.getResponse = await this.commonController.getUserSession({ sessionId: request.cookies['JSESSIONID'] });
    if (!userSession) return { msId: 0, msContent: 'Invalid Session, 다시 로그인 하십시오.' };

    const insertRequest: Tree.CreateReq = request.body;
    insertRequest.user = userSession.userName;
    console.log('insert tree=========================================');
    const result: TransactionResult = await this.treeService.insertTree(insertRequest);
    const insertedTree: Tree.RetrieveRes = await this.treeService.getTree({ id: result.insertId, user: userSession.userName });
    console.log(insertedTree);
    
    return this.commonController.createReturnMessage(ControllerType.TREE, result, insertedTree, MethodType.CREATE);
  }
    
  @httpGet("/tree")
  async retrieveTree(@request() request: express.Request, @response() res: express.Response) {
    const userSession: userSession.getResponse = await this.commonController.getUserSession({ sessionId: request.cookies['JSESSIONID'] });
    if (!userSession) return { msId: 0, msContent: 'Invalid Session, 다시 로그인 하십시오.' };

    const searchRequest: Tree.RetrieveReq = {
      parent: request.query.parent ? Number(request.query.parent) : 0,
      secret: request.query.secret ? Number(request.query.secret) : 0,
      user: userSession.userName,
    };
    console.log('retrieve tree=========================================');
    console.log(searchRequest);
    const result = await this.treeService.retrieveTree(searchRequest);

    return this.commonController.createReturnMessage(ControllerType.TREE, result, null, MethodType.READ);
  }

  @httpPut("/tree/:id")
  async updateTree(@request() request: express.Request, @response() res: express.Response) {
    const userSession: userSession.getResponse = await this.commonController.getUserSession({ sessionId: request.cookies['JSESSIONID'] });
    if (!userSession) return { msId: 0, msContent: 'Invalid Session, 다시 로그인 하십시오.' };

    const updateRequest: Tree.UpdateReq = request.body;
    updateRequest.id = Number(request.params.id);
    console.log('update tree=========================================');
    const result: TransactionResult = await this.treeService.updateTree(updateRequest);
    const updatedTree: Tree.RetrieveRes = await this.treeService.getTree({ id: updateRequest.id, user: userSession.userName });
    console.log(updatedTree);
    
    return this.commonController.createReturnMessage(ControllerType.TREE, result, updatedTree, MethodType.UPDATE);
  }

  @httpDelete("/tree/:id")
  async deleteTree(@request() request: express.Request, @response() res: express.Response) {
    const userSession: userSession.getResponse = await this.commonController.getUserSession({ sessionId: request.cookies['JSESSIONID'] });
    if (!userSession) return { msId: 0, msContent: 'Invalid Session, 다시 로그인 하십시오.' };

    const deleteRequest: Tree.DeleteReq = request.body;
    deleteRequest.id = Number(request.params.id);
    console.log('delete tree=========================================');
    console.log(deleteRequest);
    const result: TransactionResult = await this.treeService.deleteTree(deleteRequest);
    
    return this.commonController.createReturnMessage(ControllerType.TREE, result, deleteRequest, MethodType.DELETE);
  }

  @httpPut("/tree/:id/seq")
  async updateSeqTree(@request() request: express.Request, @response() res: express.Response) {
    const userSession: userSession.getResponse = await this.commonController.getUserSession({ sessionId: request.cookies['JSESSIONID'] });
    if (!userSession) return { msId: 0, msContent: 'Invalid Session, 다시 로그인 하십시오.' };
    
    const updateSeqRequest: Tree.UpdateSeqReq = request.body;
    updateSeqRequest.id = Number(request.params.id);
    console.log('update seq tree=========================================');
    console.log(updateSeqRequest);
    const result: TransactionResult = await this.treeService.updateSeqTree(updateSeqRequest);
    
    return this.commonController.createReturnMessage(ControllerType.TREE, result, updateSeqRequest, MethodType.EXTRA);
  }
}