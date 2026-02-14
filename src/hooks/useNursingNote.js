/**
 * useNursingNote Hook
 * File: useNursingNote.js
 */
import useCrud from '@hooks/useCrud';
import {
  createNursingNote,
  deleteNursingNote,
  getNursingNote,
  listNursingNotes,
  updateNursingNote,
} from '@features/nursing-note';

const useNursingNote = () =>
  useCrud({
    list: listNursingNotes,
    get: getNursingNote,
    create: createNursingNote,
    update: updateNursingNote,
    remove: deleteNursingNote,
  });

export default useNursingNote;
