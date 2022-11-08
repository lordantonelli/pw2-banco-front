export interface User {
  id: number;
  name: string;
  email: string;
  dateCreated: Date;
  lastUpdated: Date;
  access_token?: string;
  token_type?: string;
}

export interface LoginData {
  access_token: string;
  token_type: string;
}
