export interface IssueCheck {
  issueId: number;
  checkId: number;
  checkName: string;
  completeYn: string;
  creationDate: string;
}

export interface RequestCreateIssueCheck {
  issueId: number;
  checkName: string;
}

export interface RequestUpdateIssueCheckName {
  issueId: number;
  checkId: number;
  checkName: string;
}

export interface RequestUpdateIssueCheckCompleteYn {
  issueId: number;
  checkId: number;
}

export interface RequestDeleteIssueCheck {
  issueId: number;
  checkId: number; 
}

export interface RequestRetrieveIssueCheck {
  issueId: number;
}

export interface ResponseRetrieveIssueCheck {
  issueId: number;
  checkId: number;
  checkName: string;
  completeYn: string;
  creationDate: string;
}