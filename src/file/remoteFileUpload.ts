import { inject, injectable } from "inversify";
import { File } from "./file.model";
import { AWSFileUploader } from './awsFileUploader';

@injectable()
export class RemoteFileUpload {
  constructor(
    @inject("AWSFileUploader") private readonly fileUploader: AWSFileUploader
  ) {}

  async upload(files: File[]): Promise<string[]> {
    // console.log('upload');
    const uploadedFiles = await this.fileUploader.upload(files);

    if (!uploadedFiles) {
      throw new Error;
    }

    return uploadedFiles as string[];
  }
}