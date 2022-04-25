export enum Role {
  Guest = 'Guest',
  UnverifiedMember = 'Unverified Member',
  Member = 'Member',
  Admin = 'Admin',
}

export type AuthUser = {
  id: string;
  email?: string;
  username: string;
  role: Role;
};

export type SignUpModel = {
  email: string;
  username: string;
  password: string;
};

export type SignInModel = {
  email: string;
  password: string;
};

export type AuthUserWithToken = {
  user: AuthUser;
  accessToken: string;
};
