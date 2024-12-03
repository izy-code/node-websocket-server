import { Winner } from '../../common/types';

const winners: Winner[] = [];

export const getWinners = () => winners;

export const pushWinners = (newWinner: Winner) => {
  const existingWinner = winners.find((winner) => winner.name === newWinner.name);

  if (existingWinner) {
    existingWinner.wins += 1;
  } else {
    winners.push(newWinner);
  }

  winners.sort((a, b) => b.wins - a.wins);
};
