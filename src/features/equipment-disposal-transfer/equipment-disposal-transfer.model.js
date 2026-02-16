/**
 * Equipment Disposal Transfer Model
 * File: equipment-disposal-transfer.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeEquipmentDisposalTransfer = (value) => normalize(value);
const normalizeEquipmentDisposalTransferList = (value) => normalizeList(value);

export { normalizeEquipmentDisposalTransfer, normalizeEquipmentDisposalTransferList };
