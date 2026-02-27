/**
 * Lab Workspace API
 * File: lab-workspace.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';

const labWorkspaceApi = {
  listWorkbench: (params = {}) =>
    apiClient({
      url: `${endpoints.LAB_WORKSPACE.WORKBENCH}${buildQueryString(params)}`,
      method: 'GET',
    }),
  getOrderWorkflow: (id) =>
    apiClient({
      url: endpoints.LAB_WORKSPACE.ORDER_WORKFLOW(id),
      method: 'GET',
    }),
  resolveLegacyRoute: (resource, id) =>
    apiClient({
      url: endpoints.LAB_WORKSPACE.RESOLVE_LEGACY(resource, id),
      method: 'GET',
    }),
  collectOrder: (id, payload = {}) =>
    apiClient({
      url: endpoints.LAB_WORKSPACE.COLLECT_ORDER(id),
      method: 'POST',
      body: payload,
    }),
  receiveSample: (id, payload = {}) =>
    apiClient({
      url: endpoints.LAB_WORKSPACE.RECEIVE_SAMPLE(id),
      method: 'POST',
      body: payload,
    }),
  rejectSample: (id, payload = {}) =>
    apiClient({
      url: endpoints.LAB_WORKSPACE.REJECT_SAMPLE(id),
      method: 'POST',
      body: payload,
    }),
  releaseOrderItem: (id, payload = {}) =>
    apiClient({
      url: endpoints.LAB_WORKSPACE.RELEASE_ORDER_ITEM(id),
      method: 'POST',
      body: payload,
    }),
};

export { labWorkspaceApi };
