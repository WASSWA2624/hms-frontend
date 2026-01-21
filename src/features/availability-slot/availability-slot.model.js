/**
 * Availability Slot Model
 * File: availability-slot.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeAvailabilitySlot = (value) => normalize(value);
const normalizeAvailabilitySlotList = (value) => normalizeList(value);

export { normalizeAvailabilitySlot, normalizeAvailabilitySlotList };
