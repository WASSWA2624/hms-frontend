/**
 * Module Group 1 CRUD Feature Tests
 * File: module-group-1.crud.test.js
 */
import {
  parseTenantId,
  parseTenantPayload,
  parseTenantListParams,
  normalizeTenant,
  normalizeTenantList,
  listTenants,
  getTenant,
  createTenant,
  updateTenant,
  deleteTenant,
  parseFacilityId,
  parseFacilityPayload,
  parseFacilityListParams,
  normalizeFacility,
  normalizeFacilityList,
  listFacilities,
  getFacility,
  createFacility,
  updateFacility,
  deleteFacility,
  listFacilityBranches,
  parseBranchId,
  parseBranchPayload,
  parseBranchListParams,
  normalizeBranch,
  normalizeBranchList,
  listBranches,
  getBranch,
  createBranch,
  updateBranch,
  deleteBranch,
  parseDepartmentId,
  parseDepartmentPayload,
  parseDepartmentListParams,
  normalizeDepartment,
  normalizeDepartmentList,
  listDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  listDepartmentUnits,
  parseUnitId,
  parseUnitPayload,
  parseUnitListParams,
  normalizeUnit,
  normalizeUnitList,
  listUnits,
  getUnit,
  createUnit,
  updateUnit,
  deleteUnit,
  parseRoomId,
  parseRoomPayload,
  parseRoomListParams,
  normalizeRoom,
  normalizeRoomList,
  listRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  parseWardId,
  parseWardPayload,
  parseWardListParams,
  normalizeWard,
  normalizeWardList,
  listWards,
  getWard,
  createWard,
  updateWard,
  deleteWard,
  listWardBeds,
  parseBedId,
  parseBedPayload,
  parseBedListParams,
  normalizeBed,
  normalizeBedList,
  listBeds,
  getBed,
  createBed,
  updateBed,
  deleteBed,
  parseAddressId,
  parseAddressPayload,
  parseAddressListParams,
  normalizeAddress,
  normalizeAddressList,
  listAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  parseContactId,
  parseContactPayload,
  parseContactListParams,
  normalizeContact,
  normalizeContactList,
  listContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  parseUserId,
  parseUserPayload,
  parseUserListParams,
  normalizeUser,
  normalizeUserList,
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  parseUserProfileId,
  parseUserProfilePayload,
  parseUserProfileListParams,
  normalizeUserProfile,
  normalizeUserProfileList,
  listUserProfiles,
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
  parseRoleId,
  parseRolePayload,
  parseRoleListParams,
  normalizeRole,
  normalizeRoleList,
  listRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  parsePermissionId,
  parsePermissionPayload,
  parsePermissionListParams,
  normalizePermission,
  normalizePermissionList,
  listPermissions,
  getPermission,
  createPermission,
  updatePermission,
  deletePermission,
  parseRolePermissionId,
  parseRolePermissionPayload,
  parseRolePermissionListParams,
  normalizeRolePermission,
  normalizeRolePermissionList,
  listRolePermissions,
  getRolePermission,
  createRolePermission,
  updateRolePermission,
  deleteRolePermission,
  parseUserRoleId,
  parseUserRolePayload,
  parseUserRoleListParams,
  normalizeUserRole,
  normalizeUserRoleList,
  listUserRoles,
  getUserRole,
  createUserRole,
  updateUserRole,
  deleteUserRole,
  parseApiKeyId,
  parseApiKeyPayload,
  parseApiKeyListParams,
  normalizeApiKey,
  normalizeApiKeyList,
  listApiKeys,
  getApiKey,
  createApiKey,
  updateApiKey,
  deleteApiKey,
  parseApiKeyPermissionId,
  parseApiKeyPermissionPayload,
  parseApiKeyPermissionListParams,
  normalizeApiKeyPermission,
  normalizeApiKeyPermissionList,
  listApiKeyPermissions,
  getApiKeyPermission,
  createApiKeyPermission,
  updateApiKeyPermission,
  deleteApiKeyPermission,
  parseOauthAccountId,
  parseOauthAccountPayload,
  parseOauthAccountListParams,
  normalizeOauthAccount,
  normalizeOauthAccountList,
  listOauthAccounts,
  getOauthAccount,
  createOauthAccount,
  updateOauthAccount,
  deleteOauthAccount,
  parseUserSessionId,
  parseUserSessionListParams,
  normalizeUserSession,
  normalizeUserSessionList,
  listUserSessions,
  getUserSession,
  revokeUserSession,
  parseUserMfaId,
  parseUserMfaPayload,
  parseUserMfaListParams,
  normalizeUserMfa,
  normalizeUserMfaList,
  listUserMfas,
  getUserMfa,
  createUserMfa,
  updateUserMfa,
  deleteUserMfa,
  verifyUserMfa,
  enableUserMfa,
  disableUserMfa,
} from '@features';
import {
  expectIdParser,
  expectListParamsParser,
  expectModelNormalizers,
  expectPayloadParser,
} from '../helpers/crud-assertions';

