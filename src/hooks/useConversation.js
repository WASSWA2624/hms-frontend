/**
 * useConversation Hook
 * File: useConversation.js
 */
import useCrud from '@hooks/useCrud';
import {
  createConversation,
  deleteConversation,
  getConversation,
  listConversations,
  updateConversation,
} from '@features/conversation';

const useConversation = () =>
  useCrud({
    list: listConversations,
    get: getConversation,
    create: createConversation,
    update: updateConversation,
    remove: deleteConversation,
  });

export default useConversation;
