import { sendResponseToAll } from '../../utils/utils';
import { getWinners, pushWinners } from '../database/winnersDb';
import { MessageType } from '../../common/enums';
import { getUserBySocketId } from '../database/userDb';

export const updateWinners = () => {
  const winners = getWinners();

  sendResponseToAll(MessageType.UPDATE_WINNERS, winners, 'winners');
};

export const addWinner = (userSocketId: number) => {
  const user = getUserBySocketId(userSocketId);

  if (!user) {
    throw new Error('User not found');
  }

  const newWinner = { name: user.name, wins: 1 };

  pushWinners(newWinner);

  const winners = getWinners();

  sendResponseToAll(MessageType.UPDATE_WINNERS, winners, 'winners');
};
