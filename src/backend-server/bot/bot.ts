import { MessageType } from '../../common/enums';
import { WebSocketWithId } from '../../common/types';
import { WebSocket } from 'ws';
import { handleAttackRandom } from '../commands/commandHandlers';

let currentBotId = -1;

export const createBot = () => {
  const botId = currentBotId--;
  const botWebSocket = new WebSocket('ws://localhost:3000', botId.toString()) as WebSocketWithId;

  botWebSocket.id = botId;

  botWebSocket.on('open', () => {
    console.log(`Bot ${botId} connected`);

    botWebSocket.on('message', (message: string) => {
      const parsedData = JSON.parse(message);

      console.log(`Bot ${botWebSocket.id} received: `, parsedData);

      const data = parsedData.data ? JSON.parse(parsedData.data) : null;

      if (parsedData.type === MessageType.TURN) {
        try {
          handleAttackRandom(botWebSocket, data);
        } catch {
          console.log(`Bot is waiting for it's turn`);
        }
      }

      if (parsedData.type === MessageType.FINISH) {
        botWebSocket.close();
      }
    });
  });

  botWebSocket.on('close', () => {
    console.log(`Bot ${botId} disconnected`);
  });

  botWebSocket.on('error', (error) => {
    console.error(`Bot ${botId} error: `, error);
  });

  return { botId, botWebSocket };
};
