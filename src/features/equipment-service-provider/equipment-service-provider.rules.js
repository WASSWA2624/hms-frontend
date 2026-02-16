/**
 * Equipment Service Provider Rules
 * File: equipment-service-provider.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseEquipmentServiceProviderId = (value) => parseId(value);
const parseEquipmentServiceProviderPayload = (value) => parsePayload(value);
const parseEquipmentServiceProviderListParams = (value) => parseListParams(value);

export {
  parseEquipmentServiceProviderId,
  parseEquipmentServiceProviderPayload,
  parseEquipmentServiceProviderListParams,
};
