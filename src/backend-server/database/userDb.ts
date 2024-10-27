import { User } from '../../common/types';

const users: User[] = [];

export const createUser = (newUser: User) => users.push(newUser);

export const getUserBySocketId = (socketId: number) => users.find((user) => user.webSocketId === socketId);

export const getUserByName = (name: string) => users.find((user) => user.name === name);

export const replaceUserFields = (socketId: number, newFields: Partial<User>) => {
  const updatedUserIndex = users.findIndex((user) => user.webSocketId === socketId);

  if (updatedUserIndex === -1) {
    return;
  }

  const updatedUser: User = { ...users[updatedUserIndex], ...newFields };

  users[updatedUserIndex] = updatedUser;
};
