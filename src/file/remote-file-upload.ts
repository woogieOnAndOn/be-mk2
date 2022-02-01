import { inject, injectable } from "inversify";

import { File, UploadedFile } from "./file.model";
import { FileUpload } from "./file.model";
import { FileUploader } from "./file.model";

@injectable()
export class RemoteFileUpload implements FileUpload {
  constructor(
    @inject("FileUploader") private readonly fileUploader: FileUploader
  ) {}

  async upload(files: File[]): Promise<UploadedFile[]> {
    const uploadedFiles = await this.fileUploader.upload(files);

    if (!uploadedFiles) {
      throw new Error;
    }

    return uploadedFiles as UploadedFile[];
  }
}