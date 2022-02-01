import { injectable } from "inversify";
import AWS from "aws-sdk";

import { File } from "./file.model";
import { s3Config } from "../config/s3.const";

AWS.config.loadFromPath(__dirname + "/s3.config.json");

@injectable()
export class AWSFileUploader {
  private client: AWS.S3;

  private readonly bucketName = s3Config.accessPoint;

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

    console.log(this.client);

    const response = await this.client.upload(uploadParams).promise();

    if(response) {
      result = s3Config.bucketAddress + response.Key;
    }

    return result;
  }

  async upload(
    files: File | File[]
  ): Promise<string | string[] | undefined> {
    try {
      if (Array.isArray(files)) {
        const paths = await Promise.all(
          files.map(async (file) => this.uploadFile(file))
        );
        return paths;
      }

      const path = await this.uploadFile(files);
      return path;
    } catch {
      return undefined;
    }
  }
}