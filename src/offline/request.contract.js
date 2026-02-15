/**
 * Offline Request Contract
 * Validates queued mutations against mounted backend route groups.
 * File: request.contract.js
 */
import { API_BASE_URL, API_VERSION } from '@config/env';
import { endpoints } from '@config/endpoints';

const FALLBACK_ORIGIN = 'http://localhost';
const MUTATION_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const API_PATH_PREFIX = `/api/${API_VERSION}/`;
const SAMPLE_ARGS = ['__offline_a__', '__offline_b__', '__offline_c__'];

const normalizeBaseUrl = (value) => String(value || '').replace(/\/+$/, '');

const normalizeMethod = (method) => String(method || 'GET').trim().toUpperCase();

const resolveUrl = (url) => {
  if (typeof url !== 'string' || !url.trim()) return null;

  const base =
    normalizeBaseUrl(API_BASE_URL) || FALLBACK_ORIGIN;

  try {
    return new URL(url, `${base}/`);
  } catch {
    return null;
  }
};

const extractMountedSegment = (url) => {
  const parsed = resolveUrl(url);
  if (!parsed) return null;

  const normalizedPath = String(parsed.pathname || '').replace(/\/+/g, '/');
  const prefixIndex = normalizedPath.indexOf(API_PATH_PREFIX);
  if (prefixIndex === -1) return null;

  const suffix = normalizedPath.slice(prefixIndex + API_PATH_PREFIX.length);
  const [segment] = suffix.split('/').filter(Boolean);
  return segment || null;
};

const collectEndpointSamples = (node, collector) => {
  if (!node || typeof node !== 'object') return;

  Object.values(node).forEach((value) => {
    if (typeof value === 'string') {
      collector.add(value);
      return;
    }

    if (typeof value === 'function') {
      try {
        const arity = Math.max(1, value.length || 0);
        const sample = value(...SAMPLE_ARGS.slice(0, arity));
        if (typeof sample === 'string') {
          collector.add(sample);
        }
      } catch {
        // Ignore dynamic endpoint helpers that reject placeholder params.
      }
      return;
    }

    if (typeof value === 'object') {
      collectEndpointSamples(value, collector);
    }
  });
};

const createMountedSegments = () => {
  const samples = new Set();
  collectEndpointSamples(endpoints, samples);

  const segments = new Set();
  samples.forEach((sample) => {
    const segment = extractMountedSegment(sample);
    if (segment) {
      segments.add(segment);
    }
  });

  return segments;
};

const mountedSegments = createMountedSegments();

const isMountedMutationRoute = (url) => {
  const segment = extractMountedSegment(url);
  return Boolean(segment && mountedSegments.has(segment));
};

const isQueueableRequest = (request) => {
  if (!request || typeof request !== 'object') return false;
  if (typeof request.url !== 'string' || !request.url.trim()) return false;

  const method = normalizeMethod(request.method);
  if (!MUTATION_METHODS.has(method)) return false;

  return isMountedMutationRoute(request.url);
};

const sanitizeQueueRequest = (request) => {
  const sanitized = {
    url: String(request?.url || '').trim(),
    method: normalizeMethod(request?.method),
  };

  if (Object.prototype.hasOwnProperty.call(request || {}, 'body')) {
    sanitized.body = request.body;
  }

  if (Object.prototype.hasOwnProperty.call(request || {}, 'headers')) {
    sanitized.headers = request.headers;
  }

  if (Object.prototype.hasOwnProperty.call(request || {}, 'timeout')) {
    sanitized.timeout = request.timeout;
  }

  return sanitized;
};

export {
  MUTATION_METHODS,
  normalizeMethod,
  isMountedMutationRoute,
  isQueueableRequest,
  sanitizeQueueRequest,
};

export default {
  MUTATION_METHODS,
  normalizeMethod,
  isMountedMutationRoute,
  isQueueableRequest,
  sanitizeQueueRequest,
};
