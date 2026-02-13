/**
 * Returns the CRUD hook state for the selected scheduling resource.
 */
import { useMemo } from 'react';
import {
  useAppointment,
  useAvailabilitySlot,
  useProviderSchedule,
  useVisitQueue,
} from '@hooks';
import { SCHEDULING_RESOURCE_IDS } from './schedulingResourceConfigs';

const useSchedulingResourceCrud = (resourceId) => {
  const appointment = useAppointment();
  const providerSchedule = useProviderSchedule();
  const availabilitySlot = useAvailabilitySlot();
  const visitQueue = useVisitQueue();

  return useMemo(() => {
    const map = {
      [SCHEDULING_RESOURCE_IDS.APPOINTMENTS]: appointment,
      [SCHEDULING_RESOURCE_IDS.PROVIDER_SCHEDULES]: providerSchedule,
      [SCHEDULING_RESOURCE_IDS.AVAILABILITY_SLOTS]: availabilitySlot,
      [SCHEDULING_RESOURCE_IDS.VISIT_QUEUES]: visitQueue,
    };
    return map[resourceId] || appointment;
  }, [resourceId, appointment, providerSchedule, availabilitySlot, visitQueue]);
};

export default useSchedulingResourceCrud;
