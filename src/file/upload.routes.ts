import { Router, Request, Response } from "express";
import { container } from "../config/ioc.container";
import multer from "multer";
import { FileUploadController } from "./fileUpload.controller";
import { fileHandler } from "./fileHandler";

const upload = multer();

const uploadRouter = Router();

const fileUploadController = container.resolve(FileUploadController);

uploadRouter.post(
  "/",
  upload.array("files", 5),
  fileHandler,
  async (req: Request, res: Response) => {
    const response = await fileUploadController.handle(req.body);
    console.log(response);
    return response;
  }
);

export default uploadRouter;