/**
 * Equipment Service Provider Model
 * File: equipment-service-provider.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeEquipmentServiceProvider = (value) => normalize(value);
const normalizeEquipmentServiceProviderList = (value) => normalizeList(value);

export { normalizeEquipmentServiceProvider, normalizeEquipmentServiceProviderList };
