/**
 * OPD Flow API
 * File: opd-flow.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';

const opdFlowApi = {
  list: (params = {}) =>
    apiClient({
      url: `${endpoints.OPD_FLOWS.LIST}${buildQueryString(params)}`,
      method: 'GET',
    }),
  get: (id) =>
    apiClient({
      url: endpoints.OPD_FLOWS.GET(id),
      method: 'GET',
    }),
  resolveLegacyRoute: (resource, id) =>
    apiClient({
      url: endpoints.OPD_FLOWS.RESOLVE_LEGACY(resource, id),
      method: 'GET',
    }),
  start: (payload = {}) =>
    apiClient({
      url: endpoints.OPD_FLOWS.START,
      method: 'POST',
      body: payload,
    }),
  bootstrap: (payload = {}) =>
    apiClient({
      url: endpoints.OPD_FLOWS.BOOTSTRAP,
      method: 'POST',
      body: payload,
    }),
  payConsultation: (id, payload = {}) =>
    apiClient({
      url: endpoints.OPD_FLOWS.PAY_CONSULTATION(id),
      method: 'POST',
      body: payload,
    }),
  recordVitals: (id, payload = {}) =>
    apiClient({
      url: endpoints.OPD_FLOWS.RECORD_VITALS(id),
      method: 'POST',
      body: payload,
    }),
  assignDoctor: (id, payload = {}) =>
    apiClient({
      url: endpoints.OPD_FLOWS.ASSIGN_DOCTOR(id),
      method: 'POST',
      body: payload,
    }),
  doctorReview: (id, payload = {}) =>
    apiClient({
      url: endpoints.OPD_FLOWS.DOCTOR_REVIEW(id),
      method: 'POST',
      body: payload,
    }),
  disposition: (id, payload = {}) =>
    apiClient({
      url: endpoints.OPD_FLOWS.DISPOSITION(id),
      method: 'POST',
      body: payload,
    }),
  correctStage: (id, payload = {}) =>
    apiClient({
      url: endpoints.OPD_FLOWS.CORRECT_STAGE(id),
      method: 'POST',
      body: payload,
    }),
};

export { opdFlowApi };
