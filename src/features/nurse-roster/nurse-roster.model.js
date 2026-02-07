/**
 * Nurse Roster Model
 * File: nurse-roster.model.js
 */
import { createCrudModel } from '@utils/crudModel';

const { normalize, normalizeList } = createCrudModel();

const normalizeNurseRoster = (value) => normalize(value);
const normalizeNurseRosterList = (value) => normalizeList(value);

export { normalizeNurseRoster, normalizeNurseRosterList };
