/**
 * State Hydration
 * Rehydrates offline state on app restart
 * File: hydration.js
 */
import { handleError } from '@errors';
import { logger } from '@logging';
import { getQueue } from '@offline/queue';

export const hydrate = async () => {
  try {
    const queue = await getQueue();
    logger.info('Hydrated offline queue', { count: queue.length });
    return { queue };
  } catch (error) {
    handleError(error, { scope: 'offline.hydration', op: 'hydrate' });
    return { queue: [] };
  }
};

export default { hydrate };

