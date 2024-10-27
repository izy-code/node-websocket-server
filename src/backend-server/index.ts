import { BACKEND_PORT } from '../common/constants';
import { WebSocketWithId } from '../common/types';
import { WebSocketServer } from 'ws';
import { validateSocketMessage } from '../utils/validators';
import { commands } from './commands/commandHandlers';

let currentConnectionNumber = 0;

export const backendServer = new WebSocketServer({ port: BACKEND_PORT }, () => {
  console.log(`Backend server listening on ws://localhost:${BACKEND_PORT}`);
});

backendServer.on('connection', (clientWebSocket: WebSocketWithId) => {
  clientWebSocket.id = ++currentConnectionNumber;

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
    console.log(
      `Client ${clientWebSocket.id} closed the connection. Number of connected clients: ${backendServer.clients.size}`,
    );
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

  const parsedData: unknown = JSON.parse(socketMessage.data);

  commandHandler(clientWebSocket, parsedData);
};
