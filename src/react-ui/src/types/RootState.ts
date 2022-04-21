// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly
import { SignUpState } from 'app/components/auth/Forms/SignUpForm/slice/types';
import { AuthState } from 'app/slices/auth/types';
import { ExceptionState } from 'app/slices/exception/types';

/* 
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
*/
export interface RootState {
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
  exception?: ExceptionState;
  signUp?: SignUpState;
  auth?: AuthState;
}
