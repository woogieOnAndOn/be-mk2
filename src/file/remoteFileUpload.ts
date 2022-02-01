import { inject, injectable } from "inversify";
import { File, UploadedFile } from "./file.model";
import { AWSFileUploader } from './awsFileUploader';

@injectable()
export class RemoteFileUpload {
  constructor(
    @inject("AWSFileUploader") private readonly fileUploader: AWSFileUploader
  ) {}

  async upload(files: File[]): Promise<UploadedFile[]> {
    const uploadedFiles = await this.fileUploader.upload(files);

    if (!uploadedFiles) {
      throw new Error;
    }

    return uploadedFiles as UploadedFile[];
  }
}