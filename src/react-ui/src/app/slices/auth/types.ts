/* --- STATE --- */
export enum Role {
  Guest = 'Guest',
  UnverifiedMember = 'Unverified Member',
  Member = 'Member',
  Admin = 'Admin',
}

export interface AuthUser {
  id: string;
  email?: string;
  username: string;
  role: Role;
}

export interface AuthState {
  token?: string;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInitialized: boolean;
  user: AuthUser | null;
}

export interface SignInModel {
  email: string;
  password: string;
}

export interface AuthUserWithToken {
  user: AuthUser;
  accessToken: string;
}