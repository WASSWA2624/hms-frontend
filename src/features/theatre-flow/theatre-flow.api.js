/**
 * Theatre Flow API
 * File: theatre-flow.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';

const theatreFlowApi = {
  list: (params = {}) =>
    apiClient({
      url: `${endpoints.THEATRE_FLOWS.LIST}${buildQueryString(params)}`,
      method: 'GET',
    }),
  get: (id, params = {}) =>
    apiClient({
      url: `${endpoints.THEATRE_FLOWS.GET(id)}${buildQueryString(params)}`,
      method: 'GET',
    }),
  resolveLegacyRoute: (resource, id) =>
    apiClient({
      url: endpoints.THEATRE_FLOWS.RESOLVE_LEGACY(resource, id),
      method: 'GET',
    }),
  start: (payload = {}) =>
    apiClient({
      url: endpoints.THEATRE_FLOWS.START,
      method: 'POST',
      body: payload,
    }),
  updateStage: (id, payload = {}) =>
    apiClient({
      url: endpoints.THEATRE_FLOWS.UPDATE_STAGE(id),
      method: 'POST',
      body: payload,
    }),
  upsertAnesthesiaRecord: (id, payload = {}) =>
    apiClient({
      url: endpoints.THEATRE_FLOWS.UPSERT_ANESTHESIA_RECORD(id),
      method: 'POST',
      body: payload,
    }),
  addAnesthesiaObservation: (id, payload = {}) =>
    apiClient({
      url: endpoints.THEATRE_FLOWS.ADD_ANESTHESIA_OBSERVATION(id),
      method: 'POST',
      body: payload,
    }),
  upsertPostOpNote: (id, payload = {}) =>
    apiClient({
      url: endpoints.THEATRE_FLOWS.UPSERT_POST_OP_NOTE(id),
      method: 'POST',
      body: payload,
    }),
  toggleChecklistItem: (id, payload = {}) =>
    apiClient({
      url: endpoints.THEATRE_FLOWS.TOGGLE_CHECKLIST_ITEM(id),
      method: 'POST',
      body: payload,
    }),
  assignResource: (id, payload = {}) =>
    apiClient({
      url: endpoints.THEATRE_FLOWS.ASSIGN_RESOURCE(id),
      method: 'POST',
      body: payload,
    }),
  releaseResource: (id, payload = {}) =>
    apiClient({
      url: endpoints.THEATRE_FLOWS.RELEASE_RESOURCE(id),
      method: 'POST',
      body: payload,
    }),
  finalizeRecord: (id, payload = {}) =>
    apiClient({
      url: endpoints.THEATRE_FLOWS.FINALIZE_RECORD(id),
      method: 'POST',
      body: payload,
    }),
  reopenRecord: (id, payload = {}) =>
    apiClient({
      url: endpoints.THEATRE_FLOWS.REOPEN_RECORD(id),
      method: 'POST',
      body: payload,
    }),
};

export { theatreFlowApi };
