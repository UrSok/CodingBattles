import axios from 'app/api/settings/axios';
import jwtDecode from 'jwt-decode';

export interface DecodedJwtToken {
  nameid: string;
  unique_name: string;
  email: string;
  role: string;
  exp: number;
}

enum localStorageKey {
  AccessToken = 'accessToken',
}

const getTokenPayload = (accessToken: string): DecodedJwtToken => {
  const decoded = jwtDecode<DecodedJwtToken>(accessToken);
  console.log(decoded);

  return decoded;
};

const isTokenValid = (accessToken: string | undefined): boolean => {
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

const getTokenForHeader = (accessToken: string): string => {
  return `Bearer ${accessToken}`;
};

const setSession = (accessToken: string | null) => {
  if (accessToken == null) {
    localStorage.removeItem(localStorageKey.AccessToken);
    delete axios.defaults.headers.common.Authorization;
    return;
  }

  localStorage.setItem(localStorageKey.AccessToken, accessToken);
  axios.defaults.headers.common.Authorization = getTokenForHeader(accessToken);
  const { exp } = getTokenPayload(accessToken);
  handleTokenExpired(exp);
};

const initSession = (accessToken: string | null) => {
  if (accessToken == null) {
    localStorage.removeItem(localStorageKey.AccessToken);
    delete axios.defaults.headers.common.Authorization;
    return;
  }

  localStorage.setItem(localStorageKey.AccessToken, accessToken);
  axios.defaults.headers.common.Authorization = getTokenForHeader(accessToken);
};

const getTokenFromLocalStorage = (): string | null => {
  return localStorage.getItem(localStorageKey.AccessToken);
};

const getTokenFromLocalStorageIfValid = (): string | null => {
  const accessToken = localStorage.getItem(localStorageKey.AccessToken);
  if (accessToken != null && isTokenValid(accessToken)) {
    return accessToken;
  }

  return null;
};

export {
  initSession,
  getTokenFromLocalStorage,
  getTokenFromLocalStorageIfValid,
  isTokenValid,
  getTokenPayload,
  getTokenForHeader,
  setSession,
};
