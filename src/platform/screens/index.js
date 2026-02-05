/**
 * Screens Barrel Export
 * Centralized export for all screen components
 * File: index.js
 * 
 * Per component-structure.mdc: Barrel files must use index.js (not index.jsx)
 * Screens are organized into category folders (common/, main/, etc.)
 */

// Common screens (public/common screens)
export { default as NotFoundScreen } from './common/NotFoundScreen';
export { default as ErrorScreen } from './common/ErrorScreen';

// Auth screens (authentication screens)
export { default as LoginScreen } from './auth/LoginScreen';
export { default as RegisterScreen } from './auth/RegisterScreen';
export { default as ForgotPasswordScreen } from './auth/ForgotPasswordScreen';
export { default as ResetPasswordScreen } from './auth/ResetPasswordScreen';
export { default as VerifyEmailScreen } from './auth/VerifyEmailScreen';
export { default as VerifyPhoneScreen } from './auth/VerifyPhoneScreen';
export { default as TenantSelectionScreen } from './auth/TenantSelectionScreen';
export { default as FacilitySelectionScreen } from './auth/FacilitySelectionScreen';

// Main screens (authenticated/main screens)
export { default as HomeScreen } from './main/HomeScreen';

// Settings screens (direct platform path so Metro resolves .android/.web, not barrel)
export { default as SettingsScreen } from './settings/SettingsScreen/SettingsScreen';
export { default as GeneralSettingsPanel } from './settings/GeneralSettingsPanel';
export { default as UserSessionListScreen } from './settings/UserSessionListScreen';
export { default as UserSessionDetailScreen } from './settings/UserSessionDetailScreen';
export { default as TenantListScreen } from './settings/TenantListScreen';
export { default as TenantDetailScreen } from './settings/TenantDetailScreen';
export { default as TenantFormScreen } from './settings/TenantFormScreen';
export { default as FacilityListScreen } from './settings/FacilityListScreen';
export { default as FacilityDetailScreen } from './settings/FacilityDetailScreen';
export { default as FacilityFormScreen } from './settings/FacilityFormScreen';
export { default as BranchListScreen } from './settings/BranchListScreen';
export { default as BranchDetailScreen } from './settings/BranchDetailScreen';
export { default as BranchFormScreen } from './settings/BranchFormScreen';
export { default as DepartmentListScreen } from './settings/DepartmentListScreen';
export { default as DepartmentDetailScreen } from './settings/DepartmentDetailScreen';
export { default as DepartmentFormScreen } from './settings/DepartmentFormScreen';
export { default as UnitListScreen } from './settings/UnitListScreen';
export { default as UnitDetailScreen } from './settings/UnitDetailScreen';
export { default as UnitFormScreen } from './settings/UnitFormScreen';
export { default as RoomListScreen } from './settings/RoomListScreen';
export { default as RoomDetailScreen } from './settings/RoomDetailScreen';
export { default as RoomFormScreen } from './settings/RoomFormScreen';
export { default as WardListScreen } from './settings/WardListScreen';
export { default as WardDetailScreen } from './settings/WardDetailScreen';
export { default as WardFormScreen } from './settings/WardFormScreen';
export { default as BedListScreen } from './settings/BedListScreen';
export { default as BedDetailScreen } from './settings/BedDetailScreen';
export { default as BedFormScreen } from './settings/BedFormScreen';
export { default as AddressListScreen } from './settings/AddressListScreen';
export { default as AddressDetailScreen } from './settings/AddressDetailScreen';
export { default as ContactListScreen } from './settings/ContactListScreen';
export { default as ContactDetailScreen } from './settings/ContactDetailScreen';
export { default as UserListScreen } from './settings/UserListScreen';
export { default as UserDetailScreen } from './settings/UserDetailScreen';
export { default as UserProfileListScreen } from './settings/UserProfileListScreen';
export { default as UserProfileDetailScreen } from './settings/UserProfileDetailScreen';
export { default as RoleListScreen } from './settings/RoleListScreen';
export { default as RoleDetailScreen } from './settings/RoleDetailScreen';
export { default as PermissionListScreen } from './settings/PermissionListScreen';
export { default as PermissionDetailScreen } from './settings/PermissionDetailScreen';
export { default as RolePermissionListScreen } from './settings/RolePermissionListScreen';
export { default as RolePermissionDetailScreen } from './settings/RolePermissionDetailScreen';
export { default as UserRoleListScreen } from './settings/UserRoleListScreen';
export { default as UserRoleDetailScreen } from './settings/UserRoleDetailScreen';
export { default as ApiKeyListScreen } from './settings/ApiKeyListScreen';
export { default as ApiKeyDetailScreen } from './settings/ApiKeyDetailScreen';
export { default as ApiKeyPermissionListScreen } from './settings/ApiKeyPermissionListScreen';
export { default as ApiKeyPermissionDetailScreen } from './settings/ApiKeyPermissionDetailScreen';
export { default as UserMfaListScreen } from './settings/UserMfaListScreen';
export { default as UserMfaDetailScreen } from './settings/UserMfaDetailScreen';
export { default as OauthAccountListScreen } from './settings/OauthAccountListScreen';
export { default as OauthAccountDetailScreen } from './settings/OauthAccountDetailScreen';
