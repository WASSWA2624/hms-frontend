/**
 * useSubscription Hook
 * File: useSubscription.js
 */
import useCrud from '@hooks/useCrud';
import {
  createSubscription,
  deleteSubscription,
  downgradeSubscription,
  getSubscriptionFitCheck,
  getSubscriptionProrationPreview,
  getSubscriptionUpgradeRecommendation,
  getSubscriptionUsageSummary,
  getSubscription,
  listSubscriptions,
  renewSubscription,
  upgradeSubscription,
  updateSubscription,
} from '@features/subscription';

const useSubscription = () =>
  useCrud({
    list: listSubscriptions,
    get: getSubscription,
    create: createSubscription,
    update: updateSubscription,
    remove: deleteSubscription,
    upgrade: upgradeSubscription,
    downgrade: downgradeSubscription,
    renew: renewSubscription,
    getProrationPreview: getSubscriptionProrationPreview,
    getUsageSummary: getSubscriptionUsageSummary,
    getFitCheck: getSubscriptionFitCheck,
    getUpgradeRecommendation: getSubscriptionUpgradeRecommendation,
  });

export default useSubscription;
