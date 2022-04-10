import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import AWS from "aws-sdk";
import { s3Config } from "../config/s3.const";
import { interfaces, controller, httpGet, httpPost, httpDelete, request, queryParam, response, requestParam, httpPut } from "inversify-express-utils";
import { File } from './file.model';

AWS.config.loadFromPath(__dirname + "/../config/s3.config.json");

@injectable()
export class FileController implements interfaces.Controller {
  private client: AWS.S3;
  
  constructor() {
    this.client = new AWS.S3({
      region: s3Config.defaultRegion,
    });
  }

  private generateFileKey(file: File, timestamp: number): string {
    return `${timestamp}-${file.name}`;
  }

  public fileHandler(req: any, res: any) {
    const { files } = req;
    console.log(files);

    const mappedFiles: File[] = ((files as Express.Multer.File[]) || []).map(
      (file) => ({
        name: file.originalname,
        type: file.mimetype,
        content: file.buffer,
        size: file.size,
        extension: `${file.originalname.split(".").pop()}`,
      })
    );
  
    return mappedFiles;
  }

  public async uploadFile(file: File): Promise<string> {
    let result: string = '';
    const timestamp = Date.now();
    const fileKey = this.generateFileKey(file, timestamp);

    const uploadParams = {
      Bucket: s3Config.accessPoint,
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
}