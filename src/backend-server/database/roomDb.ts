import { Room } from '../../common/types';

const rooms: Room[] = [];

export const createRoom = (room: Room) => rooms.push(room);

export const getRooms = () => rooms;

export const getRoomByUserSocketId = (socketId: number) =>
  rooms.find((room) => room.roomUsers.find((user) => user.webSocketId === socketId));
