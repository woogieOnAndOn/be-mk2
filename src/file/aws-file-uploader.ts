import { injectable } from "inversify";
import AWS from "aws-sdk";

import { File, UploadedFile } from "./file.model";
import { FileUploader } from "./file.model";
import { s3Config } from "../config/s3.const";

AWS.config.loadFromPath(__dirname + "/s3.config.json");

@injectable()
export class AWSFileUploader implements FileUploader {
  private client: AWS.S3;

  private readonly bucketName = s3Config.bucketName;

  constructor() {
    this.client = new AWS.S3({
      region: s3Config.defaultRegion,
    });
  }

  private generateFileKey(file: File, timestamp: number): string {
    return `${timestamp}-${file.name}`;
  }

  private async uploadFile(file: File): Promise<string> {
    let result: string = '';
    const timestamp = Date.now();
    const fileKey = this.generateFileKey(file, timestamp);

    const uploadParams = {
      Bucket: this.bucketName,
      Key: fileKey,
      ContentType: file.type,
      Body: file.content,
      ACL: s3Config.defaultFilesACL,
    };

    const response = await this.client.upload(uploadParams).promise();
    console.log(response);

    if(response) {
      result = response.Location;
    }

    return result;
  }

  async upload(
    files: File | File[]
  ): Promise<UploadedFile | UploadedFile[] | undefined> {
    try {
      if (Array.isArray(files)) {
        const paths = await Promise.all(
          files.map(async (file) => this.uploadFile(file))
        );
        return paths.map((path) => ({ path }));
      }

      const path = await this.uploadFile(files);
      return {
        path,
      };
    } catch {
      return undefined;
    }
  }
}