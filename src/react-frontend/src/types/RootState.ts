import { AuthState } from 'app/slices/auth/types';
import { LayoutState } from 'app/slices/layout/types';

export interface RootState {
  layout?: LayoutState;
  auth?: AuthState;
}
