import { GameStatus } from 'app/types/enums/gameStatus';
import { UserDto } from '../user/userDto';
import { Round } from './round';

export type Game = {
  id: string;
  code: string;
  name: string;
  status: GameStatus;
  isPrivate: boolean;
  gameMasterUser: UserDto;
  users: UserDto[];
  currentRound?: Round;
  previousRounds: Round[];
};
