import * as express from "express";
import { interfaces, controller, httpGet, httpPost, httpDelete, request, queryParam, response, requestParam, httpPut } from "inversify-express-utils";
import { inject } from "inversify";
import { IssueService } from "./issue.service";
import { RequestCreateIssue, RequestUpdateIssueName, RequestUpdateIssueUseTime, RequestUpdateIssueState, RequestDeleteIssue, ResponseRetrieveIssue } from './issue.model';
import { ControllerType, MethodType, TransactionResult } from "../common/common.model";
import { CommonController } from "../common/common.controller";
import { RequestCreateIssueStateHistory } from "./issueStateHistory.model";

@controller("")
export class IssueController implements interfaces.Controller {

  constructor( 
    @inject('IssueService') private issueService: IssueService,
    @inject('CommonController') private commonController: CommonController,
  ) {}

  @httpPost("/issue")
  async insertIssue(@request() request: express.Request, @response() res: express.Response) {
    const insertRequest: RequestCreateIssue = request.body;
    console.log('insert issue=========================================');
    console.log(insertRequest);
    const result: TransactionResult = await this.issueService.insertIssue(insertRequest);
    
    return this.commonController.createReturnMessage(ControllerType.ISSUE, result, insertRequest, MethodType.CREATE);
  }

  @httpGet("/issue")
  async retrieveIssue(@request() request: express.Request, @response() res: express.Response) {
    let result: ResponseRetrieveIssue[];
    console.log('retrieve issue=========================================');
    result = await this.issueService.retrieveIssue();

    return this.commonController.createReturnMessage(ControllerType.ISSUE, result, null, MethodType.READ);
  }

  @httpPut("/issue/:id")
  async updateIssueName(@request() request: express.Request, @response() res: express.Response) {
    const updateRequest: RequestUpdateIssueName = request.body;
    updateRequest.issueId = Number(request.params.id);
    console.log('update issueName=========================================');
    console.log(updateRequest);
    const result: TransactionResult = await this.issueService.updateIssueName(updateRequest);
    
    return this.commonController.createReturnMessage(ControllerType.ISSUE, result, updateRequest, MethodType.UPDATE, '이름');
  }

  @httpPut("/issue/:id/useTime")
  async updateUseTime(@request() request: express.Request, @response() res: express.Response) {
    const updateRequest: RequestUpdateIssueUseTime = { issueId: Number(request.params.id) };
    console.log('update use time=========================================');
    console.log(updateRequest);
    const result: TransactionResult = await this.issueService.updateUseTime(updateRequest);
    
    return this.commonController.createReturnMessage(ControllerType.ISSUE, result, updateRequest, MethodType.UPDATE, '소요시간');
  }

  @httpPut("/issue/:id/state/:state")
  async updateState(@request() request: express.Request, @response() res: express.Response) {
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
    const deleteRequest: RequestDeleteIssue = { issueId: Number(request.params.id) };
    console.log('delete issue=========================================');
    console.log(deleteRequest);
    const result: TransactionResult = await this.issueService.deleteIssue(deleteRequest);
    
    return this.commonController.createReturnMessage(ControllerType.ISSUE, result, deleteRequest, MethodType.DELETE);
  }

}