import { MessageType } from '../../common/enums';
import { WebSocketWithId } from '../../common/types';
import { validateRegistrationData } from '../../utils/validators';
import { registerUser } from '../operations/regOperations';
import { createRoomAndAddUser, updateRooms } from '../operations/roomOperations';
import { updateWinners } from '../operations/winnerOperations';

export const handleRegistration = (clientWebSocket: WebSocketWithId, parsedData: unknown) => {
  const regData = validateRegistrationData(parsedData);
  const isRegSuccess = registerUser(clientWebSocket, regData);

  console.log(`Registration success: ${isRegSuccess}`);

  if (isRegSuccess) {
    updateRooms();
    updateWinners();
  }
};

export const handleCreateRoom = (clientWebSocket: WebSocketWithId) => {
  createRoomAndAddUser(clientWebSocket.id);
};

export const commands = new Map([
  [MessageType.REG, handleRegistration],
  [MessageType.CREATE_ROOM, handleCreateRoom],
]);
