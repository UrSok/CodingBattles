import { UserDto } from 'app/types/models/user/userDto';

export interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInitialized: boolean;
  user?: UserDto;
}
