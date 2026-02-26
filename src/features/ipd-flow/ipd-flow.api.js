/**
 * IPD Flow API
 * File: ipd-flow.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';

const ipdFlowApi = {
  list: (params = {}) =>
    apiClient({
      url: `${endpoints.IPD_FLOWS.LIST}${buildQueryString(params)}`,
      method: 'GET',
    }),
  get: (id, params = {}) =>
    apiClient({
      url: `${endpoints.IPD_FLOWS.GET(id)}${buildQueryString(params)}`,
      method: 'GET',
    }),
  resolveLegacyRoute: (resource, id) =>
    apiClient({
      url: endpoints.IPD_FLOWS.RESOLVE_LEGACY(resource, id),
      method: 'GET',
    }),
  start: (payload = {}) =>
    apiClient({
      url: endpoints.IPD_FLOWS.START,
      method: 'POST',
      body: payload,
    }),
  startIcuStay: (id, payload = {}) =>
    apiClient({
      url: endpoints.IPD_FLOWS.START_ICU_STAY(id),
      method: 'POST',
      body: payload,
    }),
  endIcuStay: (id, payload = {}) =>
    apiClient({
      url: endpoints.IPD_FLOWS.END_ICU_STAY(id),
      method: 'POST',
      body: payload,
    }),
  addIcuObservation: (id, payload = {}) =>
    apiClient({
      url: endpoints.IPD_FLOWS.ADD_ICU_OBSERVATION(id),
      method: 'POST',
      body: payload,
    }),
  addCriticalAlert: (id, payload = {}) =>
    apiClient({
      url: endpoints.IPD_FLOWS.ADD_CRITICAL_ALERT(id),
      method: 'POST',
      body: payload,
    }),
  resolveCriticalAlert: (id, payload = {}) =>
    apiClient({
      url: endpoints.IPD_FLOWS.RESOLVE_CRITICAL_ALERT(id),
      method: 'POST',
      body: payload,
    }),
  assignBed: (id, payload = {}) =>
    apiClient({
      url: endpoints.IPD_FLOWS.ASSIGN_BED(id),
      method: 'POST',
      body: payload,
    }),
  releaseBed: (id, payload = {}) =>
    apiClient({
      url: endpoints.IPD_FLOWS.RELEASE_BED(id),
      method: 'POST',
      body: payload,
    }),
  requestTransfer: (id, payload = {}) =>
    apiClient({
      url: endpoints.IPD_FLOWS.REQUEST_TRANSFER(id),
      method: 'POST',
      body: payload,
    }),
  updateTransfer: (id, payload = {}) =>
    apiClient({
      url: endpoints.IPD_FLOWS.UPDATE_TRANSFER(id),
      method: 'POST',
      body: payload,
    }),
  addWardRound: (id, payload = {}) =>
    apiClient({
      url: endpoints.IPD_FLOWS.ADD_WARD_ROUND(id),
      method: 'POST',
      body: payload,
    }),
  addNursingNote: (id, payload = {}) =>
    apiClient({
      url: endpoints.IPD_FLOWS.ADD_NURSING_NOTE(id),
      method: 'POST',
      body: payload,
    }),
  addMedicationAdministration: (id, payload = {}) =>
    apiClient({
      url: endpoints.IPD_FLOWS.ADD_MEDICATION_ADMINISTRATION(id),
      method: 'POST',
      body: payload,
    }),
  planDischarge: (id, payload = {}) =>
    apiClient({
      url: endpoints.IPD_FLOWS.PLAN_DISCHARGE(id),
      method: 'POST',
      body: payload,
    }),
  finalizeDischarge: (id, payload = {}) =>
    apiClient({
      url: endpoints.IPD_FLOWS.FINALIZE_DISCHARGE(id),
      method: 'POST',
      body: payload,
    }),
};

export { ipdFlowApi };
