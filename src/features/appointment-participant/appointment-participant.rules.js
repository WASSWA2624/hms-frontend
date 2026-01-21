/**
 * Appointment Participant Rules
 * File: appointment-participant.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseAppointmentParticipantId = (value) => parseId(value);
const parseAppointmentParticipantPayload = (value) => parsePayload(value);
const parseAppointmentParticipantListParams = (value) => parseListParams(value);

export {
  parseAppointmentParticipantId,
  parseAppointmentParticipantPayload,
  parseAppointmentParticipantListParams,
};
