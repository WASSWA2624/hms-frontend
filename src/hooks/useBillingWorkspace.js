import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  approveBillingApproval,
  getBillingInvoiceDocumentUrl,
  getPatientBillingLedger,
  issueBillingInvoice,
  listBillingWorkItems,
  listBillingWorkspace,
  reconcileBillingPayment,
  rejectBillingApproval,
  requestBillingAdjustment,
  requestBillingInvoiceVoid,
  requestBillingPaymentRefund,
  sendBillingInvoice,
} from '@features/billing-workspace';

const useBillingWorkspace = () => {
  const actions = useMemo(
    () => ({
      listWorkspace: listBillingWorkspace,
      listWorkItems: listBillingWorkItems,
      getPatientLedger: getPatientBillingLedger,
      issueInvoice: issueBillingInvoice,
      sendInvoice: sendBillingInvoice,
      requestInvoiceVoid: requestBillingInvoiceVoid,
      reconcilePayment: reconcileBillingPayment,
      requestPaymentRefund: requestBillingPaymentRefund,
      requestAdjustment: requestBillingAdjustment,
      approveApproval: approveBillingApproval,
      rejectApproval: rejectBillingApproval,
      getInvoiceDocumentUrl: getBillingInvoiceDocumentUrl,
    }),
    []
  );

  return useCrud(actions);
};

export default useBillingWorkspace;
