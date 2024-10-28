import { sendResponseToAll } from '../../utils/utils';
import { MessageType } from '../../common/enums';
import { createRoom, getRoomByUserSocketId, getRooms } from '../database/roomDb';
import { getUserBySocketId } from '../database/userDb';
import { randomUUID } from 'crypto';

export const updateRooms = () => {
  const rooms = getRooms();

  sendResponseToAll(MessageType.UPDATE_ROOM, rooms, 'rooms');
};

export const createRoomAndAddUser = (socketId: number) => {
  const loggedInUser = getUserBySocketId(socketId);

  if (!loggedInUser) {
    throw new Error("Can't create a room if you are not logged in");
  }

  const roomWithCurrentUser = getRoomByUserSocketId(socketId);

  if (roomWithCurrentUser) {
    throw new Error("Can't create a room if you already connected to a room");
  }

  createRoom({ roomId: randomUUID(), roomUsers: [loggedInUser] });
  sendResponseToAll(MessageType.UPDATE_ROOM, getRooms(), 'rooms');
};
