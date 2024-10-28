import { randomUUID } from 'node:crypto';
import { getRoomByUserSocketId } from '../database/roomDb';
import { MessageType } from '../../common/enums';
import { Game, Player } from '../../common/types';
import { addGame } from '../database/gameDb';
import { sendResponseToPlayers } from '../../utils/utils';

export const createGame = (userSocketId: number) => {
  const userRoom = getRoomByUserSocketId(userSocketId);

  if (!userRoom) {
    throw new Error("Can't create a game if you are not in room");
  }

  if (userRoom.roomUsers.length !== 2) {
    throw new Error("Game can't be created if room doesn't have 2 users");
  }

  const roomUsers = userRoom.roomUsers;
  const players: Player[] = roomUsers.map((user) => ({
    userSocketId: user.webSocketId,
    ships: [],
    usedCoords: new Set<string>(),
  }));
  const gameId = randomUUID();
  const newGame: Game = {
    gameId,
    players,
    playerWithTurnId: roomUsers[0].webSocketId,
    lastStatus: null,
  };

  addGame(newGame);

  const player1Data = { idGame: gameId, idPlayer: roomUsers[0].index };
  const player2Data = { idGame: gameId, idPlayer: roomUsers[1].index };

  sendResponseToPlayers(MessageType.CREATE_GAME, gameId, player1Data, player2Data);
};
