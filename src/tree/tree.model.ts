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

export interface TreeSearchCondition {
  parent: number;
  secret: number;
  user: string;
}

export interface RequestCreateTree {
  type: number;            // 10: folder, 20: file
  name: string;
  content: string;
  depth: number;
  parent: number;
  secret: number;          // 0: piblic, 1: private
  user: string;
}

export interface RequestUpdateTree {
  id: number;
  name: string;
  content: string;
  secret: number;          // 0: piblic, 1: private
  user: string;
}

export interface RequestDeleteTree {
  id: number;
  type: number;            // 10: folder, 20: file
  user: string;
}

export interface RequestUpdateSeqTree {
  id: number;
  type: number;            // 10: folder, 20: file
  depth: number;
  parent: number;
  upDown: UpDown;
  user: string;
}

export interface RequestGetTree {
  id: number;
  user: string;
}

export enum UpDown {
  UP = 'UP',
  DOWN = 'DOWN',
}