/**
 * Equipment Service Provider Model Tests
 * File: equipment-service-provider.model.test.js
 */
import {
  normalizeEquipmentServiceProvider,
  normalizeEquipmentServiceProviderList,
} from '@features/equipment-service-provider';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('equipment-service-provider.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeEquipmentServiceProvider, normalizeEquipmentServiceProviderList);
  });
});
