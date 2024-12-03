import { User } from '../../common/types';

const users = new Map<number, User>();

export const createUser = (newUser: User) => users.set(newUser.webSocketId, newUser);

export const getUserBySocketId = (socketId: number) => users.get(socketId) || null;

export const getUserByName = (name: string) => {
  for (const user of users.values()) {
    if (user.name === name) {
      return user;
    }
  }

  return null;
};

export const replaceUserFields = (prevSocketId: number, newFields: Partial<User>) => {
  const oldUser = getUserBySocketId(prevSocketId);

  if (!oldUser) {
    return;
  }

  const updatedUser: User = { ...oldUser, ...newFields };

  users.set(updatedUser.webSocketId, updatedUser);

  if (updatedUser.webSocketId !== prevSocketId) {
    users.delete(prevSocketId);
  }
};

export const getUsersCount = () => users.size;
