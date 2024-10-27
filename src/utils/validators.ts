import { RegistrationData, SocketMessage } from '../common/types';
import { isRegData, isSocketMessage } from './type-guards';

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
