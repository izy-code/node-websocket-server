import { MessageType } from '../../common/enums';
import { WebSocketWithId } from '../../common/types';
import { validateRegistrationData } from '../../utils/validators';
import { registerUser } from '../operations/regOperations';

export const handleRegistration = (clientWebSocket: WebSocketWithId, parsedData: unknown) => {
  const regData = validateRegistrationData(parsedData);

  registerUser(clientWebSocket, regData);
};

export const commands = new Map([[MessageType.REG, handleRegistration]]);
