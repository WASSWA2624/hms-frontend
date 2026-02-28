import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';

const billingWorkspaceApi = {
  listWorkspace: (params = {}) =>
    apiClient({
      url: `${endpoints.BILLING_WORKSPACE.WORKSPACE}${buildQueryString(params)}`,
      method: 'GET',
    }),
  listWorkItems: (params = {}) =>
    apiClient({
      url: `${endpoints.BILLING_WORKSPACE.WORK_ITEMS}${buildQueryString(params)}`,
      method: 'GET',
    }),
  getPatientLedger: (patientIdentifier, params = {}) =>
    apiClient({
      url: `${endpoints.BILLING_WORKSPACE.PATIENT_LEDGER(patientIdentifier)}${buildQueryString(params)}`,
      method: 'GET',
    }),
  issueInvoice: (invoiceIdentifier, payload = {}) =>
    apiClient({
      url: endpoints.BILLING_WORKSPACE.ISSUE_INVOICE(invoiceIdentifier),
      method: 'POST',
      body: payload,
    }),
  sendInvoice: (invoiceIdentifier, payload = {}) =>
    apiClient({
      url: endpoints.BILLING_WORKSPACE.SEND_INVOICE(invoiceIdentifier),
      method: 'POST',
      body: payload,
    }),
  requestInvoiceVoid: (invoiceIdentifier, payload = {}) =>
    apiClient({
      url: endpoints.BILLING_WORKSPACE.VOID_INVOICE(invoiceIdentifier),
      method: 'POST',
      body: payload,
    }),
  reconcilePayment: (paymentIdentifier, payload = {}) =>
    apiClient({
      url: endpoints.BILLING_WORKSPACE.RECONCILE_PAYMENT(paymentIdentifier),
      method: 'POST',
      body: payload,
    }),
  requestPaymentRefund: (paymentIdentifier, payload = {}) =>
    apiClient({
      url: endpoints.BILLING_WORKSPACE.REQUEST_PAYMENT_REFUND(paymentIdentifier),
      method: 'POST',
      body: payload,
    }),
  requestAdjustment: (payload = {}) =>
    apiClient({
      url: endpoints.BILLING_WORKSPACE.REQUEST_ADJUSTMENT,
      method: 'POST',
      body: payload,
    }),
  approveApproval: (approvalIdentifier, payload = {}) =>
    apiClient({
      url: endpoints.BILLING_WORKSPACE.APPROVE_APPROVAL(approvalIdentifier),
      method: 'POST',
      body: payload,
    }),
  rejectApproval: (approvalIdentifier, payload = {}) =>
    apiClient({
      url: endpoints.BILLING_WORKSPACE.REJECT_APPROVAL(approvalIdentifier),
      method: 'POST',
      body: payload,
    }),
};

export { billingWorkspaceApi };
