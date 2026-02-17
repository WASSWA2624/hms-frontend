/**
 * Shift Template Usecase Tests
 * File: shift-template.usecase.test.js
 */
import {
  listShiftTemplates,
  getShiftTemplate,
  createShiftTemplate,
  updateShiftTemplate,
  deleteShiftTemplate,
} from '@features/shift-template';
import { shiftTemplateApi } from '@features/shift-template/shift-template.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/shift-template/shift-template.api', () => ({
  shiftTemplateApi: {
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

describe('shift-template.usecase', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    shiftTemplateApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    shiftTemplateApi.get.mockResolvedValue({ data: { id: '1' } });
    shiftTemplateApi.create.mockResolvedValue({ data: { id: '1' } });
    shiftTemplateApi.update.mockResolvedValue({ data: { id: '1' } });
    shiftTemplateApi.remove.mockResolvedValue({ data: null, status: 204 });
  });

  afterEach(() => {
    consoleErrorSpy?.mockRestore?.();
  });

  runCrudUsecaseTests(
    {
      list: listShiftTemplates,
      get: getShiftTemplate,
      create: createShiftTemplate,
      update: updateShiftTemplate,
      remove: deleteShiftTemplate,
    },
    { queueRequestIfOffline }
  );

  it('unwraps nested list payload envelopes', async () => {
    shiftTemplateApi.list.mockResolvedValue({
      data: {
        data: [{ id: '2' }],
      },
    });

    await expect(listShiftTemplates({})).resolves.toEqual([{ id: '2' }]);
  });

  it('returns empty list when list payload is null', async () => {
    shiftTemplateApi.list.mockResolvedValue({ data: null });
    await expect(listShiftTemplates({})).resolves.toEqual([]);
  });
});

