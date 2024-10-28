import { WebSocket } from 'ws';
import { MessageType } from './enums';

export interface WebSocketWithId extends WebSocket {
  id: number;
}

export interface SocketMessage {
  type: MessageType;
  data: string;
  id: number;
}

export interface RegistrationData {
  name: string;
  password: string;
}

export interface AddUserToRoomData {
  indexRoom: string;
}

export interface User {
  index: number;
  name: string;
  password: string;
  webSocketId: number;
  isOnline: boolean;
}

export interface Room {
  roomId: string;
  roomUsers: User[];
}

export interface Winner {
  name: string;
  wins: number;
}
