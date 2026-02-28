import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';

const hrWorkspaceApi = {
  listWorkspace: (params = {}) =>
    apiClient({
      url: `${endpoints.HR_WORKSPACE.WORKSPACE}${buildQueryString(params)}`,
      method: 'GET',
    }),
  listWorkItems: (params = {}) =>
    apiClient({
      url: `${endpoints.HR_WORKSPACE.WORK_ITEMS}${buildQueryString(params)}`,
      method: 'GET',
    }),
  getRosterWorkflow: (rosterIdentifier) =>
    apiClient({
      url: endpoints.HR_WORKSPACE.ROSTER_WORKFLOW(rosterIdentifier),
      method: 'GET',
    }),
  generateRoster: (rosterIdentifier, payload = {}) =>
    apiClient({
      url: endpoints.HR_WORKSPACE.GENERATE_ROSTER(rosterIdentifier),
      method: 'POST',
      body: payload,
    }),
  publishRoster: (rosterIdentifier, payload = {}) =>
    apiClient({
      url: endpoints.HR_WORKSPACE.PUBLISH_ROSTER(rosterIdentifier),
      method: 'POST',
      body: payload,
    }),
  overrideShift: (shiftIdentifier, payload = {}) =>
    apiClient({
      url: endpoints.HR_WORKSPACE.OVERRIDE_SHIFT(shiftIdentifier),
      method: 'POST',
      body: payload,
    }),
  approveSwap: (swapIdentifier, payload = {}) =>
    apiClient({
      url: endpoints.HR_WORKSPACE.APPROVE_SWAP(swapIdentifier),
      method: 'POST',
      body: payload,
    }),
  rejectSwap: (swapIdentifier, payload = {}) =>
    apiClient({
      url: endpoints.HR_WORKSPACE.REJECT_SWAP(swapIdentifier),
      method: 'POST',
      body: payload,
    }),
  approveLeave: (leaveIdentifier, payload = {}) =>
    apiClient({
      url: endpoints.HR_WORKSPACE.APPROVE_LEAVE(leaveIdentifier),
      method: 'POST',
      body: payload,
    }),
  rejectLeave: (leaveIdentifier, payload = {}) =>
    apiClient({
      url: endpoints.HR_WORKSPACE.REJECT_LEAVE(leaveIdentifier),
      method: 'POST',
      body: payload,
    }),
  previewPayrollRun: (payrollRunIdentifier, params = {}) =>
    apiClient({
      url: `${endpoints.HR_WORKSPACE.PAYROLL_PREVIEW(payrollRunIdentifier)}${buildQueryString(params)}`,
      method: 'GET',
    }),
  processPayrollRun: (payrollRunIdentifier, payload = {}) =>
    apiClient({
      url: endpoints.HR_WORKSPACE.PAYROLL_PROCESS(payrollRunIdentifier),
      method: 'POST',
      body: payload,
    }),
  resolveLegacyRoute: (resource, id) =>
    apiClient({
      url: endpoints.HR_WORKSPACE.RESOLVE_LEGACY(resource, id),
      method: 'GET',
    }),
};

export { hrWorkspaceApi };
