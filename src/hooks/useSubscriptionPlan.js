/**
 * useSubscriptionPlan Hook
 * File: useSubscriptionPlan.js
 */
import useCrud from '@hooks/useCrud';
import {
  createSubscriptionPlan,
  deleteSubscriptionPlan,
  getSubscriptionPlan,
  getSubscriptionPlanAddOnEligibility,
  getSubscriptionPlanEntitlements,
  listSubscriptionPlans,
  updateSubscriptionPlan,
} from '@features/subscription-plan';

const useSubscriptionPlan = () =>
  useCrud({
    list: listSubscriptionPlans,
    get: getSubscriptionPlan,
    create: createSubscriptionPlan,
    update: updateSubscriptionPlan,
    remove: deleteSubscriptionPlan,
    getEntitlements: getSubscriptionPlanEntitlements,
    getAddOnEligibility: getSubscriptionPlanAddOnEligibility,
  });

export default useSubscriptionPlan;
