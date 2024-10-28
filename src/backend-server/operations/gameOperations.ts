import { randomUUID } from 'node:crypto';
import { getRoomByUserSocketId } from '../database/roomDb';
import { MessageType } from '../../common/enums';
import { AttackData, Game, Player, RandomAttackData, ShipsData } from '../../common/types';
import {
  addGame,
  findShotShip,
  getAttackStatus,
  getEnemyPlayer,
  getEnemyShips,
  getGameByPlayerId,
  getPlayerById,
  getResponsesWithMissAroundShip,
  getResponsesWithKillShipCoors,
  getWinnerIfExists,
  removeGameById,
} from '../database/gameDb';
import { deleteField, getRandomCoordinates, sendResponseToPlayers } from '../../utils/utils';
import { getUserBySocketId } from '../database/userDb';
import { addWinner } from './winnerOperations';

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
  const newGame: Game = { gameId, players, playerWithTurnId: roomUsers[0].webSocketId, lastStatus: null };

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

export const checkPlayerTurn = (userSocketId: number) => {
  const foundGame = getGameByPlayerId(userSocketId);

  if (foundGame?.playerWithTurnId !== userSocketId) {
    throw new Error(`Client ${userSocketId} tried to attack on wrong turn`);
  }
};

export const attack = (data: AttackData | RandomAttackData, userSocketId: number) => {
  const { indexPlayer = userSocketId } = data;
  const game = getGameByPlayerId(userSocketId);
  const enemyShips = getEnemyShips(userSocketId);
  let { x, y } = data as AttackData;

  if (!enemyShips || !game) {
    throw new Error('Game or enemy ships not found');
  }

  const player = getPlayerById(userSocketId, game.gameId);

  if (x === undefined && y === undefined && player) {
    const randomCoords = getRandomCoordinates(player.usedCoords);

    if (!randomCoords) {
      return;
    }

    x = randomCoords.x;
    y = randomCoords.y;
  }

  const attackStatus = getAttackStatus(x, y, userSocketId);
  const shotShip = findShotShip(x, y, enemyShips);

  if (shotShip && attackStatus === 'killed') {
    getResponsesWithKillShipCoors(shotShip, userSocketId).forEach((responseData) => {
      sendResponseToPlayers(MessageType.ATTACK, game.gameId, responseData, responseData);
    });
    getResponsesWithMissAroundShip(shotShip, userSocketId).forEach((responseData) => {
      sendResponseToPlayers(MessageType.ATTACK, game.gameId, responseData, responseData);
    });
  }

  game.lastStatus = attackStatus;

  const responseData = { position: { x, y }, currentPlayer: indexPlayer, status: attackStatus };

  sendResponseToPlayers(MessageType.ATTACK, game.gameId, responseData, responseData);
};

export const checkGameEnd = (data: AttackData | RandomAttackData, userSocketId: number) => {
  const gameId = getGameByPlayerId(userSocketId)?.gameId;

  if (!gameId) {
    return false;
  }

  const winner = getWinnerIfExists(gameId, userSocketId);

  if (!winner) {
    return false;
  }

  const winnerIndex = getUserBySocketId(winner.userSocketId)?.index;
  const responseData = { winPlayer: winnerIndex };

  sendResponseToPlayers(MessageType.FINISH, gameId, responseData, responseData);
  addWinner(userSocketId);
  removeGameById(gameId);

  return true;
};
