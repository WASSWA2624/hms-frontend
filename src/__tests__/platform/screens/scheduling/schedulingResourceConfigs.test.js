import {
  getContextFilters,
  getSchedulingResourceConfig,
  SCHEDULING_RESOURCE_IDS,
  SCHEDULING_RESOURCE_LIST_ORDER,
} from '@platform/screens/scheduling/schedulingResourceConfigs';

describe('schedulingResourceConfigs', () => {
  it('includes appointment participants and reminders in tier 5 order', () => {
    const appointmentsIndex = SCHEDULING_RESOURCE_LIST_ORDER.indexOf(SCHEDULING_RESOURCE_IDS.APPOINTMENTS);
    const participantsIndex = SCHEDULING_RESOURCE_LIST_ORDER.indexOf(
      SCHEDULING_RESOURCE_IDS.APPOINTMENT_PARTICIPANTS
    );
    const remindersIndex = SCHEDULING_RESOURCE_LIST_ORDER.indexOf(
      SCHEDULING_RESOURCE_IDS.APPOINTMENT_REMINDERS
    );
    const providerSchedulesIndex = SCHEDULING_RESOURCE_LIST_ORDER.indexOf(
      SCHEDULING_RESOURCE_IDS.PROVIDER_SCHEDULES
    );

    expect(appointmentsIndex).toBeGreaterThan(-1);
    expect(participantsIndex).toBeGreaterThan(-1);
    expect(remindersIndex).toBeGreaterThan(-1);
    expect(providerSchedulesIndex).toBeGreaterThan(-1);
    expect(appointmentsIndex).toBeLessThan(participantsIndex);
    expect(participantsIndex).toBeLessThan(remindersIndex);
    expect(remindersIndex).toBeLessThan(providerSchedulesIndex);
  });

  it('maps participant and reminder context filters from appointment context', () => {
    const context = {
      appointmentId: 'appointment-1',
      patientId: 'patient-1',
    };

    expect(getContextFilters(SCHEDULING_RESOURCE_IDS.APPOINTMENT_PARTICIPANTS, context)).toEqual({
      appointment_id: 'appointment-1',
      participant_patient_id: 'patient-1',
    });

    expect(getContextFilters(SCHEDULING_RESOURCE_IDS.APPOINTMENT_REMINDERS, context)).toEqual({
      appointment_id: 'appointment-1',
    });
  });

  it('provides resource configs for appointment participants and reminders', () => {
    const participantsConfig = getSchedulingResourceConfig(
      SCHEDULING_RESOURCE_IDS.APPOINTMENT_PARTICIPANTS
    );
    const remindersConfig = getSchedulingResourceConfig(SCHEDULING_RESOURCE_IDS.APPOINTMENT_REMINDERS);

    expect(participantsConfig?.requiresTenant).toBe(false);
    expect(participantsConfig?.supportsFacility).toBe(false);
    expect(participantsConfig?.fields?.length).toBe(4);

    expect(remindersConfig?.requiresTenant).toBe(false);
    expect(remindersConfig?.supportsFacility).toBe(false);
    expect(remindersConfig?.fields?.length).toBe(4);
  });
});
