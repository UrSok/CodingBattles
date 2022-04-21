import { FieldData } from 'rc-field-form/lib/interface';
import { Result, ResultWithValue } from 'app/utils/types/api';

/* --- STATE --- */
export interface SignUpState {
  passwordMatch: 'none' | 'yes' | 'no';
  isUniqueEmailValidating: boolean;
  isUniqueEmail: 'none' | 'yes' | 'no';
  signUpResult?: any;
}

export interface Passwords {
  password?: FieldData;
  confirmPassword?: FieldData;
}

export interface SignUpModel {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}
