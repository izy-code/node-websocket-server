import { MessageType } from '../common/enums';
import {
  AddUserToRoomData,
  AttackData,
  RandomAttackData,
  RegistrationData,
  ShipsData,
  SocketMessage,
} from '../common/types';

const isMessageType = (stringWithType: string): stringWithType is MessageType => {
  return (Object.values(MessageType) as string[]).includes(stringWithType);
};

export const isSocketMessage = (message: unknown): message is SocketMessage => {
  if (message !== null && typeof message === 'object' && 'type' in message && 'data' in message && 'id' in message) {
    const { type, data, id } = message;

    return typeof type === 'string' && isMessageType(type) && typeof data === 'string' && id === 0;
  }

  return false;
};

export const isRegData = (data: unknown): data is RegistrationData =>
  data !== null &&
  typeof data === 'object' &&
  'name' in data &&
  'password' in data &&
  typeof data.name === 'string' &&
  typeof data.password === 'string';

export const isAddUserToRoomData = (data: unknown): data is AddUserToRoomData =>
  data !== null && typeof data === 'object' && 'indexRoom' in data && typeof data.indexRoom === 'string';

export const isShipsData = (data: unknown): data is ShipsData =>
  data !== null &&
  typeof data === 'object' &&
  'gameId' in data &&
  'ships' in data &&
  typeof data.gameId === 'string' &&
  Array.isArray(data.ships);

export const isAttackData = (data: unknown): data is AttackData =>
  data !== null &&
  typeof data === 'object' &&
  'x' in data &&
  'y' in data &&
  'gameId' in data &&
  'indexPlayer' in data &&
  typeof data.x === 'number' &&
  typeof data.y === 'number' &&
  typeof data.gameId === 'string' &&
  typeof data.indexPlayer === 'number';

export const isRandomAttackData = (data: unknown): data is RandomAttackData =>
  data !== null &&
  typeof data === 'object' &&
  'gameId' in data &&
  'indexPlayer' in data &&
  typeof data.gameId === 'string' &&
  typeof data.indexPlayer === 'number';
