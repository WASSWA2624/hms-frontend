import { handleError } from '@errors';
import { endpoints } from '@config/endpoints';
import {
  normalizeLedgerPayload,
  normalizeWorkItemsPayload,
  normalizeWorkspacePayload,
} from './billing-workspace.model';
import { billingWorkspaceApi } from './billing-workspace.api';
import {
  parseApproveApprovalPayload,
  parseIdentifier,
  parseIssueInvoicePayload,
  parseLedgerParams,
  parseReconcilePaymentPayload,
  parseRejectApprovalPayload,
  parseRequestAdjustmentPayload,
  parseRequestRefundPayload,
  parseRequestVoidPayload,
  parseSendInvoicePayload,
  parseWorkItemsParams,
  parseWorkspaceParams,
} from './billing-workspace.rules';

const execute = async (work) => {
  try {
    return await work();
  } catch (error) {
    throw handleError(error);
  }
};

const listBillingWorkspace = async (params = {}) =>
  execute(async () => {
    const parsedParams = parseWorkspaceParams(params);
    const response = await billingWorkspaceApi.listWorkspace(parsedParams);
    return normalizeWorkspacePayload(response.data);
  });

const listBillingWorkItems = async (params = {}) =>
  execute(async () => {
    const parsedParams = parseWorkItemsParams(params);
    const response = await billingWorkspaceApi.listWorkItems(parsedParams);
    return normalizeWorkItemsPayload(response.data);
  });

const getPatientBillingLedger = async (patientIdentifier, params = {}) =>
  execute(async () => {
    const parsedPatientIdentifier = parseIdentifier(patientIdentifier);
    const parsedParams = parseLedgerParams(params);
    const response = await billingWorkspaceApi.getPatientLedger(
      parsedPatientIdentifier,
      parsedParams
    );
    return normalizeLedgerPayload(response.data);
  });

const issueBillingInvoice = async (invoiceIdentifier, payload = {}) =>
  execute(async () => {
    const parsedInvoiceIdentifier = parseIdentifier(invoiceIdentifier);
    const parsedPayload = parseIssueInvoicePayload(payload);
    const response = await billingWorkspaceApi.issueInvoice(
      parsedInvoiceIdentifier,
      parsedPayload
    );
    return response.data || null;
  });

const sendBillingInvoice = async (invoiceIdentifier, payload = {}) =>
  execute(async () => {
    const parsedInvoiceIdentifier = parseIdentifier(invoiceIdentifier);
    const parsedPayload = parseSendInvoicePayload(payload);
    const response = await billingWorkspaceApi.sendInvoice(
      parsedInvoiceIdentifier,
      parsedPayload
    );
    return response.data || null;
  });

const requestBillingInvoiceVoid = async (invoiceIdentifier, payload = {}) =>
  execute(async () => {
    const parsedInvoiceIdentifier = parseIdentifier(invoiceIdentifier);
    const parsedPayload = parseRequestVoidPayload(payload);
    const response = await billingWorkspaceApi.requestInvoiceVoid(
      parsedInvoiceIdentifier,
      parsedPayload
    );
    return response.data || null;
  });

const reconcileBillingPayment = async (paymentIdentifier, payload = {}) =>
  execute(async () => {
    const parsedPaymentIdentifier = parseIdentifier(paymentIdentifier);
    const parsedPayload = parseReconcilePaymentPayload(payload);
    const response = await billingWorkspaceApi.reconcilePayment(
      parsedPaymentIdentifier,
      parsedPayload
    );
    return response.data || null;
  });

const requestBillingPaymentRefund = async (paymentIdentifier, payload = {}) =>
  execute(async () => {
    const parsedPaymentIdentifier = parseIdentifier(paymentIdentifier);
    const parsedPayload = parseRequestRefundPayload(payload);
    const response = await billingWorkspaceApi.requestPaymentRefund(
      parsedPaymentIdentifier,
      parsedPayload
    );
    return response.data || null;
  });

const requestBillingAdjustment = async (payload = {}) =>
  execute(async () => {
    const parsedPayload = parseRequestAdjustmentPayload(payload);
    const response = await billingWorkspaceApi.requestAdjustment(parsedPayload);
    return response.data || null;
  });

const approveBillingApproval = async (approvalIdentifier, payload = {}) =>
  execute(async () => {
    const parsedApprovalIdentifier = parseIdentifier(approvalIdentifier);
    const parsedPayload = parseApproveApprovalPayload(payload);
    const response = await billingWorkspaceApi.approveApproval(
      parsedApprovalIdentifier,
      parsedPayload
    );
    return response.data || null;
  });

const rejectBillingApproval = async (approvalIdentifier, payload = {}) =>
  execute(async () => {
    const parsedApprovalIdentifier = parseIdentifier(approvalIdentifier);
    const parsedPayload = parseRejectApprovalPayload(payload);
    const response = await billingWorkspaceApi.rejectApproval(
      parsedApprovalIdentifier,
      parsedPayload
    );
    return response.data || null;
  });

const getBillingInvoiceDocumentUrl = (invoiceIdentifier) => {
  const parsedInvoiceIdentifier = parseIdentifier(invoiceIdentifier);
  return endpoints.BILLING_WORKSPACE.INVOICE_DOCUMENT(
    encodeURIComponent(parsedInvoiceIdentifier)
  );
};

export {
  listBillingWorkspace,
  listBillingWorkItems,
  getPatientBillingLedger,
  issueBillingInvoice,
  sendBillingInvoice,
  requestBillingInvoiceVoid,
  reconcileBillingPayment,
  requestBillingPaymentRefund,
  requestBillingAdjustment,
  approveBillingApproval,
  rejectBillingApproval,
  getBillingInvoiceDocumentUrl,
};
