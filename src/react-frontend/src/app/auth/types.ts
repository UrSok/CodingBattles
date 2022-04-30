import { AuthUser } from 'app/api/types/auth';

export interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInitialized: boolean;
  user: AuthUser | null;
}
