import { randomUUID } from 'node:crypto';
import { getRoomByUserSocketId } from '../database/roomDb';
import { MessageType } from '../../common/enums';
import { Game, Player, ShipsData } from '../../common/types';
import { addGame, getEnemyPlayer, getGameByPlayerId, getPlayerById } from '../database/gameDb';
import { deleteField, sendResponseToPlayers } from '../../utils/utils';
import { getUserBySocketId } from '../database/userDb';

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

export const initPlayerShips = (data: ShipsData, userSocketId: number) => {
  const { ships, gameId } = data;
  const player = getPlayerById(userSocketId, gameId);

  if (!player) {
    return;
  }

  const shipsWithUndamagedParts = ships.map((ship) => ({ ...ship, undamagedParts: ship.length }));

  player.ships = shipsWithUndamagedParts;
};

export const startGame = (userSocketId: number) => {
  const game = getGameByPlayerId(userSocketId);

  if (!game) {
    throw new Error('Game not found');
  }

  const player1Index = getUserBySocketId(game.players[0].userSocketId)?.index;
  const player1PureShipsData = game.players[0].ships.map((ship) => deleteField(ship, 'undamagedParts'));
  const player1Data = { ships: player1PureShipsData, currentPlayerIndex: player1Index };

  const player2Index = getUserBySocketId(game.players[1].userSocketId)?.index;
  const player2PureShipsData = game.players[1].ships.map((ship) => deleteField(ship, 'undamagedParts'));
  const player2Data = { ships: player2PureShipsData, currentPlayerIndex: player2Index };

  sendResponseToPlayers(MessageType.START_GAME, game.gameId, player1Data, player2Data);
  alternateTurn(userSocketId);
};

export const alternateTurn = (userSocketId: number) => {
  const enemyPlayer = getEnemyPlayer(userSocketId);
  const game = getGameByPlayerId(userSocketId);

  if (!game || !enemyPlayer) {
    throw new Error('Game or enemy player not found');
  }

  const lastStatus = game.lastStatus;

  game.playerWithTurnId = lastStatus === 'miss' ? enemyPlayer?.userSocketId : userSocketId;

  const playerWithTurnIndex = getUserBySocketId(game.playerWithTurnId)?.index;

  sendResponseToPlayers(
    MessageType.TURN,
    game.gameId,
    { currentPlayer: playerWithTurnIndex },
    { currentPlayer: playerWithTurnIndex },
  );
};
