import { sendResponseToAll } from '../../utils/utils';
import { MessageType } from '../../common/enums';
import { getRooms } from '../database/roomDb';

export const updateRooms = () => {
  const rooms = getRooms();

  sendResponseToAll(MessageType.UPDATE_ROOM, rooms, 'rooms');
};
