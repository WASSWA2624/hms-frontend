/**
 * Equipment Disposal Transfer API
 * File: equipment-disposal-transfer.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const equipmentDisposalTransferApi = createCrudApi(endpoints.EQUIPMENT_DISPOSAL_TRANSFERS);

export { equipmentDisposalTransferApi };
