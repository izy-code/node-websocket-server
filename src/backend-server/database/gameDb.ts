import { Game } from '../../common/types';

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

  if (game.players.every((player) => !player.ships.length)) {
    throw new Error('Not all players have ships');
  }
};
