/**
 * useHousekeepingTask Hook
 * File: useHousekeepingTask.js
 */
import useCrud from '@hooks/useCrud';
import {
  listHousekeepingTasks,
  getHousekeepingTask,
  createHousekeepingTask,
  updateHousekeepingTask,
  deleteHousekeepingTask
} from '@features/housekeeping-task';

const useHousekeepingTask = () =>
  useCrud({
    list: listHousekeepingTasks,
    get: getHousekeepingTask,
    create: createHousekeepingTask,
    update: updateHousekeepingTask,
    remove: deleteHousekeepingTask,
  });

export default useHousekeepingTask;
