import { sendResponseToAll } from '../../utils/utils';
import { getWinners } from '../database/winnersDb';
import { MessageType } from '../../common/enums';

export const updateWinners = () => {
  const winners = getWinners();

  sendResponseToAll(MessageType.UPDATE_WINNERS, winners, 'winners');
};
