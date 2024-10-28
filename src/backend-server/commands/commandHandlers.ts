import { MessageType } from '../../common/enums';
import { WebSocketWithId } from '../../common/types';
import { validateAddUserToRoomData, validateRegistrationData, validateShipsData } from '../../utils/validators';
import { checkAllPlayersHaveShips } from '../database/gameDb';
import { isUserInRoom, removeRoomById } from '../database/roomDb';
import { createGame, initPlayerShips, startGame } from '../operations/gameOperations';
import { registerUser } from '../operations/regOperations';
import { addUserToRoom, createRoomAndAddUser, updateRooms } from '../operations/roomOperations';
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

export const handleAddUserToRoom = (clientWebSocket: WebSocketWithId, parsedData: unknown) => {
  const userAdditionData = validateAddUserToRoomData(parsedData);

  if (isUserInRoom(clientWebSocket.id, userAdditionData.indexRoom)) {
    throw new Error("You're trying to add a user that is already in that room");
  }

  addUserToRoom(clientWebSocket.id, userAdditionData);
  createGame(clientWebSocket.id);
  removeRoomById(userAdditionData.indexRoom);
};

export const handleAddShips = (clientWebSocket: WebSocketWithId, parsedData: unknown) => {
  const shipsData = validateShipsData(parsedData);

  initPlayerShips(shipsData, clientWebSocket.id);
  checkAllPlayersHaveShips(clientWebSocket.id);
  startGame(clientWebSocket.id);
};

export const commands = new Map([
  [MessageType.REG, handleRegistration],
  [MessageType.CREATE_ROOM, handleCreateRoom],
  [MessageType.ADD_USER, handleAddUserToRoom],
  [MessageType.ADD_SHIPS, handleAddShips],
]);
