import { AuthUser, AuthUserWithToken } from 'app/slices/auth/types';
import axios from 'app/utils/axios';
import {
  getTokenForHeader,
  getTokenFromLocalStorageIfValid,
  setSession,
} from 'app/utils/jwt';
import { Result, ResultWithValue } from 'app/utils/types/api';

export namespace AuthService {
  export async function initAuth(): Promise<ResultWithValue<AuthUser>> {
    const accessToken = getTokenFromLocalStorageIfValid();

    if (accessToken == null) {
      const result: ResultWithValue<AuthUser> = {
        isSuccess: false,
      };
      return result;
    }

    const { data } = await axios.get(`v1/user/getAuth/jwt`, {
      headers: {
        Authorization: getTokenForHeader(accessToken),
      }
    });
    const result: ResultWithValue<AuthUser> = data;
    return result;
  }

  export async function authenticate(
    email: string,
    password: string,
  ): Promise<ResultWithValue<AuthUserWithToken>> {
    try {
      const { data } = await axios.post(`v1/user/auth`, {
        email: email,
        password: password,
      });
      const result: ResultWithValue<AuthUserWithToken> = data;
      if (result.isSuccess && result.value) {
        setSession(result.value.accessToken);
      }
      console.log(result);
      return result;
    } catch (ex: any) {
      console.log(ex);
      return ex;
    }
  }

  export async function isUniqueEmail(email: string): Promise<boolean> {
    try {
      const { data } = await axios.get(`v1/user/isUniqueEmail/${email}`);
      const result: ResultWithValue<boolean> = data;
      return result.value!;
    } catch (ex: any) {
      console.log(ex);
      return false;
    }
  }

  export async function register(
    email: string,
    username: string,
    password: string,
  ): Promise<boolean> {
    try {
      const { data } = await axios.post(`v1/user/register`, {
        email: email,
        username: username,
        password: password,
      });
      const result: Result = data;
      return result.isSuccess;
    } catch (ex: any) {
      console.log(ex);
      return false;
    }
  }
}
