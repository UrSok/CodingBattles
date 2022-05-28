import jwtDecode from 'jwt-decode';

import axios from 'app/config/api/axios';
import { DecodedJwtToken } from './types/jwt';
import { localStorageKey } from './types';

const getTokenPayload = (accessToken: string): DecodedJwtToken => {
  const decoded = jwtDecode<DecodedJwtToken>(accessToken);

  return decoded;
};

const isTokenValid = (accessToken: string | undefined): boolean => {
  if (!accessToken) {
    return false;
  }

  const decodedToken = getTokenPayload(accessToken);
  const timeNow = Date.now() / 1000;
  return decodedToken.exp > timeNow;
};

const handleTokenExpired = (exp: number) => {
  let expiredTimer: number | undefined;

  if (expiredTimer) {
    window.clearTimeout(expiredTimer);
  }

  const timeNow = Date.now();
  const timeLeft = exp * 1000 - timeNow;

  //console.log(timeLeft / 1000 / 60 + ' minutes');

  expiredTimer = window.setTimeout(() => {
    //console.log('expired');
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
  getTokenFromLocalStorage,
  getTokenFromLocalStorageIfValid,
  isTokenValid,
  getTokenPayload,
  getTokenForHeader,
  setSession,
};
