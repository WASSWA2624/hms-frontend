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

  it('uses lookup fields for key scheduling relationships', () => {
    const appointmentsConfig = getSchedulingResourceConfig(SCHEDULING_RESOURCE_IDS.APPOINTMENTS);
    const participantsConfig = getSchedulingResourceConfig(
      SCHEDULING_RESOURCE_IDS.APPOINTMENT_PARTICIPANTS
    );
    const slotsConfig = getSchedulingResourceConfig(SCHEDULING_RESOURCE_IDS.AVAILABILITY_SLOTS);

    const appointmentPatientField = appointmentsConfig?.fields?.find((field) => field.name === 'patient_id');
    const appointmentProviderField = appointmentsConfig?.fields?.find((field) => field.name === 'provider_user_id');
    const participantAppointmentField = participantsConfig?.fields?.find((field) => field.name === 'appointment_id');
    const scheduleField = slotsConfig?.fields?.find((field) => field.name === 'schedule_id');

    expect(appointmentPatientField?.type).toBe('lookup');
    expect(appointmentProviderField?.type).toBe('lookup');
    expect(participantAppointmentField?.type).toBe('lookup');
    expect(scheduleField?.type).toBe('lookup');
  });

  it('maps provider schedule override repeater values into payload', () => {
    const providerScheduleConfig = getSchedulingResourceConfig(SCHEDULING_RESOURCE_IDS.PROVIDER_SCHEDULES);
    const overridesField = providerScheduleConfig?.fields?.find(
      (field) => field.name === 'schedule_overrides'
    );

    expect(overridesField?.type).toBe('repeater');

    const payload = providerScheduleConfig.toPayload({
      provider_user_id: 'provider-1',
      schedule_type: 'RECURRING',
      timezone: 'UTC',
      effective_from: '',
      effective_to: '',
      day_of_week: '2',
      start_time: '2026-02-26T09:00',
      end_time: '2026-02-26T10:00',
      facility_id: '',
      schedule_overrides: [
        {
          override_date: '2026-03-02T09:00',
          start_time: '2026-03-02T09:00',
          end_time: '2026-03-02T11:00',
          is_available: false,
        },
      ],
    });

    expect(Array.isArray(payload.schedule_overrides)).toBe(true);
    expect(payload.schedule_overrides).toHaveLength(1);
    expect(payload.schedule_overrides[0]).toMatchObject({
      is_available: false,
    });
    expect(payload.schedule_overrides[0].override_date).toContain('T');
    expect(payload.schedule_overrides[0].start_time).toContain('T');
    expect(payload.schedule_overrides[0].end_time).toContain('T');
  });
});
