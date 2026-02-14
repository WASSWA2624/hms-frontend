/**
 * usePostOpNote Hook
 * File: usePostOpNote.js
 */
import useCrud from '@hooks/useCrud';
import {
  createPostOpNote,
  deletePostOpNote,
  getPostOpNote,
  listPostOpNotes,
  updatePostOpNote,
} from '@features/post-op-note';

const usePostOpNote = () =>
  useCrud({
    list: listPostOpNotes,
    get: getPostOpNote,
    create: createPostOpNote,
    update: updatePostOpNote,
    remove: deletePostOpNote,
  });

export default usePostOpNote;
