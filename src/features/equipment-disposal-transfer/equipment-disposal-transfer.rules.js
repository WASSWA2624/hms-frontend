/**
 * Equipment Disposal Transfer Rules
 * File: equipment-disposal-transfer.rules.js
 */
import { createCrudRules } from '@utils/crudRules';

const { parseId, parsePayload, parseListParams } = createCrudRules();

const parseEquipmentDisposalTransferId = (value) => parseId(value);
const parseEquipmentDisposalTransferPayload = (value) => parsePayload(value);
const parseEquipmentDisposalTransferListParams = (value) => parseListParams(value);

export {
  parseEquipmentDisposalTransferId,
  parseEquipmentDisposalTransferPayload,
  parseEquipmentDisposalTransferListParams,
};
