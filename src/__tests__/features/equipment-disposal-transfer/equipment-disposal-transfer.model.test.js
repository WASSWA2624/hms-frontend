/**
 * Equipment Disposal Transfer Model Tests
 * File: equipment-disposal-transfer.model.test.js
 */
import {
  normalizeEquipmentDisposalTransfer,
  normalizeEquipmentDisposalTransferList,
} from '@features/equipment-disposal-transfer';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('equipment-disposal-transfer.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeEquipmentDisposalTransfer, normalizeEquipmentDisposalTransferList);
  });
});
