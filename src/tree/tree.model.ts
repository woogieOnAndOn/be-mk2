export interface Tree {
  id       ?:number;
  type     ?:number;            // 10: folder, 20: file
  name     ?:string;
  content  ?:string;
  depth    ?:number;
  parent   ?:number;
  secret   ?:number;          // 0: piblic, 1: private
}

export interface TreeSearchCondition {
  parent: number;
  secret: number;
}

export interface RequestCreateTree {
  type     :number;            // 10: folder, 20: file
  name     :string;
  content  :string;
  depth    :number;
  parent   :number;
  secret   :number;          // 0: piblic, 1: private
}

export interface RequestUpdateTree {
  id       :number;
  name     :string;
  content  :string;
  secret   :number;          // 0: piblic, 1: private
}

export interface RequestDeleteTree {
  id       :number;
  type     :number;            // 10: folder, 20: file
}

export interface RequestUpdateSeqTree {
  id       ?:number;
  type     ?:number;            // 10: folder, 20: file
  depth    ?:number;
  parent   ?:number;
  upDown   ?:UpDown;
}

export interface RequestGetTree {
  id       ?:number;
}

export enum UpDown {
  UP = 'UP',
  DOWN = 'DOWN',
}