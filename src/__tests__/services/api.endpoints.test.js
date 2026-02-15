/**
 * Services API Endpoints Tests
 * File: api.endpoints.test.js
 */
import { endpoints } from '@services/api/endpoints';

describe('services/api/endpoints', () => {
  it('re-exports config endpoints', () => {
    expect(endpoints).toBeDefined();
    expect(endpoints.AUTH).toBeDefined();
  });

  it('uses unversioned health endpoint contract', () => {
    expect(endpoints.HEALTH).toMatch(/\/health$/);
    expect(endpoints.HEALTH).not.toContain('/api/');
  });

  it('includes mounted biomedical equipment endpoints', () => {
    expect(endpoints.EQUIPMENT_CATEGORIES.LIST).toMatch(
      /\/equipment-categories$/
    );
    expect(endpoints.EQUIPMENT_REGISTRIES.LIST).toMatch(
      /\/equipment-registries$/
    );
    expect(endpoints.EQUIPMENT_WORK_ORDERS.LIST).toMatch(
      /\/equipment-work-orders$/
    );
    expect(endpoints.EQUIPMENT_DISPOSAL_TRANSFERS.LIST).toMatch(
      /\/equipment-disposal-transfers$/
    );
  });

  it('does not expose deprecated unmounted commerce endpoint groups', () => {
    expect(endpoints.PRODUCTS).toBeUndefined();
    expect(endpoints.CARTS).toBeUndefined();
    expect(endpoints.ORDERS).toBeUndefined();
    expect(endpoints.SHOPS).toBeUndefined();
    expect(endpoints.QUOTE_REQUESTS).toBeUndefined();
  });
});
