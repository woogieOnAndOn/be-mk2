export interface File {
  name: string;
  size: number;
  type: string;
  extension: string;
  content: ArrayBuffer;
}

export interface UploadedFile {
  path: string;
}

export interface FileUpload {
  upload: (files: File[]) => Promise<UploadedFile[]>;
}

export interface FileUploader {
  upload: (
    files: File | File[]
  ) => Promise<UploadedFile | UploadedFile[] | undefined>;
}