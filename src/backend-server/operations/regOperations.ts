import { RegistrationData, User, WebSocketWithId } from '../../common/types';
import { createUser, getUserByName, getUsersCount, replaceUserFields } from '../database/userDb';
import { MessageType } from '../../common/enums';
import { sendPersonalResponse } from '../../utils/utils';

export const registerUser = (clientWebSocket: WebSocketWithId, regData: RegistrationData) => {
  const { name, password } = regData;
  const user = getUserByName(name);

  let responseData;

  if (!user) {
    const newUser: User = { index: getUsersCount(), name, password, webSocketId: clientWebSocket.id, isOnline: true };

    createUser(newUser);

    responseData = { name, index: newUser.index, error: false, errorText: '' };
  } else {
    if (user.password === password && !user.isOnline) {
      const changedUserFields = { webSocketId: clientWebSocket.id, isLoggedIn: true };

      replaceUserFields(user.webSocketId, changedUserFields);

      responseData = { name, index: user.index, error: false, errorText: '' };
    } else if (user.password === password && user.isOnline) {
      responseData = { name, index: -1, error: true, errorText: 'User with this name already logged in' };
    } else {
      responseData = { name, index: -1, error: true, errorText: 'Password is incorrect' };
    }
  }

  sendPersonalResponse(clientWebSocket, MessageType.REG, responseData);

  return !responseData.error;
};
