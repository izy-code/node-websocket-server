import { Game } from '../../common/types';

const games: Game[] = [];

export const addGame = (game: Game) => games.push(game);

export const getGameByPlayerId = (userSocketId: number) =>
  games.find((game) => game.players.find((player) => player.userSocketId === userSocketId));
