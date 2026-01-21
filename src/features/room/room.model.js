/**
 * Room Model
 * File: room.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeRoom = (value) => normalize(value);
const normalizeRoomList = (value) => normalizeList(value);

export { normalizeRoom, normalizeRoomList };
