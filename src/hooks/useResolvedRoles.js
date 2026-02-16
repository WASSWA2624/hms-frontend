/**
 * useResolvedRoles Hook
 * Resolves roles from auth state, with JWT fallback when user roles are missing.
 * File: useResolvedRoles.js
 */
import { useEffect, useMemo, useState } from 'react';
import { tokenManager } from '@security';
import useAuth from './useAuth';
import { normalizeRoles } from './roleUtils';

const tokenRoleCache = {
  accessToken: null,
  roles: [],
  resolved: false,
};

const clearTokenRoleCache = () => {
  tokenRoleCache.accessToken = null;
  tokenRoleCache.roles = [];
  tokenRoleCache.resolved = false;
};

const setTokenRoleCache = (accessToken, roles) => {
  tokenRoleCache.accessToken = accessToken || null;
  tokenRoleCache.roles = Array.isArray(roles) ? roles : [];
  tokenRoleCache.resolved = true;
};

const decodeBase64 = (value) => {
  if (typeof value !== 'string') return null;
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));
  const normalized = `${base64}${padding}`;

  if (typeof globalThis?.atob === 'function') {
    try {
      return globalThis.atob(normalized);
    } catch {
      return null;
    }
  }

  const nodeBuffer = globalThis?.Buffer;
  if (nodeBuffer && typeof nodeBuffer.from === 'function') {
    return nodeBuffer.from(normalized, 'base64').toString('utf8');
  }
  return null;
};

const parseJwtPayload = (token) => {
  if (typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  const decoded = decodeBase64(parts[1]);
  if (!decoded) return null;
  try {
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

const flattenRoleCandidates = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap(flattenRoleCandidates);
  if (typeof value === 'string') {
    if (value.includes(' ')) {
      return value.split(' ').map((part) => part.trim()).filter(Boolean);
    }
    return [value];
  }
  return [value];
};

const extractRolesFromPayload = (payload) => {
  if (!payload || typeof payload !== 'object') return [];
  const candidates = [
    payload.roles,
    payload.role,
    payload.authorities,
    payload.permissions,
    payload.scope,
    payload.scopes,
    payload?.realm_access?.roles,
  ];

  return normalizeRoles(candidates.flatMap(flattenRoleCandidates));
};

const useResolvedRoles = () => {
  const { isAuthenticated, roles: authRoles } = useAuth();
  const [tokenRoles, setTokenRoles] = useState(() => tokenRoleCache.roles);
  const [isTokenResolved, setIsTokenResolved] = useState(() => tokenRoleCache.resolved);

  useEffect(() => {
    let active = true;

    if (!isAuthenticated) {
      clearTokenRoleCache();
      setTokenRoles([]);
      setIsTokenResolved(true);
      return () => {
        active = false;
      };
    }

    if (authRoles.length > 0) {
      clearTokenRoleCache();
      setTokenRoles([]);
      setIsTokenResolved(true);
      return () => {
        active = false;
      };
    }

    const resolveFromToken = async () => {
      let accessToken = null;
      try {
        accessToken = await tokenManager.getAccessToken();
        if (!active) return;
        const cacheToken = accessToken || null;
        if (tokenRoleCache.resolved && tokenRoleCache.accessToken === cacheToken) {
          setTokenRoles(tokenRoleCache.roles);
          setIsTokenResolved(true);
          return;
        }

        const payload = parseJwtPayload(accessToken);
        const resolvedRoles = extractRolesFromPayload(payload);
        setTokenRoleCache(accessToken, resolvedRoles);
        setTokenRoles(resolvedRoles);
      } catch {
        if (!active) return;
        setTokenRoles(tokenRoleCache.resolved ? tokenRoleCache.roles : []);
      } finally {
        if (active) setIsTokenResolved(true);
      }
    };

    resolveFromToken();
    return () => {
      active = false;
    };
  }, [isAuthenticated, authRoles]);

  const roles = useMemo(
    () => (authRoles.length > 0 ? authRoles : tokenRoles),
    [authRoles, tokenRoles]
  );
  const isResolved = !isAuthenticated || authRoles.length > 0 || isTokenResolved;

  return { roles, isResolved };
};

export default useResolvedRoles;
