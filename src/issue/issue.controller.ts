import * as express from "express";
import { interfaces, controller, httpGet, httpPost, httpDelete, request, queryParam, response, requestParam, httpPut } from "inversify-express-utils";
import { inject } from "inversify";
import { IssueService } from "./issue.service";
import { RequestCreateIssue, RequestUpdateIssueName, RequestUpdateIssueUseTime, RequestUpdateIssueState, RequestDeleteIssue, ResponseRetrieveIssue } from './issue.model';
import { ControllerType, MethodType, TransactionResult } from "../common/common.model";
import { CommonController } from "../common/common.controller";
import { RequestCreateIssueStateHistory } from "./issueStateHistory.model";
import * as userSession from '../userSession/userSession.model';

@controller("")
export class IssueController implements interfaces.Controller {

  constructor( 
    @inject('IssueService') private issueService: IssueService,
    @inject('CommonController') private commonController: CommonController,
  ) {}

  @httpPost("/issue")
  async insertIssue(@request() request: express.Request, @response() res: express.Response) {
    const userSession: userSession.getResponse = await this.commonController.getUserSession({ sessionId: request.cookies['JSESSIONID'] });
    if (!userSession) return { msId: 0, msContent: 'Invalid Session, 다시 로그인 하십시오.' };

    const insertRequest: RequestCreateIssue = request.body;
    insertRequest.user = userSession.userName;
    console.log('insert issue=========================================');
    console.log(insertRequest);
    const result: TransactionResult = await this.issueService.insertIssue(insertRequest);
    
    return this.commonController.createReturnMessage(ControllerType.ISSUE, result, insertRequest, MethodType.CREATE);
  }

  @httpGet("/issue")
  async retrieveIssue(@request() request: express.Request, @response() res: express.Response) {
    const userSession: userSession.getResponse = await this.commonController.getUserSession({ sessionId: request.cookies['JSESSIONID'] });
    if (!userSession) return { msId: 0, msContent: 'Invalid Session, 다시 로그인 하십시오.' };

    let result: ResponseRetrieveIssue[];
    console.log('retrieve issue=========================================');
    result = await this.issueService.retrieveIssue({ user: userSession.userName });

    return this.commonController.createReturnMessage(ControllerType.ISSUE, result, null, MethodType.READ);
  }

  @httpPut("/issue/:id")
  async updateIssueName(@request() request: express.Request, @response() res: express.Response) {
    const userSession: userSession.getResponse = await this.commonController.getUserSession({ sessionId: request.cookies['JSESSIONID'] });
    if (!userSession) return { msId: 0, msContent: 'Invalid Session, 다시 로그인 하십시오.' };

    const updateRequest: RequestUpdateIssueName = request.body;
    updateRequest.issueId = Number(request.params.id);
    console.log('update issueName=========================================');
    console.log(updateRequest);
    const result: TransactionResult = await this.issueService.updateIssueName(updateRequest);
    
    return this.commonController.createReturnMessage(ControllerType.ISSUE, result, updateRequest, MethodType.UPDATE, '이름');
  }

  @httpPut("/issue/:id/useTime")
  async updateUseTime(@request() request: express.Request, @response() res: express.Response) {
    const userSession: userSession.getResponse = await this.commonController.getUserSession({ sessionId: request.cookies['JSESSIONID'] });
    if (!userSession) return { msId: 0, msContent: 'Invalid Session, 다시 로그인 하십시오.' };

    const updateRequest: RequestUpdateIssueUseTime = { issueId: Number(request.params.id) };
    console.log('update use time=========================================');
    console.log(updateRequest);
    const result: TransactionResult = await this.issueService.updateUseTime(updateRequest);
    
    return this.commonController.createReturnMessage(ControllerType.ISSUE, result, updateRequest, MethodType.UPDATE, '소요시간');
  }

  @httpPut("/issue/:id/state/:state")
  async updateState(@request() request: express.Request, @response() res: express.Response) {
    const userSession: userSession.getResponse = await this.commonController.getUserSession({ sessionId: request.cookies['JSESSIONID'] });
    if (!userSession) return { msId: 0, msContent: 'Invalid Session, 다시 로그인 하십시오.' };

    const updateRequest: RequestUpdateIssueState = {
      issueId: Number(request.params.id),
      issueState: request.params.state,
    };
    console.log('update state=========================================');
    console.log(updateRequest);
    const result: TransactionResult = await this.issueService.updateState(updateRequest);
    
    return this.commonController.createReturnMessage(ControllerType.ISSUE, result, updateRequest, MethodType.UPDATE, '상태');
  }

  @httpDelete("/issue/:id")
  async deleteIssue(@request() request: express.Request, @response() res: express.Response) {
    const userSession: userSession.getResponse = await this.commonController.getUserSession({ sessionId: request.cookies['JSESSIONID'] });
    if (!userSession) return { msId: 0, msContent: 'Invalid Session, 다시 로그인 하십시오.' };
    
    const deleteRequest: RequestDeleteIssue = { issueId: Number(request.params.id) };
    console.log('delete issue=========================================');
    console.log(deleteRequest);
    const result: TransactionResult = await this.issueService.deleteIssue(deleteRequest);
    
    return this.commonController.createReturnMessage(ControllerType.ISSUE, result, deleteRequest, MethodType.DELETE);
  }

}