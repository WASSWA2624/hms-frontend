/**
 * useFollowUp Hook
 * File: useFollowUp.js
 */
import useCrud from '@hooks/useCrud';
import {
  cancelFollowUpAction,
  completeFollowUp,
  createFollowUp,
  dispatchFollowUpReminders,
  deleteFollowUp,
  getFollowUp,
  getFollowUpReminderDueSummary,
  listFollowUps,
  updateFollowUp,
} from '@features/follow-up';

const useFollowUp = () =>
  useCrud({
    list: listFollowUps,
    get: getFollowUp,
    create: createFollowUp,
    update: updateFollowUp,
    remove: deleteFollowUp,
    complete: completeFollowUp,
    cancel: cancelFollowUpAction,
    dispatchReminders: dispatchFollowUpReminders,
    dueSummary: getFollowUpReminderDueSummary,
  });

export default useFollowUp;
