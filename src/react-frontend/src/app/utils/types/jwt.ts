export interface DecodedJwtToken {
  nameid: string;
  unique_name: string;
  email: string;
  role: string;
  exp: number;
}
