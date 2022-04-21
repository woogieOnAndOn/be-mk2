export interface Tree {
  id       ?:number;
  type     ?:number;            // 10: folder, 20: file
  name     ?:string;
  content  ?:string;
  depth    ?:number;
  parent   ?:number;
  secret   ?:number;          // 0: piblic, 1: private
  user     ?:string;
}

export interface RetrieveReq {
  parent: number;
  secret: number;
  user: string;
}

export interface RetrieveRes {
  id: number;
  type: number;            // 10: folder, 20: file
  name: string;
  content: string;
  depth: number;
  parent: number;
  secret: number;          // 0: piblic, 1: private
  user: string;
}

export interface CreateReq {
  type: number;            // 10: folder, 20: file
  name: string;
  content: string;
  depth: number;
  parent: number;
  secret: number;          // 0: piblic, 1: private
  user: string;
}

export interface UpdateReq {
  id: number;
  name: string;
  content: string;
  secret: number;          // 0: piblic, 1: private
  user: string;
}

export interface DeleteReq {
  id: number;
  type: number;            // 10: folder, 20: file
  user: string;
}

export interface UpdateSeqReq {
  id: number;
  type: number;            // 10: folder, 20: file
  depth: number;
  parent: number;
  upDown: UpDown;
  user: string;
}

export interface GetReq {
  id: number;
  user: string;
}

export enum UpDown {
  UP = 'UP',
  DOWN = 'DOWN',
}