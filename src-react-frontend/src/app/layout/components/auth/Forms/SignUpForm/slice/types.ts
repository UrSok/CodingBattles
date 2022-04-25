import { FieldData } from 'rc-field-form/lib/interface';

type tripleBoolean = null | false | true;

export interface SignUpFormState {
  passwordMatch: tripleBoolean;
  isUniqueEmail: tripleBoolean;
}

export interface Passwords {
  password?: FieldData;
  confirmPassword?: FieldData;
}
