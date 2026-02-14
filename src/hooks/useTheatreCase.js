/**
 * useTheatreCase Hook
 * File: useTheatreCase.js
 */
import useCrud from '@hooks/useCrud';
import {
  createTheatreCase,
  deleteTheatreCase,
  getTheatreCase,
  listTheatreCases,
  updateTheatreCase,
} from '@features/theatre-case';

const useTheatreCase = () =>
  useCrud({
    list: listTheatreCases,
    get: getTheatreCase,
    create: createTheatreCase,
    update: updateTheatreCase,
    remove: deleteTheatreCase,
  });

export default useTheatreCase;
