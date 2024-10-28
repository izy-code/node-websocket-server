import { AddUserToRoomData, AttackData, RegistrationData, ShipsData, SocketMessage } from '../common/types';
import { isAddUserToRoomData, isAttackData, isRegData, isShipsData, isSocketMessage } from './type-guards';

const validateData = <T>(data: unknown, typeGuard: (data: unknown) => data is T, errorMessage: string): T => {
  if (!typeGuard(data)) {
    throw new Error(`${errorMessage}: ${data ? JSON.stringify(data) : ''}`);
  }

  return data;
};

export const validateSocketMessage = (parsedMessage: unknown): SocketMessage =>
  validateData(parsedMessage, isSocketMessage, 'Invalid socket message');

export const validateRegistrationData = (data: unknown): RegistrationData =>
  validateData(data, isRegData, 'Invalid registration data');

export const validateAddUserToRoomData = (data: unknown): AddUserToRoomData =>
  validateData(data, isAddUserToRoomData, 'Invalid add user to room data');

export const validateShipsData = (data: unknown): ShipsData => validateData(data, isShipsData, 'Invalid ships data');

export const validateAttackData = (data: unknown): AttackData =>
  validateData(data, isAttackData, 'Invalid attack data');
