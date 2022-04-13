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
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInitialized: boolean;
  user: AuthUser | null;
}
