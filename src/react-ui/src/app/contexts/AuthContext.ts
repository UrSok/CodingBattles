import { createContext, useEffect, useReducer } from 'react';

import axios from '../utils/axios';
import { isTokenValid, setSession, getTokenPayload } from '../utils/jwt';

enum Role {
  Guest = 'Guest',
  UnverifiedMember = 'Unverified Member',
  Member = 'Member',
  Admin = 'Admin',
}

interface AuthUser {
  id: string;
  email?: string;
  userName: string;
  role: Role;
}

interface Auth {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: AuthUser | null;
}

const initialState: Auth = {
  isAuthenticated: false,
  isAdmin: false,
  user: null,
};