jest.mock('@services/api', () => {
  const listResponse = { data: [{ id: '1' }] };
  const itemResponse = { data: { id: '1' } };
  const listPattern =
    /\/(user-sessions|tenants|facilities|branches|departments|units|rooms|wards|beds|addresses|contacts|users|user-profiles|roles|permissions|role-permissions|user-roles|api-keys|api-key-permissions|user-mfas|oauth-accounts)(\?|$)/;

  const buildQueryString = (params = {}) => {
    if (!params || typeof params !== 'object') return '';
    const entries = Object.entries(params);
    if (!entries.length) return '';
    const searchParams = new URLSearchParams();
    entries.forEach(([key, value]) => searchParams.append(key, String(value)));
    const query = searchParams.toString();
    return query ? `?${query}` : '';
  };

  const apiClient = jest.fn().mockImplementation(({ url, method }) => {
    if (method === 'GET' && (listPattern.test(url) || /\/(branches|units|beds)(\?|$)/.test(url))) {
      return Promise.resolve(listResponse);
    }
    return Promise.resolve(itemResponse);
  });

  const createCrudApi = jest.fn(() => ({
    list: jest.fn().mockResolvedValue(listResponse),
    get: jest.fn().mockResolvedValue(itemResponse),
    create: jest.fn().mockResolvedValue(itemResponse),
    update: jest.fn().mockResolvedValue(itemResponse),
    remove: jest.fn().mockResolvedValue(itemResponse),
  }));

  return { apiClient, createCrudApi, buildQueryString };
});

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn().mockResolvedValue(false),
}));

