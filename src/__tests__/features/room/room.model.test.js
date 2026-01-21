/**
 * Room Model Tests
 * File: room.model.test.js
 */
import { normalizeRoom, normalizeRoomList } from '@features/room';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('room.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeRoom, normalizeRoomList);
  });
});
