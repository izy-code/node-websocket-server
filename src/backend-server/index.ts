import { BACKEND_PORT } from '../common/constants';
import { WebSocketWithId } from '../common/types';
import { WebSocketServer } from 'ws';
import { validateSocketMessage } from '../utils/validators';
import { commands } from './commands/commandHandlers';
import { getUserBySocketId, replaceUserFields } from './database/userDb';
import { getRoomById, getRoomByUserSocketId, removeRoomById, replaceRoomFields } from './database/roomDb';
import { updateRooms } from './operations/roomOperations';
import { getEnemyPlayer, getGameByPlayerId, removeGameById } from './database/gameDb';
import { sendResponseToPlayers } from '../utils/utils';
import { MessageType } from '../common/enums';
import { addWinner } from './operations/winnerOperations';

let currentConnectionNumber = 0;

export const backendServer = new WebSocketServer({ port: BACKEND_PORT }, () => {
  console.log(`Backend server listening on ws://localhost:${BACKEND_PORT}`);
});

backendServer.on('connection', (clientWebSocket: WebSocketWithId) => {
  const clientId = ++currentConnectionNumber;

  if (clientWebSocket.protocol) {
    clientWebSocket.id = Number(clientWebSocket.protocol);
  } else {
    clientWebSocket.id = clientId;
  }

  console.log(
    `New client with id ${clientWebSocket.id} connected. Number of connected clients: ${backendServer.clients.size}`,
  );

  clientWebSocket.on('message', function (message: string) {
    try {
      handleMessageFromClient(clientWebSocket, message);
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
    }
  });

  clientWebSocket.on('close', () => {
    try {
      handleConnectionClosed(clientWebSocket);
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
    }
  });

  clientWebSocket.on('error', console.error);
});

export const handleMessageFromClient = (clientWebSocket: WebSocketWithId, message: string) => {
  const parsedMessage = JSON.parse(message);
  const socketMessage = validateSocketMessage(parsedMessage);

  console.log(`Received from client ${clientWebSocket.id}: `, socketMessage);

  const commandHandler = commands.get(socketMessage.type);

  if (!commandHandler) {
    throw new Error(`Unknown command: ${socketMessage.type}`);
  }

  const parsedData: unknown = socketMessage.data ? JSON.parse(socketMessage.data) : '';

  commandHandler(clientWebSocket, parsedData);
};

export const handleConnectionClosed = (clientWebSocket: WebSocketWithId) => {
  console.log(`Client ${clientWebSocket.id} disconnected. Number of connected clients: ${backendServer.clients.size}`);

  replaceUserFields(clientWebSocket.id, { isOnline: false });

  const room = getRoomByUserSocketId(clientWebSocket.id);

  if (room) {
    replaceRoomFields(room.roomId, { roomUsers: room.roomUsers.filter((user) => user.index !== clientWebSocket.id) });

    if (getRoomById(room.roomId)?.roomUsers.length === 0) {
      removeRoomById(room.roomId);
    }

    updateRooms();
  }

  const game = getGameByPlayerId(clientWebSocket.id);

  if (!game) {
    return;
  }

  const winner = getEnemyPlayer(clientWebSocket.id);

  if (!winner) {
    return;
  }

  const winnerIndex = getUserBySocketId(winner.userSocketId)?.index;
  const responseData = { winPlayer: winnerIndex };

  sendResponseToPlayers(MessageType.FINISH, game.gameId, responseData, responseData);
  addWinner(winner.userSocketId);
  removeGameById(game.gameId);
};
