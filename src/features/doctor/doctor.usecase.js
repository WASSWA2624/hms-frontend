/**
 * Doctor Use Cases
 * File: doctor.usecase.js
 */
import { handleError } from '@errors';
import { doctorApi } from './doctor.api';
import { normalizeDoctor, normalizeDoctorList } from './doctor.model';
import {
  parseCreateDoctorPayload,
  parseDoctorId,
  parseDoctorListParams,
  parseUpdateDoctorPayload,
} from './doctor.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listDoctors = async (params = {}) =>
  execute(async () => {
    const parsed = parseDoctorListParams(params);
    const response = await doctorApi.list(parsed);
    return normalizeDoctorList(response.data);
  });

const getDoctor = async (id) =>
  execute(async () => {
    const parsedId = parseDoctorId(id);
    const response = await doctorApi.get(parsedId);
    return normalizeDoctor(response.data);
  });

const createDoctor = async (payload = {}) =>
  execute(async () => {
    const parsed = parseCreateDoctorPayload(payload);
    const response = await doctorApi.create(parsed);
    return normalizeDoctor(response.data);
  });

const updateDoctor = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseDoctorId(id);
    const parsed = parseUpdateDoctorPayload(payload);
    const response = await doctorApi.update(parsedId, parsed);
    return normalizeDoctor(response.data);
  });

export { listDoctors, getDoctor, createDoctor, updateDoctor };
