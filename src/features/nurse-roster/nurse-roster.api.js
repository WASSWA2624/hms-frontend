/**
 * Nurse Roster API
 * File: nurse-roster.api.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient } from '@services/api';
import { createCrudApi } from '@services/api';

const nurseRosterApi = createCrudApi(endpoints.NURSE_ROSTERS);

const publishNurseRosterApi = (id, payload = {}) =>
  apiClient({
    url: endpoints.NURSE_ROSTERS.PUBLISH(id),
    method: 'POST',
    body: payload,
  });

export { nurseRosterApi, publishNurseRosterApi };
