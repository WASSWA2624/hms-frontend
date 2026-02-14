/**
 * useWardRound Hook
 * File: useWardRound.js
 */
import useCrud from '@hooks/useCrud';
import {
  createWardRound,
  deleteWardRound,
  getWardRound,
  listWardRounds,
  updateWardRound,
} from '@features/ward-round';

const useWardRound = () =>
  useCrud({
    list: listWardRounds,
    get: getWardRound,
    create: createWardRound,
    update: updateWardRound,
    remove: deleteWardRound,
  });

export default useWardRound;
