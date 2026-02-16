/**
 * Equipment Utilization Snapshot API
 * File: equipment-utilization-snapshot.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const equipmentUtilizationSnapshotApi = createCrudApi(endpoints.EQUIPMENT_UTILIZATION_SNAPSHOTS);

export { equipmentUtilizationSnapshotApi };
