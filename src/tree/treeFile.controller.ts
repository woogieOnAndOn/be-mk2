import * as express from "express";
import { interfaces, controller, httpGet, httpPost, httpDelete, request, queryParam, response, requestParam, httpPut } from "inversify-express-utils";
import { inject } from "inversify";
import { CommonController } from "../common/common.controller";
import { FileController } from "../common/file.controller";
import { File } from '../common/file.model';
import multer from "multer";

@controller("/tree")
export class TreeFileController implements interfaces.Controller {

  constructor( 
    @inject('CommonController') private commonController: CommonController,
    @inject('FileController') private fileController: FileController,
  ) {}

  @httpGet("/upload")
  private index(request: express.Request, res: express.Response, next: express.NextFunction): string {
    return "success!";
  }

  @httpPost("/upload")
  async insertTreeFile(@request() req: express.Request, @response() res: express.Response) {
    // const multerHandler = multer();
    const mappedFiles = this.fileController.fileHandler(req.body, res);

    return mappedFiles;
  }
}