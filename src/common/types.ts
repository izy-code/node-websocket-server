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

export interface ShipsData {
  ships: Omit<Ship, 'undamagedParts'>[];
  gameId: string;
}

export interface AttackData {
  x: number;
  y: number;
  gameId: string;
  indexPlayer: number;
}

export interface RandomAttackData {
  gameId: string;
  indexPlayer: number;
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

export interface Ship {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
  undamagedParts: number;
}

export interface Player {
  userSocketId: number;
  ships: Ship[];
  usedCoords: Set<string>;
}

export interface Game {
  gameId: string;
  players: Player[];
  playerWithTurnId: number;
  lastStatus: 'miss' | 'killed' | 'shot' | null;
}
