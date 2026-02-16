/**
 * Equipment Recall Notice Usecase Tests
 * File: equipment-recall-notice.usecase.test.js
 */
import {
  listEquipmentRecallNotices,
  getEquipmentRecallNotice,
  createEquipmentRecallNotice,
  updateEquipmentRecallNotice,
  deleteEquipmentRecallNotice,
} from '@features/equipment-recall-notice';
import { equipmentRecallNoticeApi } from '@features/equipment-recall-notice/equipment-recall-notice.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/equipment-recall-notice/equipment-recall-notice.api', () => ({
  equipmentRecallNoticeApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('equipment-recall-notice.usecase', () => {
  beforeEach(() => {
    equipmentRecallNoticeApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    equipmentRecallNoticeApi.get.mockResolvedValue({ data: { id: '1' } });
    equipmentRecallNoticeApi.create.mockResolvedValue({ data: { id: '1' } });
    equipmentRecallNoticeApi.update.mockResolvedValue({ data: { id: '1' } });
    equipmentRecallNoticeApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listEquipmentRecallNotices,
      get: getEquipmentRecallNotice,
      create: createEquipmentRecallNotice,
      update: updateEquipmentRecallNotice,
      remove: deleteEquipmentRecallNotice,
    },
    { queueRequestIfOffline }
  );
});
