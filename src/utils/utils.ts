import { MessageType } from '../common/enums';
import { WebSocketWithId } from '../common/types';

export const sendResponse = (webSocket: WebSocketWithId, type: MessageType, data: object) => {
  if (webSocket.readyState === WebSocket.OPEN) {
    const response = { type, data: JSON.stringify(data), id: 0 };

    webSocket.send(JSON.stringify(response));
    console.log(`Sent to client ${webSocket.id}: `, data);
  }
};
