import { AuthState } from 'app/auth/types';
import { LayoutState } from 'app/layout/slice/types';

export interface RootState {
  layout?: LayoutState;
  auth?: AuthState;
}
