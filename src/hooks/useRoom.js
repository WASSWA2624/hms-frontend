/**
 * useRoom Hook
 * File: useRoom.js
 */
import useCrud from '@hooks/useCrud';
import { createRoom, deleteRoom, getRoom, listRooms, updateRoom } from '@features/room';

const useRoom = () =>
  useCrud({
    list: listRooms,
    get: getRoom,
    create: createRoom,
    update: updateRoom,
    remove: deleteRoom,
  });

export default useRoom;
