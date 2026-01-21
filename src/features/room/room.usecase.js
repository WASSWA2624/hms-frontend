/**
 * Room Use Cases
 * File: room.usecase.js
 */
import { endpoints } from '@config/endpoints';
import { handleError } from '@errors';
import { queueRequestIfOffline } from '@offline/request';
import { roomApi } from './room.api';
import { normalizeRoom, normalizeRoomList } from './room.model';
import { parseRoomId, parseRoomListParams, parseRoomPayload } from './room.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listRooms = async (params = {}) =>
  execute(async () => {
    const parsed = parseRoomListParams(params);
    const response = await roomApi.list(parsed);
    return normalizeRoomList(response.data);
  });

const getRoom = async (id) =>
  execute(async () => {
    const parsedId = parseRoomId(id);
    const response = await roomApi.get(parsedId);
    return normalizeRoom(response.data);
  });

const createRoom = async (payload) =>
  execute(async () => {
    const parsed = parseRoomPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.ROOMS.CREATE,
      method: 'POST',
      body: parsed,
    });
    if (queued) {
      return normalizeRoom(parsed);
    }
    const response = await roomApi.create(parsed);
    return normalizeRoom(response.data);
  });

const updateRoom = async (id, payload) =>
  execute(async () => {
    const parsedId = parseRoomId(id);
    const parsed = parseRoomPayload(payload);
    const queued = await queueRequestIfOffline({
      url: endpoints.ROOMS.UPDATE(parsedId),
      method: 'PUT',
      body: parsed,
    });
    if (queued) {
      return normalizeRoom({ id: parsedId, ...parsed });
    }
    const response = await roomApi.update(parsedId, parsed);
    return normalizeRoom(response.data);
  });

const deleteRoom = async (id) =>
  execute(async () => {
    const parsedId = parseRoomId(id);
    const queued = await queueRequestIfOffline({
      url: endpoints.ROOMS.DELETE(parsedId),
      method: 'DELETE',
    });
    if (queued) {
      return normalizeRoom({ id: parsedId });
    }
    const response = await roomApi.remove(parsedId);
    return normalizeRoom(response.data);
  });

export { listRooms, getRoom, createRoom, updateRoom, deleteRoom };
