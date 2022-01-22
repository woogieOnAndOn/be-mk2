import { QueryInfo } from '../common/common.model';

export enum IssueCheckQueryId {
  insertIssueCheck,
  retrieveIssueCheck,
  updateIssueCheckName,
  updateIssueCheckCompleteYn,
  deleteIssueCheck,
}

export const IssueCheckQuery = (queryId: IssueCheckQueryId, request: any = {}) => {
  const result: QueryInfo = {
    query: ``,
    queryParams: [],
  };
  const query: string[] = [];
  const queryParams: any[] = [];

  switch(queryId) {
    case IssueCheckQueryId.insertIssueCheck:
      query.push(`
        INSERT INTO issue_check
          (
            issue_id, 
            check_id, 
            check_name, 
            creation_date
          )
        VALUES
          (
            ?, 
            (
              SELECT IFNULL(MAX(ic.check_id), 0) + 1 
              FROM issue_check ic
              WHERE ic.issue_id = ?
            ), 
            ?, 
            now()
          )
      `);
      queryParams.push(request.issueId);
      queryParams.push(request.issueId);
      queryParams.push(request.checkName);
      break;

    case IssueCheckQueryId.retrieveIssueCheck:
      query.push(`
        SELECT 
          issue_id AS issueId, 
          check_id AS checkId, 
          check_name AS checkName, 
          complete_yn AS completeYn, 
          creation_date AS creationDate
        FROM issue_check
        WHERE issue_id = ?
      `);
      queryParams.push(request.issueId);
      break;

    case IssueCheckQueryId.updateIssueCheckName:
      query.push(`
        UPDATE issue_check
        SET check_name = ?
        WHERE issue_id = ? 
        AND check_id = ?
      `);
      queryParams.push(request.checkName);
      queryParams.push(request.issueId);
      queryParams.push(request.checkId);
      break;

    case IssueCheckQueryId.updateIssueCheckCompleteYn:
      query.push(`
        UPDATE issue_check
        SET complete_yn = IF(complete_yn = 'N', 'Y', 'N')
        WHERE issue_id = ? 
        AND check_id = ?
      `);
      queryParams.push(request.issueId);
      queryParams.push(request.checkId);
      break;

    case IssueCheckQueryId.deleteIssueCheck:
      query.push(`
        DELETE 
        FROM issue_check
        WHERE issue_id = ? 
        AND check_id = ?
      `);
      queryParams.push(request.issueId);
      queryParams.push(request.checkId);
      break;

    default:
      break;
  }

  if(query.length > 0) {
      result.query = query.join(' ');
      result.queryParams = queryParams;
  }

  return result;
}