describe('Module Group 1 CRUD features', () => {
  const modules = [
    {
      name: 'tenant',
      rules: { parseId: parseTenantId, parsePayload: parseTenantPayload, parseListParams: parseTenantListParams },
      model: { normalize: normalizeTenant, normalizeList: normalizeTenantList },
      usecases: { list: listTenants, get: getTenant, create: createTenant, update: updateTenant, remove: deleteTenant },
    },
    {
      name: 'facility',
      rules: { parseId: parseFacilityId, parsePayload: parseFacilityPayload, parseListParams: parseFacilityListParams },
      model: { normalize: normalizeFacility, normalizeList: normalizeFacilityList },
      usecases: {
        list: listFacilities,
        get: getFacility,
        create: createFacility,
        update: updateFacility,
        remove: deleteFacility,
        listExtra: listFacilityBranches,
      },
    },
    {
      name: 'branch',
      rules: { parseId: parseBranchId, parsePayload: parseBranchPayload, parseListParams: parseBranchListParams },
      model: { normalize: normalizeBranch, normalizeList: normalizeBranchList },
      usecases: { list: listBranches, get: getBranch, create: createBranch, update: updateBranch, remove: deleteBranch },
    },
    {
      name: 'department',
      rules: {
        parseId: parseDepartmentId,
        parsePayload: parseDepartmentPayload,
        parseListParams: parseDepartmentListParams,
      },
      model: { normalize: normalizeDepartment, normalizeList: normalizeDepartmentList },
      usecases: {
        list: listDepartments,
        get: getDepartment,
        create: createDepartment,
        update: updateDepartment,
        remove: deleteDepartment,
        listExtra: listDepartmentUnits,
      },
    },
    {
      name: 'unit',
      rules: { parseId: parseUnitId, parsePayload: parseUnitPayload, parseListParams: parseUnitListParams },
      model: { normalize: normalizeUnit, normalizeList: normalizeUnitList },
      usecases: { list: listUnits, get: getUnit, create: createUnit, update: updateUnit, remove: deleteUnit },
    },
    {
      name: 'room',
      rules: { parseId: parseRoomId, parsePayload: parseRoomPayload, parseListParams: parseRoomListParams },
      model: { normalize: normalizeRoom, normalizeList: normalizeRoomList },
      usecases: { list: listRooms, get: getRoom, create: createRoom, update: updateRoom, remove: deleteRoom },
    },
    {
      name: 'ward',
      rules: { parseId: parseWardId, parsePayload: parseWardPayload, parseListParams: parseWardListParams },
      model: { normalize: normalizeWard, normalizeList: normalizeWardList },
      usecases: {
        list: listWards,
        get: getWard,
        create: createWard,
        update: updateWard,
        remove: deleteWard,
        listExtra: listWardBeds,
      },
    },
    {
      name: 'bed',
      rules: { parseId: parseBedId, parsePayload: parseBedPayload, parseListParams: parseBedListParams },
      model: { normalize: normalizeBed, normalizeList: normalizeBedList },
      usecases: { list: listBeds, get: getBed, create: createBed, update: updateBed, remove: deleteBed },
    },
    {
      name: 'address',
      rules: { parseId: parseAddressId, parsePayload: parseAddressPayload, parseListParams: parseAddressListParams },
      model: { normalize: normalizeAddress, normalizeList: normalizeAddressList },
      usecases: {
        list: listAddresses,
        get: getAddress,
        create: createAddress,
        update: updateAddress,
        remove: deleteAddress,
      },
    },
    {
      name: 'contact',
      rules: { parseId: parseContactId, parsePayload: parseContactPayload, parseListParams: parseContactListParams },
      model: { normalize: normalizeContact, normalizeList: normalizeContactList },
      usecases: { list: listContacts, get: getContact, create: createContact, update: updateContact, remove: deleteContact },
    },
    {
      name: 'user',
      rules: { parseId: parseUserId, parsePayload: parseUserPayload, parseListParams: parseUserListParams },
      model: { normalize: normalizeUser, normalizeList: normalizeUserList },
      usecases: { list: listUsers, get: getUser, create: createUser, update: updateUser, remove: deleteUser },
    },
    {
      name: 'user-profile',
      rules: {
        parseId: parseUserProfileId,
        parsePayload: parseUserProfilePayload,
        parseListParams: parseUserProfileListParams,
      },
      model: { normalize: normalizeUserProfile, normalizeList: normalizeUserProfileList },
      usecases: {
        list: listUserProfiles,
        get: getUserProfile,
        create: createUserProfile,
        update: updateUserProfile,
        remove: deleteUserProfile,
      },
    },
    {
      name: 'role',
      rules: { parseId: parseRoleId, parsePayload: parseRolePayload, parseListParams: parseRoleListParams },
      model: { normalize: normalizeRole, normalizeList: normalizeRoleList },
      usecases: { list: listRoles, get: getRole, create: createRole, update: updateRole, remove: deleteRole },
    },
    {
      name: 'permission',
      rules: {
        parseId: parsePermissionId,
        parsePayload: parsePermissionPayload,
        parseListParams: parsePermissionListParams,
      },
      model: { normalize: normalizePermission, normalizeList: normalizePermissionList },
      usecases: {
        list: listPermissions,
        get: getPermission,
        create: createPermission,
        update: updatePermission,
        remove: deletePermission,
      },
    },
    {
      name: 'role-permission',
      rules: {
        parseId: parseRolePermissionId,
        parsePayload: parseRolePermissionPayload,
        parseListParams: parseRolePermissionListParams,
      },
      model: { normalize: normalizeRolePermission, normalizeList: normalizeRolePermissionList },
      usecases: {
        list: listRolePermissions,
        get: getRolePermission,
        create: createRolePermission,
        update: updateRolePermission,
        remove: deleteRolePermission,
      },
    },
    {
      name: 'user-role',
      rules: {
        parseId: parseUserRoleId,
        parsePayload: parseUserRolePayload,
        parseListParams: parseUserRoleListParams,
      },
      model: { normalize: normalizeUserRole, normalizeList: normalizeUserRoleList },
      usecases: { list: listUserRoles, get: getUserRole, create: createUserRole, update: updateUserRole, remove: deleteUserRole },
    },
    {
      name: 'api-key',
      rules: { parseId: parseApiKeyId, parsePayload: parseApiKeyPayload, parseListParams: parseApiKeyListParams },
      model: { normalize: normalizeApiKey, normalizeList: normalizeApiKeyList },
      usecases: { list: listApiKeys, get: getApiKey, create: createApiKey, update: updateApiKey, remove: deleteApiKey },
    },
    {
      name: 'api-key-permission',
      rules: {
        parseId: parseApiKeyPermissionId,
        parsePayload: parseApiKeyPermissionPayload,
        parseListParams: parseApiKeyPermissionListParams,
      },
      model: { normalize: normalizeApiKeyPermission, normalizeList: normalizeApiKeyPermissionList },
      usecases: {
        list: listApiKeyPermissions,
        get: getApiKeyPermission,
        create: createApiKeyPermission,
        update: updateApiKeyPermission,
        remove: deleteApiKeyPermission,
      },
    },
    {
      name: 'oauth-account',
      rules: {
        parseId: parseOauthAccountId,
        parsePayload: parseOauthAccountPayload,
        parseListParams: parseOauthAccountListParams,
      },
      model: { normalize: normalizeOauthAccount, normalizeList: normalizeOauthAccountList },
      usecases: {
        list: listOauthAccounts,
        get: getOauthAccount,
        create: createOauthAccount,
        update: updateOauthAccount,
        remove: deleteOauthAccount,
      },
    },
    {
      name: 'user-session',
      rules: { parseId: parseUserSessionId, parseListParams: parseUserSessionListParams },
      model: { normalize: normalizeUserSession, normalizeList: normalizeUserSessionList },
      usecases: { list: listUserSessions, get: getUserSession, remove: revokeUserSession },
    },
    {
      name: 'user-mfa',
      rules: { parseId: parseUserMfaId, parsePayload: parseUserMfaPayload, parseListParams: parseUserMfaListParams },
      model: { normalize: normalizeUserMfa, normalizeList: normalizeUserMfaList },
      usecases: {
        list: listUserMfas,
        get: getUserMfa,
        create: createUserMfa,
        update: updateUserMfa,
        remove: deleteUserMfa,
        verify: verifyUserMfa,
        enable: enableUserMfa,
        disable: disableUserMfa,
      },
    },
  ];

  it('validates rules and models', () => {
    modules.forEach((module) => {
      expectIdParser(module.rules.parseId);
      if (module.rules.parsePayload) {
        expectPayloadParser(module.rules.parsePayload);
      }
      expectListParamsParser(module.rules.parseListParams);
      expectModelNormalizers(module.model.normalize, module.model.normalizeList);
    });
  });

  it('runs CRUD usecases', async () => {
    for (const module of modules) {
      await module.usecases.list({ page: 1 });
      await module.usecases.get('1');
      if (module.usecases.create) {
        await module.usecases.create({ name: 'value' });
      }
      if (module.usecases.update) {
        await module.usecases.update('1', { name: 'value' });
      }
      await module.usecases.remove('1');
      if (module.usecases.listExtra) {
        await module.usecases.listExtra('1');
      }
      if (module.usecases.verify) {
        await module.usecases.verify('1', { code: '123456' });
      }
      if (module.usecases.enable) {
        await module.usecases.enable('1', { enabled: true });
      }
      if (module.usecases.disable) {
        await module.usecases.disable('1', { enabled: false });
      }
    }
  });

  it('handles invalid ids', async () => {
    for (const module of modules) {
      await expect(module.usecases.get(null)).rejects.toBeDefined();
    }
  });
});
