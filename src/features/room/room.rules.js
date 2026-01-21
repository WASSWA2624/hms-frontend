/**
 * Room Rules
 * File: room.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseRoomId = (value) => parseId(value);
const parseRoomPayload = (value) => parsePayload(value);
const parseRoomListParams = (value) => parseListParams(value);

export { parseRoomId, parseRoomPayload, parseRoomListParams };
