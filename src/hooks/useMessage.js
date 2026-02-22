/**
 * useMessage Hook
 * File: useMessage.js
 */
import useCrud from '@hooks/useCrud';
import {
  createMessage,
  deleteMessage,
  getMessage,
  listMessages,
  updateMessage,
} from '@features/message';

const useMessage = () =>
  useCrud({
    list: listMessages,
    get: getMessage,
    create: createMessage,
    update: updateMessage,
    remove: deleteMessage,
  });

export default useMessage;
