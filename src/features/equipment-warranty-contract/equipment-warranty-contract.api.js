/**
 * Equipment Warranty Contract API
 * File: equipment-warranty-contract.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const equipmentWarrantyContractApi = createCrudApi(endpoints.EQUIPMENT_WARRANTY_CONTRACTS);

export { equipmentWarrantyContractApi };
