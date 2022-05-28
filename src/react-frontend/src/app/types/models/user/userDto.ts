import { Role } from 'app/types/enums/role';

export type UserDto = {
  id: string;
  email?: string;
  username: string;
  role: Role;
};
