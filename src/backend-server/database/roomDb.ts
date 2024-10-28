import { Room, User } from '../../common/types';

const rooms: Room[] = [];

export const createRoom = (room: Room) => rooms.push(room);

export const getRooms = () => rooms;

export const getRoomByUserSocketId = (socketId: number) =>
  rooms.find((room) => room.roomUsers.find((user) => user.webSocketId === socketId));

export const getRoomById = (roomId: string) => rooms.find((room) => room.roomId === roomId);

export const getRoomsWithOneUser = () => rooms.filter((room) => room.roomUsers.length === 1);

export const removeRoomById = (roomId: string) => {
  const removedIndex = rooms.findIndex((room) => room.roomId === roomId);

  if (removedIndex !== -1) {
    rooms.splice(removedIndex, 1);
  }
};

export const isUserInRoom = (userSocketId: number, checkedRoomId: string) => {
  const foundRoom = getRoomByUserSocketId(userSocketId);

  return foundRoom?.roomId === checkedRoomId;
};

export const pushUserToRoom = (roomId: string, user: User) => {
  const foundRoom = getRoomById(roomId);

  if (foundRoom) {
    foundRoom.roomUsers.push(user);
  }
};

export const pruneUserFromAnotherRooms = (userSocketId: number, currentRoomId: string) => {
  rooms.forEach((room) => {
    if (room.roomId !== currentRoomId && room.roomUsers.find((user) => user.webSocketId === userSocketId)) {
      removeRoomById(room.roomId);
    }
  });
};
