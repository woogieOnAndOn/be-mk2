import { interfaces, controller, httpGet, httpPost, httpDelete, request, queryParam, response, requestParam, httpPut } from "inversify-express-utils";
import { inject } from "inversify";

import { File } from "./file.model";
import { RemoteFileUpload } from "./remoteFileUpload"

@controller("")
export class FileUploadController implements interfaces.Controller {
  constructor(
    @inject("RemoteFileUpload")
    private readonly fileUpload: RemoteFileUpload
  ) {}

  async handle(@request() request: { files: File[] }) {
    try {
      // console.log('handle');
      const { files } = request as { files: File[] };
      const filesPaths = await this.fileUpload.upload(files);

      return filesPaths;
    } catch (error) {
      return { message: error };
    }
  }
}