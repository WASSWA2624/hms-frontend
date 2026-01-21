/**
 * Auth Rules
 * Validation for auth payloads
 * File: auth.rules.js
 */
import { z } from 'zod';

const credentialsSchema = z
  .object({
    email: z.string().min(1),
    password: z.string().min(1),
  })
  .passthrough();

const authPayloadSchema = z.object({}).passthrough();

const parseCredentials = (value) => credentialsSchema.parse(value ?? {});
const parseAuthPayload = (value) => authPayloadSchema.parse(value ?? {});

export { parseCredentials, parseAuthPayload };
