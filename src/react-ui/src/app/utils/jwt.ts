import jwtDecode from 'jwt-decode';
import { verify, sign } from 'jsonwebtoken';
// there is decode in jsonwebtoken
import axios from './axios';

interface DecodedJwtToken {
  exp: number;
}

const getTokenPayload = (accessToken: string): DecodedJwtToken => {
  const decoded = jwtDecode<DecodedJwtToken>(accessToken);

  return decoded;
};

const isTokenValid = (accessToken: string): boolean => {
  if (!accessToken) {
    return false;
  }

  const decodedToken = getTokenPayload(accessToken);
  const timeNow = Date.now() / 1000;
  //const v = decode() TODO: USE LATER
  return decodedToken.exp > timeNow;
};

const handleTokenExpired = (exp: number) => {
  let expiredTimer: number | undefined;

  if (expiredTimer) {
    window.clearTimeout(expiredTimer);
  }

  const timeNow = Date.now();
  const timeLeft = exp * 1000 - timeNow;

  console.log(timeLeft / 1000 / 60 + ' minutes');

  expiredTimer = window.setTimeout(() => {
    console.log('expired');
    setSession(null);
    window.location.reload();
  }, timeLeft);
};

const setSession = (accessToken: string | null) => {
  if (accessToken == null) {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
    return;
  }

  localStorage.setItem('accessToken', accessToken);
  axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  const { exp } = getTokenPayload(accessToken);
  handleTokenExpired(exp);
};

export { isTokenValid, getTokenPayload, setSession, verify, sign };
