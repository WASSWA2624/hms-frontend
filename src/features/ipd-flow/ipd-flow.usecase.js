/**
 * IPD Flow Use Cases
 * File: ipd-flow.usecase.js
 */
import { handleError } from '@errors';
import { ipdFlowApi } from './ipd-flow.api';
import {
  normalizeIpdFlowList,
  normalizeIpdFlowSnapshot,
  normalizeIpdLegacyResolution,
} from './ipd-flow.model';
import {
  parseAddMedicationAdministrationPayload,
  parseAddNursingNotePayload,
  parseAddWardRoundPayload,
  parseAssignBedPayload,
  parseFinalizeDischargePayload,
  parseIpdFlowId,
  parseIpdFlowListParams,
  parseResolveLegacyRouteParams,
  parsePlanDischargePayload,
  parseReleaseBedPayload,
  parseRequestTransferPayload,
  parseStartIpdFlowPayload,
  parseUpdateTransferPayload,
} from './ipd-flow.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listIpdFlows = async (params = {}) =>
  execute(async () => {
    const parsed = parseIpdFlowListParams(params);
    const response = await ipdFlowApi.list(parsed);
    return normalizeIpdFlowList(response.data);
  });

const getIpdFlow = async (id) =>
  execute(async () => {
    const parsedId = parseIpdFlowId(id);
    const response = await ipdFlowApi.get(parsedId);
    return normalizeIpdFlowSnapshot(response.data);
  });

const resolveIpdLegacyRoute = async (resource, id) =>
  execute(async () => {
    const parsed = parseResolveLegacyRouteParams({ resource, id });
    const response = await ipdFlowApi.resolveLegacyRoute(parsed.resource, parsed.id);
    return normalizeIpdLegacyResolution(response.data);
  });

const startIpdFlow = async (payload = {}) =>
  execute(async () => {
    const parsed = parseStartIpdFlowPayload(payload);
    const response = await ipdFlowApi.start(parsed);
    return normalizeIpdFlowSnapshot(response.data);
  });

const assignBed = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseIpdFlowId(id);
    const parsed = parseAssignBedPayload(payload);
    const response = await ipdFlowApi.assignBed(parsedId, parsed);
    return normalizeIpdFlowSnapshot(response.data);
  });

const releaseBed = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseIpdFlowId(id);
    const parsed = parseReleaseBedPayload(payload);
    const response = await ipdFlowApi.releaseBed(parsedId, parsed);
    return normalizeIpdFlowSnapshot(response.data);
  });

const requestTransfer = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseIpdFlowId(id);
    const parsed = parseRequestTransferPayload(payload);
    const response = await ipdFlowApi.requestTransfer(parsedId, parsed);
    return normalizeIpdFlowSnapshot(response.data);
  });

const updateTransfer = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseIpdFlowId(id);
    const parsed = parseUpdateTransferPayload(payload);
    const response = await ipdFlowApi.updateTransfer(parsedId, parsed);
    return normalizeIpdFlowSnapshot(response.data);
  });

const addWardRound = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseIpdFlowId(id);
    const parsed = parseAddWardRoundPayload(payload);
    const response = await ipdFlowApi.addWardRound(parsedId, parsed);
    return normalizeIpdFlowSnapshot(response.data);
  });

const addNursingNote = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseIpdFlowId(id);
    const parsed = parseAddNursingNotePayload(payload);
    const response = await ipdFlowApi.addNursingNote(parsedId, parsed);
    return normalizeIpdFlowSnapshot(response.data);
  });

const addMedicationAdministration = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseIpdFlowId(id);
    const parsed = parseAddMedicationAdministrationPayload(payload);
    const response = await ipdFlowApi.addMedicationAdministration(parsedId, parsed);
    return normalizeIpdFlowSnapshot(response.data);
  });

const planDischarge = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseIpdFlowId(id);
    const parsed = parsePlanDischargePayload(payload);
    const response = await ipdFlowApi.planDischarge(parsedId, parsed);
    return normalizeIpdFlowSnapshot(response.data);
  });

const finalizeDischarge = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseIpdFlowId(id);
    const parsed = parseFinalizeDischargePayload(payload);
    const response = await ipdFlowApi.finalizeDischarge(parsedId, parsed);
    return normalizeIpdFlowSnapshot(response.data);
  });

export {
  listIpdFlows,
  getIpdFlow,
  resolveIpdLegacyRoute,
  startIpdFlow,
  assignBed,
  releaseBed,
  requestTransfer,
  updateTransfer,
  addWardRound,
  addNursingNote,
  addMedicationAdministration,
  planDischarge,
  finalizeDischarge,
};
