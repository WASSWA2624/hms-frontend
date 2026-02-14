/**
 * useLabPanel Hook
 * File: useLabPanel.js
 */
import useCrud from '@hooks/useCrud';
import {
  createLabPanel,
  deleteLabPanel,
  getLabPanel,
  listLabPanels,
  updateLabPanel,
} from '@features/lab-panel';

const useLabPanel = () =>
  useCrud({
    list: listLabPanels,
    get: getLabPanel,
    create: createLabPanel,
    update: updateLabPanel,
    remove: deleteLabPanel,
  });

export default useLabPanel;
