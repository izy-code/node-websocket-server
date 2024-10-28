import { AddUserToRoomData, RegistrationData, SocketMessage } from '../common/types';
import { isAddUserToRoomData, isRegData, isSocketMessage } from './type-guards';

export const validateSocketMessage = (parsedMessage: unknown): SocketMessage => {
  if (!isSocketMessage(parsedMessage)) {
    throw new Error(`Invalid socket message: ${parsedMessage}`);
  }

  return parsedMessage;
};

export const validateRegistrationData = (data: unknown): RegistrationData => {
  if (!isRegData(data)) {
    throw new Error(`Invalid registration data: ${data}`);
  }

  return data;
};

export const validateAddUserToRoomData = (data: unknown): AddUserToRoomData => {
  if (!isAddUserToRoomData(data)) {
    throw new Error(`Invalid add user to room data: ${data}`);
  }

  return data;
};
