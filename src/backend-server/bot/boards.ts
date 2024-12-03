import { Ship } from '../../common/types';

const board1: Omit<Ship, 'undamagedParts'>[] = [
  { position: { x: 8, y: 1 }, direction: true, type: 'huge', length: 4 },
  { position: { x: 7, y: 6 }, direction: true, type: 'large', length: 3 },
  { position: { x: 1, y: 6 }, direction: true, type: 'large', length: 3 },
  { position: { x: 0, y: 1 }, direction: false, type: 'medium', length: 2 },
  { position: { x: 9, y: 7 }, direction: true, type: 'medium', length: 2 },
  { position: { x: 4, y: 1 }, direction: false, type: 'medium', length: 2 },
  { position: { x: 5, y: 4 }, direction: false, type: 'small', length: 1 },
  { position: { x: 3, y: 8 }, direction: false, type: 'small', length: 1 },
  { position: { x: 1, y: 4 }, direction: false, type: 'small', length: 1 },
  { position: { x: 5, y: 7 }, direction: false, type: 'small', length: 1 },
];

const board2: Omit<Ship, 'undamagedParts'>[] = [
  { position: { x: 4, y: 5 }, direction: false, type: 'huge', length: 4 },
  { position: { x: 4, y: 0 }, direction: true, type: 'large', length: 3 },
  { position: { x: 8, y: 0 }, direction: true, type: 'large', length: 3 },
  { position: { x: 6, y: 8 }, direction: false, type: 'medium', length: 2 },
  { position: { x: 0, y: 1 }, direction: false, type: 'medium', length: 2 },
  { position: { x: 0, y: 3 }, direction: false, type: 'medium', length: 2 },
  { position: { x: 2, y: 5 }, direction: true, type: 'small', length: 1 },
  { position: { x: 4, y: 7 }, direction: true, type: 'small', length: 1 },
  { position: { x: 1, y: 8 }, direction: true, type: 'small', length: 1 },
  { position: { x: 3, y: 9 }, direction: true, type: 'small', length: 1 },
];

const board3: Omit<Ship, 'undamagedParts'>[] = [
  { position: { x: 1, y: 4 }, direction: true, type: 'huge', length: 4 },
  { position: { x: 3, y: 3 }, direction: false, type: 'large', length: 3 },
  { position: { x: 6, y: 5 }, direction: true, type: 'large', length: 3 },
  { position: { x: 4, y: 0 }, direction: true, type: 'medium', length: 2 },
  { position: { x: 0, y: 1 }, direction: false, type: 'medium', length: 2 },
  { position: { x: 8, y: 1 }, direction: true, type: 'medium', length: 2 },
  { position: { x: 6, y: 0 }, direction: false, type: 'small', length: 1 },
  { position: { x: 3, y: 5 }, direction: false, type: 'small', length: 1 },
  { position: { x: 5, y: 9 }, direction: true, type: 'small', length: 1 },
  { position: { x: 8, y: 5 }, direction: false, type: 'small', length: 1 },
];

const boards = [board1, board2, board3];

export const getBotBoard = () => {
  const randomIndex = Math.floor(Math.random() * boards.length);
  return boards[randomIndex];
};
