import { QueryInfo } from '../common/common.model';

export enum UserSessionQueryId {
  checkValidSession
}

export const UserSessionQuery = (queryId: UserSessionQueryId, request: any = {}) => {
  const result: QueryInfo = {
    query: ``,
    queryParams: [],
  };
  const query: string[] = [];
  const queryParams: any[] = [];

  switch(queryId) {
    case UserSessionQueryId.checkValidSession:
      query.push(`
        SELECT COUNT(*) AS cnt
        FROM auth.user_session
        WHERE session_id = ?
      `);
      queryParams.push(request.sessionId);
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