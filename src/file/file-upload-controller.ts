import * as express from "express";
import { interfaces, controller, httpGet, httpPost, httpDelete, request, queryParam, response, requestParam, httpPut } from "inversify-express-utils";
import { inject } from "inversify";

import { File, UploadedFile } from "./file.model";
import { FileUpload } from "./file.model";
import { FileUploader } from "./file.model";

@controller("")
export class FileUploadController implements interfaces.Controller {
  constructor(
    @inject("FileUpload")
    private readonly fileUpload: FileUpload
  ) {}

  async handle(@request() request: { files: File[] }) {
    try {
      const { files } = request as { files: File[] };
      const filesPaths = await this.fileUpload.upload(files);

      return filesPaths;
    } catch (error) {
      return { message: error };
    }
  }
}