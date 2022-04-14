export interface getRequest {
  sessionId: string;
}

export interface getResponse {
  userId?: string;
  userName?: string;
  sessionId: string;
}