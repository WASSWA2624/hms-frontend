import { handleError } from '@errors';
import { radiologyWorkspaceApi } from './radiology-workspace.api';
import {
  normalizeRadiologyLegacyResolution,
  normalizeRadiologyWorkbenchPayload,
  normalizeRadiologyWorkflowPayload,
} from './radiology-workspace.model';
import {
  parseRadiologyWorkspaceListParams,
  parseRadiologyWorkspaceId,
  parseResolveRadiologyLegacyRouteParams,
  parseRadiologyWorkbenchRouteState,
  parseAssignRadiologyOrderPayload,
  parseStartRadiologyOrderPayload,
  parseCompleteRadiologyOrderPayload,
  parseCancelRadiologyOrderPayload,
  parseCreateRadiologyStudyPayload,
  parseInitUploadPayload,
  parseCommitUploadPayload,
  parseSyncStudyPayload,
  parseDraftResultPayload,
  parseFinalizeResultPayload,
  parseAddendumResultPayload,
} from './radiology-workspace.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listRadiologyWorkbench = async (params = {}) =>
  execute(async () => {
    const parsed = parseRadiologyWorkspaceListParams(params);
    const response = await radiologyWorkspaceApi.listWorkbench(parsed);
    return normalizeRadiologyWorkbenchPayload(response.data);
  });

const getRadiologyOrderWorkflow = async (id) =>
  execute(async () => {
    const parsedId = parseRadiologyWorkspaceId(id);
    const response = await radiologyWorkspaceApi.getOrderWorkflow(parsedId);
    return normalizeRadiologyWorkflowPayload(response.data);
  });

const resolveRadiologyLegacyRoute = async (resource, id) =>
  execute(async () => {
    const parsed = parseResolveRadiologyLegacyRouteParams({ resource, id });
    const response = await radiologyWorkspaceApi.resolveLegacyRoute(
      parsed.resource,
      parsed.id
    );
    return normalizeRadiologyLegacyResolution(response.data);
  });

const assignRadiologyOrder = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseRadiologyWorkspaceId(id);
    const parsedPayload = parseAssignRadiologyOrderPayload(payload);
    const response = await radiologyWorkspaceApi.assignOrder(parsedId, parsedPayload);
    return {
      workflow: normalizeRadiologyWorkflowPayload(response.data?.workflow),
      assignment: response.data?.assignment || null,
    };
  });

const startRadiologyOrder = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseRadiologyWorkspaceId(id);
    const parsedPayload = parseStartRadiologyOrderPayload(payload);
    const response = await radiologyWorkspaceApi.startOrder(parsedId, parsedPayload);
    return {
      workflow: normalizeRadiologyWorkflowPayload(response.data?.workflow),
    };
  });

const completeRadiologyOrder = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseRadiologyWorkspaceId(id);
    const parsedPayload = parseCompleteRadiologyOrderPayload(payload);
    const response = await radiologyWorkspaceApi.completeOrder(parsedId, parsedPayload);
    return {
      workflow: normalizeRadiologyWorkflowPayload(response.data?.workflow),
    };
  });

const cancelRadiologyOrder = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseRadiologyWorkspaceId(id);
    const parsedPayload = parseCancelRadiologyOrderPayload(payload);
    const response = await radiologyWorkspaceApi.cancelOrder(parsedId, parsedPayload);
    return {
      workflow: normalizeRadiologyWorkflowPayload(response.data?.workflow),
    };
  });

const createRadiologyStudy = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseRadiologyWorkspaceId(id);
    const parsedPayload = parseCreateRadiologyStudyPayload(payload);
    const response = await radiologyWorkspaceApi.createStudy(parsedId, parsedPayload);
    return {
      workflow: normalizeRadiologyWorkflowPayload(response.data?.workflow),
      study: response.data?.study || null,
    };
  });

const initStudyAssetUpload = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseRadiologyWorkspaceId(id);
    const parsedPayload = parseInitUploadPayload(payload);
    const response = await radiologyWorkspaceApi.initAssetUpload(parsedId, parsedPayload);
    return response.data || null;
  });

const commitStudyAssetUpload = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseRadiologyWorkspaceId(id);
    const parsedPayload = parseCommitUploadPayload(payload);
    const response = await radiologyWorkspaceApi.commitAssetUpload(parsedId, parsedPayload);
    return {
      workflow: normalizeRadiologyWorkflowPayload(response.data?.workflow),
      asset: response.data?.asset || null,
    };
  });

const syncRadiologyStudy = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseRadiologyWorkspaceId(id);
    const parsedPayload = parseSyncStudyPayload(payload);
    const response = await radiologyWorkspaceApi.syncStudyToPacs(parsedId, parsedPayload);
    return {
      workflow: normalizeRadiologyWorkflowPayload(response.data?.workflow),
      sync_status: response.data?.sync_status || null,
      pacs_link: response.data?.pacs_link || null,
      error: response.data?.error || null,
      response: response.data?.response || null,
    };
  });

const draftRadiologyResult = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseRadiologyWorkspaceId(id);
    const parsedPayload = parseDraftResultPayload(payload);
    const response = await radiologyWorkspaceApi.draftResult(parsedId, parsedPayload);
    return {
      workflow: normalizeRadiologyWorkflowPayload(response.data?.workflow),
      result: response.data?.result || null,
    };
  });

const finalizeRadiologyResult = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseRadiologyWorkspaceId(id);
    const parsedPayload = parseFinalizeResultPayload(payload);
    const response = await radiologyWorkspaceApi.finalizeResult(parsedId, parsedPayload);
    return {
      workflow: normalizeRadiologyWorkflowPayload(response.data?.workflow),
      result: response.data?.result || null,
    };
  });

const addendumRadiologyResult = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseRadiologyWorkspaceId(id);
    const parsedPayload = parseAddendumResultPayload(payload);
    const response = await radiologyWorkspaceApi.addendumResult(parsedId, parsedPayload);
    return {
      workflow: normalizeRadiologyWorkflowPayload(response.data?.workflow),
      result: response.data?.result || null,
    };
  });

export {
  listRadiologyWorkbench,
  getRadiologyOrderWorkflow,
  resolveRadiologyLegacyRoute,
  assignRadiologyOrder,
  startRadiologyOrder,
  completeRadiologyOrder,
  cancelRadiologyOrder,
  createRadiologyStudy,
  initStudyAssetUpload,
  commitStudyAssetUpload,
  syncRadiologyStudy,
  draftRadiologyResult,
  finalizeRadiologyResult,
  addendumRadiologyResult,
  parseRadiologyWorkbenchRouteState,
};
