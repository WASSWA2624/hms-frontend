/**
 * OPD Flow Use Cases
 * File: opd-flow.usecase.js
 */
import { handleError } from '@errors';
import { opdFlowApi } from './opd-flow.api';
import { normalizeOpdFlowList, normalizeOpdFlowSnapshot } from './opd-flow.model';
import {
  parseAssignDoctorPayload,
  parseDispositionPayload,
  parseDoctorReviewPayload,
  parseOpdFlowId,
  parseOpdFlowListParams,
  parsePayConsultationPayload,
  parseRecordVitalsPayload,
  parseStartOpdFlowPayload,
} from './opd-flow.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listOpdFlows = async (params = {}) =>
  execute(async () => {
    const parsed = parseOpdFlowListParams(params);
    const response = await opdFlowApi.list(parsed);
    return normalizeOpdFlowList(response.data);
  });

const getOpdFlow = async (id) =>
  execute(async () => {
    const parsedId = parseOpdFlowId(id);
    const response = await opdFlowApi.get(parsedId);
    return normalizeOpdFlowSnapshot(response.data);
  });

const startOpdFlow = async (payload = {}) =>
  execute(async () => {
    const parsed = parseStartOpdFlowPayload(payload);
    const response = await opdFlowApi.start(parsed);
    return normalizeOpdFlowSnapshot(response.data);
  });

const payConsultation = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseOpdFlowId(id);
    const parsed = parsePayConsultationPayload(payload);
    const response = await opdFlowApi.payConsultation(parsedId, parsed);
    return normalizeOpdFlowSnapshot(response.data);
  });

const recordVitals = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseOpdFlowId(id);
    const parsed = parseRecordVitalsPayload(payload);
    const response = await opdFlowApi.recordVitals(parsedId, parsed);
    return normalizeOpdFlowSnapshot(response.data);
  });

const assignDoctor = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseOpdFlowId(id);
    const parsed = parseAssignDoctorPayload(payload);
    const response = await opdFlowApi.assignDoctor(parsedId, parsed);
    return normalizeOpdFlowSnapshot(response.data);
  });

const doctorReview = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseOpdFlowId(id);
    const parsed = parseDoctorReviewPayload(payload);
    const response = await opdFlowApi.doctorReview(parsedId, parsed);
    return normalizeOpdFlowSnapshot(response.data);
  });

const disposition = async (id, payload = {}) =>
  execute(async () => {
    const parsedId = parseOpdFlowId(id);
    const parsed = parseDispositionPayload(payload);
    const response = await opdFlowApi.disposition(parsedId, parsed);
    return normalizeOpdFlowSnapshot(response.data);
  });

export {
  listOpdFlows,
  getOpdFlow,
  startOpdFlow,
  payConsultation,
  recordVitals,
  assignDoctor,
  doctorReview,
  disposition,
};
