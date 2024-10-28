import { getGameByPlayerId } from '../backend-server/database/gameDb';
import { backendServer } from '../backend-server';
import { MessageType } from '../common/enums';
import { WebSocketWithId } from '../common/types';

export const sendPersonalResponse = (webSocket: WebSocketWithId, type: MessageType, data: object) => {
  if (webSocket.readyState === WebSocket.OPEN) {
    const response = { type, data: JSON.stringify(data), id: 0 };

    webSocket.send(JSON.stringify(response));
    console.log(`Sent to client ${webSocket.id}: `, data);
  }
};

export const sendResponseToAll = (type: MessageType, data: object, prefix?: string) => {
  const response = { type, data: JSON.stringify(data), id: 0 };
  const stringifiedResponse = JSON.stringify(response);

  for (const webSocket of backendServer.clients) {
    if (webSocket.readyState === WebSocket.OPEN) {
      webSocket.send(stringifiedResponse);
    }
  }

  console.log(`Sent ${prefix ? prefix + ' ' : ''}to all clients: `, response);
};

export const sendResponseToPlayers = (type: MessageType, gameId: string, player1Data: object, player2Data: object) => {
  const response1 = { type, data: JSON.stringify(player1Data), id: 0 };
  const response2 = { type, data: JSON.stringify(player2Data), id: 0 };

  for (const webSocket of backendServer.clients) {
    if (webSocket.readyState === WebSocket.OPEN) {
      const wsWithId = webSocket as WebSocketWithId;
      const foundGame = getGameByPlayerId(wsWithId.id);

      if (foundGame?.gameId === gameId) {
        if (wsWithId.id === foundGame.players[0].userSocketId) {
          wsWithId.send(JSON.stringify(response1));
          console.log(`Sent to player 1 (client ${wsWithId.id}) in game ${gameId}: `, response1);
        } else if (wsWithId.id === foundGame.players[1].userSocketId) {
          wsWithId.send(JSON.stringify(response2));
          console.log(`Sent to player 2 (client ${wsWithId.id}) in game ${gameId}: `, response2);
        }
      }
    }
  }
};

export const deleteField = <T extends object, K extends keyof T>(obj: T, field: K): Omit<T, K> => {
  const objCopy = { ...obj };

  delete objCopy[field];

  return objCopy;
};

export const getRandomCoordinates = (usedCoords: Set<string>): { x: number; y: number } | null => {
  const allCoordinates = new Set<string>();

  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      allCoordinates.add(`${x},${y}`);
    }
  }

  for (const coord of usedCoords) {
    allCoordinates.delete(coord);
  }

  if (allCoordinates.size > 0) {
    const remainingCoords = Array.from(allCoordinates);
    const randomCoord = remainingCoords[Math.floor(Math.random() * remainingCoords.length)];
    const [x, y] = randomCoord.split(',').map(Number);

    return { x, y };
  }

  return null;
};
