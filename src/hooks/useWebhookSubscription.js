/**
 * useWebhookSubscription Hook
 * File: useWebhookSubscription.js
 */
import useCrud from '@hooks/useCrud';
import {
  listWebhookSubscriptions,
  getWebhookSubscription,
  createWebhookSubscription,
  updateWebhookSubscription,
  deleteWebhookSubscription
} from '@features/webhook-subscription';

const useWebhookSubscription = () =>
  useCrud({
    list: listWebhookSubscriptions,
    get: getWebhookSubscription,
    create: createWebhookSubscription,
    update: updateWebhookSubscription,
    remove: deleteWebhookSubscription,
  });

export default useWebhookSubscription;
