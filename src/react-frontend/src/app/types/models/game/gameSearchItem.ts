import { GameStatus } from 'app/types/enums/gameStatus';
import { UserDto } from '../user/userDto';

export type GameSearchItem = {
  id: string;
  code: string;
  name: string;
  status: GameStatus;
  users: UserDto[];
};
