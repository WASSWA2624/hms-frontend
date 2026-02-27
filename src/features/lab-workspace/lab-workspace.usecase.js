/**
 * Lab Workspace Use Cases
 * File: lab-workspace.usecase.js
 */
import { handleError } from '@errors';
import { labWorkspaceApi } from './lab-workspace.api';
import {
  normalizeLabLegacyResolution,
  normalizeLabWorkbenchPayload,
  normalizeLabWorkflowPayload,
} from './lab-workspace.model';
import {
  parseCollectLabOrderPayload,
  parseLabWorkbenchRouteState,
  parseLabWorkspaceId,
  parseLabWorkspaceListParams,
  parseReceiveLabSamplePayload,
  parseRejectLabSamplePayload,
  parseReleaseLabOrderItemPayload,
  parseResolveLabLegacyRouteParams,
} from './lab-workspace.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listLabWorkbench = async (params = {}) =>
  execute(async () => {
    const parsed = parseLabWorkspaceListParams(params);
    const response = await labWorkspaceApi.listWorkbench(parsed);
    return normalizeLabWorkbenchPayload(response.data);
  });

const getLabOrderWorkflow = async (id) =>
  execute(async () => {
    const parsedId = parseLabWorkspaceId(id);
    const response = await labWorkspaceApi.getOrderWorkflow(parsedId);
    return normalizeLabWorkflowPayload(response.data);
  });

const resolveLabLegacyRoute = async (resource, id) =>
  execute(async () => {
    const parsed = parseResolveLabLegacyRouteParams({ resource, id });
    const response = await labWorkspaceApi.resolveLegacyRoute(
      parsed.resource,
      parsed.id
    );
    return normalizeLabLegacyResolution(response.data);
  });

const collectLabOrder = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseLabWorkspaceId(id);
    const parsedPayload = parseCollectLabOrderPayload(payload);
    const response = await labWorkspaceApi.collectOrder(parsedId, parsedPayload);
    return {
      workflow: normalizeLabWorkflowPayload(response.data?.workflow),
    };
  });

const receiveLabSample = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseLabWorkspaceId(id);
    const parsedPayload = parseReceiveLabSamplePayload(payload);
    const response = await labWorkspaceApi.receiveSample(parsedId, parsedPayload);
    return {
      workflow: normalizeLabWorkflowPayload(response.data?.workflow),
    };
  });

const rejectLabSample = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseLabWorkspaceId(id);
    const parsedPayload = parseRejectLabSamplePayload(payload);
    const response = await labWorkspaceApi.rejectSample(parsedId, parsedPayload);
    return {
      workflow: normalizeLabWorkflowPayload(response.data?.workflow),
    };
  });

const releaseLabOrderItem = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseLabWorkspaceId(id);
    const parsedPayload = parseReleaseLabOrderItemPayload(payload);
    const response = await labWorkspaceApi.releaseOrderItem(parsedId, parsedPayload);
    return {
      workflow: normalizeLabWorkflowPayload(response.data?.workflow),
      released_result: response.data?.released_result || null,
    };
  });

export {
  listLabWorkbench,
  getLabOrderWorkflow,
  resolveLabLegacyRoute,
  collectLabOrder,
  receiveLabSample,
  rejectLabSample,
  releaseLabOrderItem,
  parseLabWorkbenchRouteState,
};
