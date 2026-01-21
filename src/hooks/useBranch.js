/**
 * useBranch Hook
 * File: useBranch.js
 */
import useCrud from '@hooks/useCrud';
import { createBranch, deleteBranch, getBranch, listBranches, updateBranch } from '@features/branch';

const useBranch = () =>
  useCrud({
    list: listBranches,
    get: getBranch,
    create: createBranch,
    update: updateBranch,
    remove: deleteBranch,
  });

export default useBranch;
