import { AuthState } from 'app/auth/types';
import { SignUpFormState } from 'app/layout/components/auth/Forms/SignUpForm/slice/types';

export interface RootState {
  signUpForm?: SignUpFormState;
  auth?: AuthState;
}
