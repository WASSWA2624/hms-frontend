/**
 * useDispenseLog Hook
 * File: useDispenseLog.js
 */
import useCrud from '@hooks/useCrud';
import {
  createDispenseLog,
  deleteDispenseLog,
  getDispenseLog,
  listDispenseLogs,
  updateDispenseLog,
} from '@features/dispense-log';

const useDispenseLog = () =>
  useCrud({
    list: listDispenseLogs,
    get: getDispenseLog,
    create: createDispenseLog,
    update: updateDispenseLog,
    remove: deleteDispenseLog,
  });

export default useDispenseLog;
