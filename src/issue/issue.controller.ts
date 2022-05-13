import * as express from "express";
import { interfaces, controller, httpGet, httpPost, httpDelete, request, queryParam, response, requestParam, httpPut, next } from "inversify-express-utils";
import { inject } from "inversify";
import { IssueService } from "./issue.service";
import * as Issue from './issue.model';
import { ControllerType, Message, MethodType, TransactionResult } from "../common/common.model";
import { CommonController } from "../common/common.controller";
import { UserSessionService } from '../userSession/userSession.service';
import * as userSession from '../userSession/userSession.model';

@controller("")
export class IssueController extends CommonController implements interfaces.Controller {

  constructor( 
    @inject('IssueService') private issueService: IssueService,
    @inject('UserSessionService') userSessionService: UserSessionService
  ) {
    super(userSessionService);
  }

  @httpPost("/issue")
  async insertIssue(@request() request: express.Request, @response() res: express.Response) {
    return await this.errorHandlingExecutor(request, ControllerType.ISSUE, MethodType.CREATE, async (requestUser: userSession.getRes) => {
      const insertRequest: Issue.CreateReq = request.body;
      insertRequest.user = requestUser.userName;
      console.log('insert issue=========================================');
      console.log(insertRequest);
      const result: TransactionResult = await this.issueService.insertIssue(insertRequest);
      const insertedIssue: Issue.RetrieveRes = await this.issueService.getIssue({ issueId: result.insertId });
      console.log(insertedIssue);
      return insertedIssue;
    });
  }

  @httpGet("/issue")
  async retrieveIssue(@request() request: express.Request, @response() res: express.Response) {
    return await this.errorHandlingExecutor(request, ControllerType.ISSUE, MethodType.READ, async (requestUser: userSession.getRes) => {
      console.log('retrieve issue=========================================');
      return await this.issueService.retrieveIssue<Issue.RetrieveRes[]>({ user: requestUser.userName });
    });
  }

  @httpPut("/issue/:id")
  async updateIssue(@request() request: express.Request, @response() res: express.Response) {
    return await this.errorHandlingExecutor(request, ControllerType.ISSUE, MethodType.UPDATE, async (requestUser: userSession.getRes) => {
      const updateRequest: Issue.UpdateReq = request.body;
      updateRequest.issueId = Number(request.params.id);
      console.log('update issueName=========================================');
      console.log(updateRequest);
      const result: TransactionResult = await this.issueService.updateIssue(updateRequest);
      const updatedIssue: Issue.RetrieveRes = await this.issueService.getIssue({ issueId: updateRequest.issueId });
      console.log(updatedIssue);
      return updatedIssue;
    });
  }

  @httpPut("/issue/:id/useTime")
  async updateUseTime(@request() request: express.Request, @response() res: express.Response) {
    return await this.errorHandlingExecutor(request, ControllerType.ISSUE, MethodType.UPDATE, async (requestUser: userSession.getRes) => {
      const updateRequest: Issue.UpdateUseTimeReq = { issueId: Number(request.params.id) };
      console.log('update use time=========================================');
      console.log(updateRequest);
      return await this.issueService.updateUseTime(updateRequest);
    }, '소요시간');
  }

  @httpPut("/issue/:id/state/:state")
  async updateState(@request() request: express.Request, @response() res: express.Response) {
    return await this.errorHandlingExecutor(request, ControllerType.ISSUE, MethodType.UPDATE, async (requestUser: userSession.getRes) => {
      const updateRequest: Issue.UpdateStateReq = {
        issueId: Number(request.params.id),
        issueState: request.params.state,
      };
      console.log('update state=========================================');
      console.log(updateRequest);
      return await this.issueService.updateState(updateRequest);
    }, '상태');
  }

  @httpDelete("/issue/:id")
  async deleteIssue(@request() request: express.Request, @response() res: express.Response) {
    return await this.errorHandlingExecutor(request, ControllerType.ISSUE, MethodType.DELETE, async (requestUser: userSession.getRes) => {
      const deleteRequest: Issue.DeleteReq = { issueId: Number(request.params.id) };
      console.log('delete issue=========================================');
      console.log(deleteRequest);
      return await this.issueService.deleteIssue(deleteRequest);
    });
  }
}