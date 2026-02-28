import { handleError } from '@errors';
import { hrWorkspaceApi } from './hr-workspace.api';
import {
  normalizeWorkspacePayload,
  normalizeWorkItemsPayload,
  normalizeRosterWorkflowPayload,
  normalizeRosterGeneratePayload,
  normalizeRosterPublishPayload,
  normalizeOverridePayload,
  normalizeSwapMutationPayload,
  normalizeLeaveMutationPayload,
  normalizePayrollPreviewPayload,
  normalizePayrollProcessPayload,
  normalizeHrLegacyResolution,
} from './hr-workspace.model';
import {
  parseHrWorkspaceIdentifier,
  parseHrWorkspaceListParams,
  parseHrWorkItemsParams,
  parseHrPayrollPreviewParams,
  parseHrResolveLegacyParams,
  parseHrRosterGeneratePayload,
  parseHrRosterPublishPayload,
  parseHrShiftOverridePayload,
  parseHrSwapApprovePayload,
  parseHrSwapRejectPayload,
  parseHrLeaveApprovePayload,
  parseHrLeaveRejectPayload,
  parseHrPayrollProcessPayload,
  parseHrWorkbenchRouteState,
} from './hr-workspace.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listHrWorkspace = async (params = {}) =>
  execute(async () => {
    const parsed = parseHrWorkspaceListParams(params);
    const response = await hrWorkspaceApi.listWorkspace(parsed);
    return normalizeWorkspacePayload(response.data);
  });

const listHrWorkItems = async (params = {}) =>
  execute(async () => {
    const parsed = parseHrWorkItemsParams(params);
    const response = await hrWorkspaceApi.listWorkItems(parsed);
    return normalizeWorkItemsPayload(response.data);
  });

const getHrRosterWorkflow = async (rosterIdentifier) =>
  execute(async () => {
    const parsedId = parseHrWorkspaceIdentifier(rosterIdentifier);
    const response = await hrWorkspaceApi.getRosterWorkflow(parsedId);
    return normalizeRosterWorkflowPayload(response.data);
  });

const generateHrRoster = async (rosterIdentifier, payload = {}) =>
  execute(async () => {
    const parsedId = parseHrWorkspaceIdentifier(rosterIdentifier);
    const parsedPayload = parseHrRosterGeneratePayload(payload);
    const response = await hrWorkspaceApi.generateRoster(parsedId, parsedPayload);
    return normalizeRosterGeneratePayload(response.data);
  });

const publishHrRoster = async (rosterIdentifier, payload = {}) =>
  execute(async () => {
    const parsedId = parseHrWorkspaceIdentifier(rosterIdentifier);
    const parsedPayload = parseHrRosterPublishPayload(payload);
    const response = await hrWorkspaceApi.publishRoster(parsedId, parsedPayload);
    return normalizeRosterPublishPayload(response.data);
  });

const overrideHrShift = async (shiftIdentifier, payload = {}) =>
  execute(async () => {
    const parsedId = parseHrWorkspaceIdentifier(shiftIdentifier);
    const parsedPayload = parseHrShiftOverridePayload(payload);
    const response = await hrWorkspaceApi.overrideShift(parsedId, parsedPayload);
    return normalizeOverridePayload(response.data);
  });

const approveHrSwap = async (swapIdentifier, payload = {}) =>
  execute(async () => {
    const parsedId = parseHrWorkspaceIdentifier(swapIdentifier);
    const parsedPayload = parseHrSwapApprovePayload(payload);
    const response = await hrWorkspaceApi.approveSwap(parsedId, parsedPayload);
    return normalizeSwapMutationPayload(response.data);
  });

const rejectHrSwap = async (swapIdentifier, payload = {}) =>
  execute(async () => {
    const parsedId = parseHrWorkspaceIdentifier(swapIdentifier);
    const parsedPayload = parseHrSwapRejectPayload(payload);
    const response = await hrWorkspaceApi.rejectSwap(parsedId, parsedPayload);
    return normalizeSwapMutationPayload(response.data);
  });

const approveHrLeave = async (leaveIdentifier, payload = {}) =>
  execute(async () => {
    const parsedId = parseHrWorkspaceIdentifier(leaveIdentifier);
    const parsedPayload = parseHrLeaveApprovePayload(payload);
    const response = await hrWorkspaceApi.approveLeave(parsedId, parsedPayload);
    return normalizeLeaveMutationPayload(response.data);
  });

const rejectHrLeave = async (leaveIdentifier, payload = {}) =>
  execute(async () => {
    const parsedId = parseHrWorkspaceIdentifier(leaveIdentifier);
    const parsedPayload = parseHrLeaveRejectPayload(payload);
    const response = await hrWorkspaceApi.rejectLeave(parsedId, parsedPayload);
    return normalizeLeaveMutationPayload(response.data);
  });

const previewHrPayrollRun = async (payrollRunIdentifier, params = {}) =>
  execute(async () => {
    const parsedId = parseHrWorkspaceIdentifier(payrollRunIdentifier);
    const parsedParams = parseHrPayrollPreviewParams(params);
    const response = await hrWorkspaceApi.previewPayrollRun(parsedId, parsedParams);
    return normalizePayrollPreviewPayload(response.data);
  });

const processHrPayrollRun = async (payrollRunIdentifier, payload = {}) =>
  execute(async () => {
    const parsedId = parseHrWorkspaceIdentifier(payrollRunIdentifier);
    const parsedPayload = parseHrPayrollProcessPayload(payload);
    const response = await hrWorkspaceApi.processPayrollRun(parsedId, parsedPayload);
    return normalizePayrollProcessPayload(response.data);
  });

const resolveHrLegacyRoute = async (resource, id) =>
  execute(async () => {
    const parsed = parseHrResolveLegacyParams({ resource, id });
    const response = await hrWorkspaceApi.resolveLegacyRoute(parsed.resource, parsed.id);
    return normalizeHrLegacyResolution(response.data);
  });

export {
  listHrWorkspace,
  listHrWorkItems,
  getHrRosterWorkflow,
  generateHrRoster,
  publishHrRoster,
  overrideHrShift,
  approveHrSwap,
  rejectHrSwap,
  approveHrLeave,
  rejectHrLeave,
  previewHrPayrollRun,
  processHrPayrollRun,
  resolveHrLegacyRoute,
  parseHrWorkbenchRouteState,
};
