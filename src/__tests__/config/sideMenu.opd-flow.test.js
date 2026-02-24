import { CLINICAL_ITEMS, SCHEDULING_ITEMS } from '@config/sideMenu';

const OPD_READ_ROLES = [
  'APP_ADMIN',
  'SUPER_ADMIN',
  'TENANT_ADMIN',
  'ADMIN',
  'DOCTOR',
  'NURSE',
  'CLINICAL_OFFICER',
  'FRONT_DESK',
  'RECEPTIONIST',
  'EMERGENCY_OFFICER',
];

describe('sideMenu opd flow entries', () => {
  it('adds canonical OPD route in scheduling and clinical menus', () => {
    const schedulingOpdItem = SCHEDULING_ITEMS.find((item) => item.id === 'scheduling-opd-flows');
    const clinicalOpdItem = CLINICAL_ITEMS.find((item) => item.id === 'clinical-opd-flows');

    expect(schedulingOpdItem).toBeDefined();
    expect(clinicalOpdItem).toBeDefined();
    expect(schedulingOpdItem.path).toBe('/scheduling/opd-flows');
    expect(clinicalOpdItem.path).toBe('/scheduling/opd-flows');
  });

  it('assigns OPD read access roles to scheduling and clinical OPD items', () => {
    const schedulingOpdItem = SCHEDULING_ITEMS.find((item) => item.id === 'scheduling-opd-flows');
    const clinicalOpdItem = CLINICAL_ITEMS.find((item) => item.id === 'clinical-opd-flows');

    expect(schedulingOpdItem.roles).toEqual(OPD_READ_ROLES);
    expect(clinicalOpdItem.roles).toEqual(OPD_READ_ROLES);
  });
});
