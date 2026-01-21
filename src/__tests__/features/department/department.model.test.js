/**
 * Department Model Tests
 * File: department.model.test.js
 */
import { normalizeDepartment, normalizeDepartmentList } from '@features/department';
import { expectModelNormalizers } from '../../helpers/crud-assertions';

describe('department.model', () => {
  it('normalizes entity and list', () => {
    expectModelNormalizers(normalizeDepartment, normalizeDepartmentList);
  });
});
