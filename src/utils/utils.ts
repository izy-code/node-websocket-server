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
