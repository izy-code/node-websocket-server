import { RegistrationData, User, WebSocketWithId } from '../../common/types';
import { createUser, getUserByName, replaceUserFields } from '../database/userDb';
import { MessageType } from '../../common/enums';
import { sendResponse } from '../../utils/utils';

export const registerUser = (clientWebSocket: WebSocketWithId, regData: RegistrationData) => {
  const { name, password } = regData;
  const user = getUserByName(name);

  let responseData;

  if (!user) {
    const newUser: User = { name, password, webSocketId: clientWebSocket.id, isOnline: true };

    createUser(newUser);

    responseData = { name, index: clientWebSocket.id, error: false, errorText: '' };
  } else {
    if (user.password === password && !user.isOnline) {
      const changedUserFields = { webSocketId: clientWebSocket.id, isLoggedIn: true };

      replaceUserFields(user.webSocketId, changedUserFields);

      responseData = { name, index: clientWebSocket.id, error: false, errorText: '' };
    } else if (user.password === password && user.isOnline) {
      responseData = { error: true, errorText: 'User with this name already logged in' };
    } else {
      responseData = { error: true, errorText: 'Password is incorrect' };
    }
  }

  sendResponse(clientWebSocket, MessageType.REG, responseData);
};
