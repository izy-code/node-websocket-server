import { MessageType } from '../common/enums';
import { AddUserToRoomData, RegistrationData, SocketMessage } from '../common/types';

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
  data !== null && typeof data === 'object' && 'name' in data && 'password' in data;

export const isAddUserToRoomData = (data: unknown): data is AddUserToRoomData =>
  data !== null && typeof data === 'object' && 'indexRoom' in data;
