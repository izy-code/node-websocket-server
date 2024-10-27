import { MessageType } from '../../common/enums';
import { WebSocketWithId } from '../../common/types';
import { validateRegistrationData } from '../../utils/validators';
import { registerUser } from '../operations/regOperations';
import { updateRooms } from '../operations/roomOperations';
import { updateWinners } from '../operations/winnerOperations';

export const handleRegistration = (clientWebSocket: WebSocketWithId, parsedData: unknown) => {
  const regData = validateRegistrationData(parsedData);

  registerUser(clientWebSocket, regData);
  updateRooms();
  updateWinners();
};

export const commands = new Map([[MessageType.REG, handleRegistration]]);
