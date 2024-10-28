import { Game, Ship } from '../../common/types';
import { getUserBySocketId } from './userDb';

const games: Game[] = [];

export const addGame = (game: Game) => games.push(game);

export const getGameById = (gameId: string) => games.find((game) => game.gameId === gameId);

export const getGameByPlayerId = (userSocketId: number) =>
  games.find((game) => game.players.find((player) => player.userSocketId === userSocketId));

export const getPlayerById = (userSocketId: number, gameId: string) => {
  const foundGame = getGameById(gameId);

  return foundGame ? foundGame.players.find((player) => player.userSocketId === userSocketId) : null;
};

export const getEnemyPlayer = (userSocketId: number) => {
  const foundGame = getGameByPlayerId(userSocketId);

  if (!foundGame) {
    throw new Error('Game not found');
  }

  return foundGame.players.find((player) => player.userSocketId !== userSocketId);
};

export const checkAllPlayersHaveShips = (userSocketId: number) => {
  const game = getGameByPlayerId(userSocketId);

  if (!game) {
    throw new Error('Game not found');
  }

  if (game.players.some((player) => !player.ships.length)) {
    throw new Error('Not all players have ships');
  }
};

export const getEnemyShips = (userSocketId: number) => {
  const enemyPlayer = getEnemyPlayer(userSocketId);

  if (!enemyPlayer) {
    throw new Error('Enemy player not found');
  }

  return enemyPlayer.ships;
};

export const findShotShip = (x: number, y: number, enemyShips: Ship[]) =>
  enemyShips.find((ship) => {
    if (ship.direction) {
      return x === ship.position.x && y >= ship.position.y && y < ship.position.y + ship.length;
    } else {
      return y === ship.position.y && x >= ship.position.x && x < ship.position.x + ship.length;
    }
  });

export const getAttackStatus = (x: number, y: number, userSocketId: number) => {
  const game = getGameByPlayerId(userSocketId);
  const enemyShips = getEnemyShips(userSocketId);
  const coorsString = `${x},${y}`;

  if (!enemyShips || !game) {
    return 'miss';
  }

  const player = getPlayerById(userSocketId, game.gameId);

  if (!player || player.usedCoords.has(coorsString)) {
    return 'miss';
  }

  const shotShip = findShotShip(x, y, enemyShips);

  if (shotShip) {
    shotShip.undamagedParts = shotShip.undamagedParts - 1;
    player.usedCoords.add(coorsString);

    return shotShip.undamagedParts ? 'shot' : 'killed';
  }

  return 'miss';
};

export const getResponsesWithKillShipCoors = (ship: Ship, userSocketId: number) => {
  const responsesData = [];
  const userIndex = getUserBySocketId(userSocketId)?.index;

  for (let i = 0; i < ship.length; i++) {
    const position = ship.direction
      ? { x: ship.position.x, y: ship.position.y + i }
      : { x: ship.position.x + i, y: ship.position.y };

    responsesData.push({
      currentPlayer: userIndex,
      position,
      status: 'killed',
    });
  }

  return responsesData;
};

export const getResponsesWithMissAroundShip = (ship: Ship, userSocketId: number) => {
  const responsesData = [];
  const userIndex = getUserBySocketId(userSocketId)?.index;
  const { x, y } = ship.position;

  const isVertical = ship.direction;
  const length = ship.length;

  const xRange = [x - 1, x + (isVertical ? 1 : length)];
  const yRange = [y - 1, y + (isVertical ? length : 1)];

  for (let i = xRange[0]; i <= xRange[1]; i++) {
    for (let j = yRange[0]; j <= yRange[1]; j++) {
      if ((isVertical && i === x && j >= y && j < y + length) || (!isVertical && j === y && i >= x && i < x + length)) {
        continue;
      }

      responsesData.push({
        position: { x: i, y: j },
        currentPlayer: userIndex,
        status: 'miss',
      });
    }
  }

  return responsesData;
};
