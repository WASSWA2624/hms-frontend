/**
 * Availability Slot API
 * File: availability-slot.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const availabilitySlotApi = createCrudApi(endpoints.AVAILABILITY_SLOTS);

export { availabilitySlotApi };
