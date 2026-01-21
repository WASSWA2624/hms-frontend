/**
 * Room Usecase Tests
 * File: room.usecase.test.js
 */
import { listRooms, getRoom, createRoom, updateRoom, deleteRoom } from '@features/room';
import { roomApi } from '@features/room/room.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/room/room.api', () => ({
  roomApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('room.usecase', () => {
  beforeEach(() => {
    roomApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    roomApi.get.mockResolvedValue({ data: { id: '1' } });
    roomApi.create.mockResolvedValue({ data: { id: '1' } });
    roomApi.update.mockResolvedValue({ data: { id: '1' } });
    roomApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listRooms,
      get: getRoom,
      create: createRoom,
      update: updateRoom,
      remove: deleteRoom,
    },
    { queueRequestIfOffline }
  );
});
