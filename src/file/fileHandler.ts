import { File } from "./file.model";
import { Request, Response, NextFunction } from "express";

export const fileHandler = (req: Request, _: Response, next: NextFunction) => {
  // console.log('fileHandler');
  let { files } = req;
  if (!files) files = req.body.files;

  const mappedFiles: File[] = ((files as Express.Multer.File[]) || []).map(
    (file) => ({
      name: file.originalname,
      type: file.mimetype,
      content: file.buffer,
      size: file.size,
      extension: `${file.originalname.split(".").pop()}`,
    })
  );

  Object.assign(req.body, { files: mappedFiles });
  return next();
};