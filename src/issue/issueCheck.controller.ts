import * as express from "express";
import { interfaces, controller, httpGet, httpPost, httpDelete, request, queryParam, response, requestParam, httpPut } from "inversify-express-utils";
import { inject } from "inversify";
import { IssueCheckService } from "./issueCheck.service";
import * as IssueCheck from './issueCheck.model';
import { ControllerType, MethodType, TransactionResult } from "../common/common.model";
import { CommonController } from "../common/common.controller";

@controller("")
export class IssueCheckController implements interfaces.Controller {

  constructor( 
    @inject('IssueCheckService') private issueCheckService: IssueCheckService,
    @inject('CommonController') private commonController: CommonController,
  ) {}

  @httpPost("/issue/:id/issueCheck")
  async insertIssueCheck(@request() request: express.Request, @response() res: express.Response) {
    const insertRequest: IssueCheck.CreateReq = request.body;
    insertRequest.issueId = Number(request.params.id);
    console.log('insert issueCheck=========================================');
    console.log(insertRequest);
    const result: TransactionResult = await this.issueCheckService.insertIssueCheck(insertRequest);
    
    return this.commonController.createReturnMessage(ControllerType.ISSUS_CHECK, result, insertRequest, MethodType.CREATE);
  }

  @httpGet("/issue/:id/issueCheck")
  async retrieveIssueCheck(@request() request: express.Request, @response() res: express.Response) {
    let result: IssueCheck.RetrieveRes[];
    const searchRequest: IssueCheck.RetrieveReq = { issueId: Number(request.params.id) }
    console.log('retrieve issueCheck=========================================');
    console.log(searchRequest);
    result = await this.issueCheckService.retrieveIssueCheck(searchRequest);
    
    return this.commonController.createReturnMessage(ControllerType.ISSUS_CHECK, result, null, MethodType.READ);
  }

  @httpPut("/issue/:id/issueCheck/:checkId")
  async updateIssueCheckName(@request() request: express.Request, @response() res: express.Response) {
    const updateRequest: IssueCheck.UpdateNameReq = request.body;
    updateRequest.issueId = Number(request.params.id);
    updateRequest.checkId = Number(request.params.checkId);
    console.log('update issueCheckName=========================================');
    console.log(updateRequest);
    const result: TransactionResult = await this.issueCheckService.updateIssueCheckName(updateRequest);
    
    return this.commonController.createReturnMessage(ControllerType.ISSUS_CHECK, result, updateRequest, MethodType.UPDATE, '이름');
  }

  @httpPut("/issue/:id/issueCheck/:checkId/completeYn")
  async updateIssueCheckCompleteYn(@request() request: express.Request, @response() res: express.Response) {
    const updateRequest: IssueCheck.UpdateCompleteYnReq = {
      issueId: Number(request.params.id),
      checkId: Number(request.params.checkId),
    };
    console.log('update issueCheckCompleteYn=========================================');
    console.log(updateRequest);
    const result: TransactionResult = await this.issueCheckService.updateIssueCheckCompleteYn(updateRequest);
    
    return this.commonController.createReturnMessage(ControllerType.ISSUS_CHECK, result, updateRequest, MethodType.UPDATE, '완료여부');
  }

  @httpDelete("/issue/:id/issueCheck/:checkId")
  async deleteIssueCheck(@request() request: express.Request, @response() res: express.Response) {
    const deleteRequest: IssueCheck.DeleteReq = {
      issueId: Number(request.params.id),
      checkId: Number(request.params.checkId),
    };
    console.log('delete issueCheck=========================================');
    console.log(deleteRequest);
    const result: TransactionResult = await this.issueCheckService.deleteIssueCheck(deleteRequest);
    
    return this.commonController.createReturnMessage(ControllerType.ISSUS_CHECK, result, deleteRequest, MethodType.DELETE);
  }
}