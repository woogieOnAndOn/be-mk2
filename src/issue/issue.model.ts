export interface Issue {
  issueId: number;
  issueName: string;
  issueState: string;
  useTime: number;
  creationDate: string;
}

export interface RequestCreateIssue {
  issueName: string;
}

export interface RequestUpdateIssueName {
  issueId: number;
  issueName: string;
}

export interface RequestUpdateIssueUseTime {
  issueId: number;
}

export interface RequestUpdateIssueState {
  issueId: number;
  issueState: string;
}

export interface RequestDeleteIssue {
  issueId: number;
}

export interface ResponseRetrieveIssue {
  issueId: number;
  issueName: string;
  issueState: string;
  useTime: number;
  creationDate: string; 
}

export enum IssueState {
  WAIT = 'wait',
  START = 'start',
  COMPLETE = 'complete',
  END = 'end',
}