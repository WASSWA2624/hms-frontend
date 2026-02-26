/**
 * Theatre Flow Use Cases
 * File: theatre-flow.usecase.js
 */
import { handleError } from '@errors';
import { theatreFlowApi } from './theatre-flow.api';
import {
  normalizeTheatreFlowList,
  normalizeTheatreFlowSnapshot,
  normalizeTheatreLegacyResolution,
} from './theatre-flow.model';
import {
  parseAddAnesthesiaObservationPayload,
  parseAssignResourcePayload,
  parseFinalizeRecordPayload,
  parseGetTheatreFlowParams,
  parseReopenRecordPayload,
  parseReleaseResourcePayload,
  parseResolveTheatreLegacyRouteParams,
  parseStartTheatreFlowPayload,
  parseTheatreFlowId,
  parseTheatreFlowListParams,
  parseToggleChecklistItemPayload,
  parseUpdateStagePayload,
  parseUpsertAnesthesiaRecordPayload,
  parseUpsertPostOpNotePayload,
} from './theatre-flow.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listTheatreFlows = async (params = {}) =>
  execute(async () => {
    const parsed = parseTheatreFlowListParams(params);
    const response = await theatreFlowApi.list(parsed);
    return normalizeTheatreFlowList(response.data);
  });

const getTheatreFlow = async (id, params = {}) =>
  execute(async () => {
    const parsedId = parseTheatreFlowId(id);
    const parsedParams = parseGetTheatreFlowParams(params);
    const response = await theatreFlowApi.get(parsedId, parsedParams);
    return normalizeTheatreFlowSnapshot(response.data);
  });

const resolveTheatreLegacyRoute = async (resource, id) =>
  execute(async () => {
    const parsed = parseResolveTheatreLegacyRouteParams({ resource, id });
    const response = await theatreFlowApi.resolveLegacyRoute(
      parsed.resource,
      parsed.id
    );
    return normalizeTheatreLegacyResolution(response.data);
  });

const startTheatreFlow = async (payload = {}) =>
  execute(async () => {
    const parsed = parseStartTheatreFlowPayload(payload);
    const response = await theatreFlowApi.start(parsed);
    return normalizeTheatreFlowSnapshot(response.data);
  });

const updateTheatreStage = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseTheatreFlowId(id);
    const parsed = parseUpdateStagePayload(payload);
    const response = await theatreFlowApi.updateStage(parsedId, parsed);
    return normalizeTheatreFlowSnapshot(response.data);
  });

const upsertTheatreAnesthesiaRecord = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseTheatreFlowId(id);
    const parsed = parseUpsertAnesthesiaRecordPayload(payload);
    const response = await theatreFlowApi.upsertAnesthesiaRecord(parsedId, parsed);
    return normalizeTheatreFlowSnapshot(response.data);
  });

const addTheatreAnesthesiaObservation = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseTheatreFlowId(id);
    const parsed = parseAddAnesthesiaObservationPayload(payload);
    const response = await theatreFlowApi.addAnesthesiaObservation(parsedId, parsed);
    return normalizeTheatreFlowSnapshot(response.data);
  });

const upsertTheatrePostOpNote = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseTheatreFlowId(id);
    const parsed = parseUpsertPostOpNotePayload(payload);
    const response = await theatreFlowApi.upsertPostOpNote(parsedId, parsed);
    return normalizeTheatreFlowSnapshot(response.data);
  });

const toggleTheatreChecklistItem = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseTheatreFlowId(id);
    const parsed = parseToggleChecklistItemPayload(payload);
    const response = await theatreFlowApi.toggleChecklistItem(parsedId, parsed);
    return normalizeTheatreFlowSnapshot(response.data);
  });

const assignTheatreResource = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseTheatreFlowId(id);
    const parsed = parseAssignResourcePayload(payload);
    const response = await theatreFlowApi.assignResource(parsedId, parsed);
    return normalizeTheatreFlowSnapshot(response.data);
  });

const releaseTheatreResource = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseTheatreFlowId(id);
    const parsed = parseReleaseResourcePayload(payload);
    const response = await theatreFlowApi.releaseResource(parsedId, parsed);
    return normalizeTheatreFlowSnapshot(response.data);
  });

const finalizeTheatreRecord = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseTheatreFlowId(id);
    const parsed = parseFinalizeRecordPayload(payload);
    const response = await theatreFlowApi.finalizeRecord(parsedId, parsed);
    return normalizeTheatreFlowSnapshot(response.data);
  });

const reopenTheatreRecord = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseTheatreFlowId(id);
    const parsed = parseReopenRecordPayload(payload);
    const response = await theatreFlowApi.reopenRecord(parsedId, parsed);
    return normalizeTheatreFlowSnapshot(response.data);
  });

export {
  listTheatreFlows,
  getTheatreFlow,
  resolveTheatreLegacyRoute,
  startTheatreFlow,
  updateTheatreStage,
  upsertTheatreAnesthesiaRecord,
  addTheatreAnesthesiaObservation,
  upsertTheatrePostOpNote,
  toggleTheatreChecklistItem,
  assignTheatreResource,
  releaseTheatreResource,
  finalizeTheatreRecord,
  reopenTheatreRecord,
};
