import { sendResponseToAll } from '../../utils/utils';
import { MessageType } from '../../common/enums';
import {
  createRoom,
  getRoomByUserSocketId,
  pushUserToRoom,
  pruneUserFromAnotherRooms,
  getRoomsWithOneUser,
} from '../database/roomDb';
import { getUserBySocketId } from '../database/userDb';
import { randomUUID } from 'node:crypto';
import { AddUserToRoomData } from 'src/common/types';

export const updateRooms = () => {
  const oneUserRooms = getRoomsWithOneUser();
  const extractedRoomsData = oneUserRooms.map((room) => ({
    roomId: room.roomId,
    roomUsers: room.roomUsers.map((user) => ({ name: user.name, index: user.index })),
  }));

  sendResponseToAll(MessageType.UPDATE_ROOM, extractedRoomsData, 'rooms with one user');
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
  updateRooms();
};

export const addUserToRoom = (socketId: number, data: AddUserToRoomData) => {
  const { indexRoom } = data;
  const user = getUserBySocketId(socketId);

  if (!user) {
    throw new Error("User can't be found in the database");
  }

  pushUserToRoom(indexRoom, user);
  pruneUserFromAnotherRooms(socketId, indexRoom);
  updateRooms();
};
