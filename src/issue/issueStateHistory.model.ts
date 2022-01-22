export interface IssueStateHistory {
  issueId: number;
  historyId: number;
  historyState: string;
  creationData: string;
}

export interface RequestCreateIssueStateHistory {
  issueId: number;
  historyState: string;
}