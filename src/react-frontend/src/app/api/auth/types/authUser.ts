export type AuthUserRequest = {
  email: string;
  password: string;
};

export type AuthUserResult = {
  accessToken: string;
};
