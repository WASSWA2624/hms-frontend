/**
 * useModuleSubscription Hook
 * File: useModuleSubscription.js
 */
import useCrud from '@hooks/useCrud';
import {
  activateModuleSubscription,
  checkModuleSubscriptionEligibility,
  createModuleSubscription,
  deactivateModuleSubscription,
  deleteModuleSubscription,
  getModuleSubscription,
  listModuleSubscriptions,
  updateModuleSubscription,
} from '@features/module-subscription';

const useModuleSubscription = () =>
  useCrud({
    list: listModuleSubscriptions,
    get: getModuleSubscription,
    create: createModuleSubscription,
    update: updateModuleSubscription,
    remove: deleteModuleSubscription,
    activate: activateModuleSubscription,
    deactivate: deactivateModuleSubscription,
    checkEligibility: checkModuleSubscriptionEligibility,
  });

export default useModuleSubscription;
