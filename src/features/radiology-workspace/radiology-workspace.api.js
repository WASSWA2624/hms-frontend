import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';

const radiologyWorkspaceApi = {
  listWorkbench: (params = {}) =>
    apiClient({
      url: `${endpoints.RADIOLOGY_WORKSPACE.WORKBENCH}${buildQueryString(params)}`,
      method: 'GET',
    }),
  getOrderWorkflow: (id) =>
    apiClient({
      url: endpoints.RADIOLOGY_WORKSPACE.ORDER_WORKFLOW(id),
      method: 'GET',
    }),
  resolveLegacyRoute: (resource, id) =>
    apiClient({
      url: endpoints.RADIOLOGY_WORKSPACE.RESOLVE_LEGACY(resource, id),
      method: 'GET',
    }),
  assignOrder: (id, payload = {}) =>
    apiClient({
      url: endpoints.RADIOLOGY_WORKSPACE.ASSIGN_ORDER(id),
      method: 'POST',
      body: payload,
    }),
  startOrder: (id, payload = {}) =>
    apiClient({
      url: endpoints.RADIOLOGY_WORKSPACE.START_ORDER(id),
      method: 'POST',
      body: payload,
    }),
  completeOrder: (id, payload = {}) =>
    apiClient({
      url: endpoints.RADIOLOGY_WORKSPACE.COMPLETE_ORDER(id),
      method: 'POST',
      body: payload,
    }),
  cancelOrder: (id, payload = {}) =>
    apiClient({
      url: endpoints.RADIOLOGY_WORKSPACE.CANCEL_ORDER(id),
      method: 'POST',
      body: payload,
    }),
  createStudy: (id, payload = {}) =>
    apiClient({
      url: endpoints.RADIOLOGY_WORKSPACE.CREATE_STUDY(id),
      method: 'POST',
      body: payload,
    }),
  initAssetUpload: (id, payload = {}) =>
    apiClient({
      url: endpoints.RADIOLOGY_WORKSPACE.INIT_ASSET_UPLOAD(id),
      method: 'POST',
      body: payload,
    }),
  commitAssetUpload: (id, payload = {}) =>
    apiClient({
      url: endpoints.RADIOLOGY_WORKSPACE.COMMIT_ASSET_UPLOAD(id),
      method: 'POST',
      body: payload,
    }),
  syncStudyToPacs: (id, payload = {}) =>
    apiClient({
      url: endpoints.RADIOLOGY_WORKSPACE.SYNC_STUDY(id),
      method: 'POST',
      body: payload,
    }),
  draftResult: (id, payload = {}) =>
    apiClient({
      url: endpoints.RADIOLOGY_WORKSPACE.DRAFT_RESULT(id),
      method: 'POST',
      body: payload,
    }),
  finalizeResult: (id, payload = {}) =>
    apiClient({
      url: endpoints.RADIOLOGY_WORKSPACE.FINALIZE_RESULT(id),
      method: 'POST',
      body: payload,
    }),
  addendumResult: (id, payload = {}) =>
    apiClient({
      url: endpoints.RADIOLOGY_WORKSPACE.ADDENDUM_RESULT(id),
      method: 'POST',
      body: payload,
    }),
};

export { radiologyWorkspaceApi };
