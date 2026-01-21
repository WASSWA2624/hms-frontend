/**
 * Availability Slot Rules
 * File: availability-slot.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseAvailabilitySlotId = (value) => parseId(value);
const parseAvailabilitySlotPayload = (value) => parsePayload(value);
const parseAvailabilitySlotListParams = (value) => parseListParams(value);

export { parseAvailabilitySlotId, parseAvailabilitySlotPayload, parseAvailabilitySlotListParams };
