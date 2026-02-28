import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { Linking, Platform } from 'react-native';
import { SCOPE_KEYS } from '@config/accessPolicy';
import { useBillingWorkspace, useNetwork, useScopeAccess } from '@hooks';

const normalize = (value) => String(value || '').trim();
const upper = (value) => normalize(value).toUpperCase();

const buildDefaultDraft = () => ({
  invoiceIdentifier: '',
  paymentIdentifier: '',
  recipientEmail: '',
  amount: '',
  reason: '',
  notes: '',
  adjustmentStatus: 'ISSUED',
});

const buildOption = (value, label) => {
  const normalizedValue = normalize(value);
  if (!normalizedValue) return null;
  return {
    value: normalizedValue,
    label: normalize(label) || 'Record',
  };
};

const openExternalUrl = async (url) => {
  const normalizedUrl = normalize(url);
  if (!normalizedUrl) return false;
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(normalizedUrl, '_blank', 'noopener,noreferrer');
      return true;
    }
    await Linking.openURL(normalizedUrl);
    return true;
  } catch {
    return false;
  }
};

const useBillingWorkbenchScreen = () => {
  const router = useRouter();
  const { isOffline } = useNetwork();
  const workspaceApi = useBillingWorkspace();
  const scope = useScopeAccess(SCOPE_KEYS.BILLING);

  const [workspace, setWorkspace] = useState(null);
  const [activeQueue, setActiveQueue] = useState('NEEDS_ISSUE');
  const [queueItems, setQueueItems] = useState([]);
  const [selectedQueueItem, setSelectedQueueItem] = useState(null);
  const [selectedPatientDisplayId, setSelectedPatientDisplayId] = useState('');
  const [ledger, setLedger] = useState(null);
  const [actionType, setActionType] = useState('ISSUE_INVOICE');
  const [actionDraft, setActionDraft] = useState(buildDefaultDraft);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusVariant, setStatusVariant] = useState('info');
  const [isWorkspaceLoading, setIsWorkspaceLoading] = useState(false);
  const [isQueueLoading, setIsQueueLoading] = useState(false);
  const [isLedgerLoading, setIsLedgerLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const canRead = scope.canRead && (scope.canManageAllTenants || Boolean(normalize(scope.tenantId)));
  const canWrite = scope.canWrite && !isOffline;
  const canApprove = scope.roles.some((role) =>
    ['SUPER_ADMIN', 'TENANT_ADMIN', 'FACILITY_ADMIN'].includes(upper(role))
  );

  const buildBaseQuery = useCallback(() => {
    const query = {
      page: 1,
      limit: 60,
    };
    if (!scope.canManageAllTenants && normalize(scope.facilityId)) {
      query.facility_id = normalize(scope.facilityId);
    }
    return query;
  }, [scope.canManageAllTenants, scope.facilityId]);

  const loadWorkspace = useCallback(
    async ({ silent = false } = {}) => {
      if (!canRead) return null;
      if (!silent) setIsWorkspaceLoading(true);
      const payload = await workspaceApi.listWorkspace(buildBaseQuery());
      if (payload) {
        setWorkspace(payload);
        if (!activeQueue && Array.isArray(payload.queues) && payload.queues.length > 0) {
          setActiveQueue(normalize(payload.queues[0].queue));
        }
      }
      if (!silent) setIsWorkspaceLoading(false);
      return payload;
    },
    [activeQueue, buildBaseQuery, canRead, workspaceApi]
  );

  const loadQueue = useCallback(
    async (queue, { silent = false } = {}) => {
      const normalizedQueue = upper(queue);
      if (!normalizedQueue || !canRead) return null;
      if (!silent) setIsQueueLoading(true);
      setActiveQueue(normalizedQueue);
      const payload = await workspaceApi.listWorkItems({
        ...buildBaseQuery(),
        queue: normalizedQueue,
      });
      if (payload?.items) {
        setQueueItems(payload.items);
      } else {
        setQueueItems([]);
      }
      if (!silent) setIsQueueLoading(false);
      return payload;
    },
    [buildBaseQuery, canRead, workspaceApi]
  );

  const loadLedger = useCallback(
    async (patientIdentifier, { silent = false } = {}) => {
      const normalizedPatientIdentifier = normalize(patientIdentifier);
      if (!normalizedPatientIdentifier || !canRead) return null;
      if (!silent) setIsLedgerLoading(true);
      setSelectedPatientDisplayId(normalizedPatientIdentifier);
      const payload = await workspaceApi.getPatientLedger(normalizedPatientIdentifier, {
        ...buildBaseQuery(),
        limit: 30,
      });
      if (payload) {
        setLedger(payload);
      }
      if (!silent) setIsLedgerLoading(false);
      return payload;
    },
    [buildBaseQuery, canRead, workspaceApi]
  );

  const refreshSections = useCallback(
    async ({ refreshQueue = true, refreshLedger = true } = {}) => {
      await loadWorkspace({ silent: true });
      if (refreshQueue && normalize(activeQueue)) {
        await loadQueue(activeQueue, { silent: true });
      }
      if (refreshLedger && normalize(selectedPatientDisplayId)) {
        await loadLedger(selectedPatientDisplayId, { silent: true });
      }
    },
    [activeQueue, loadLedger, loadQueue, loadWorkspace, selectedPatientDisplayId]
  );

  useEffect(() => {
    if (!scope.isResolved || !canRead) return;
    loadWorkspace();
  }, [canRead, loadWorkspace, scope.isResolved]);

  useEffect(() => {
    if (!scope.isResolved || !canRead) return;
    if (!normalize(activeQueue)) return;
    loadQueue(activeQueue);
  }, [activeQueue, canRead, loadQueue, scope.isResolved]);

  const onSelectQueueItem = useCallback(
    (item) => {
      if (!item || typeof item !== 'object') return;
      setSelectedQueueItem(item);
      const patientIdentifier = normalize(item.patient_display_id || item.patient_backend_identifier);
      if (patientIdentifier) {
        loadLedger(patientIdentifier, { silent: true });
      }
    },
    [loadLedger]
  );

  const onOpenPatientLedger = useCallback(
    async (patientIdentifier) => {
      await loadLedger(patientIdentifier);
    },
    [loadLedger]
  );

  const onClosePatientLedger = useCallback(() => {
    setLedger(null);
    setSelectedPatientDisplayId('');
  }, []);

  const onDownloadInvoice = useCallback(
    async (invoiceIdentifier) => {
      const normalizedIdentifier = normalize(invoiceIdentifier);
      if (!normalizedIdentifier) return;
      const url = await workspaceApi.getInvoiceDocumentUrl(normalizedIdentifier);
      const opened = await openExternalUrl(url);
      if (!opened) {
        setStatusVariant('error');
        setStatusMessage('Could not open invoice document.');
      }
    },
    [workspaceApi]
  );

  const onDraftChange = useCallback((field, value) => {
    setActionDraft((previous) => ({
      ...previous,
      [field]: value,
    }));
  }, []);

  const resetActionDraft = useCallback(() => {
    setActionDraft(buildDefaultDraft());
  }, []);

  const runMutation = useCallback(
    async (work) => {
      if (!canWrite) {
        setStatusVariant('error');
        setStatusMessage(
          isOffline
            ? 'Actions are unavailable while offline.'
            : 'You do not have permission to perform this action.'
        );
        return null;
      }

      setIsActionLoading(true);
      setStatusMessage('');
      try {
        return await work();
      } finally {
        setIsActionLoading(false);
      }
    },
    [canWrite, isOffline]
  );

  const resolveQueueItemIdentifier = (item) =>
    normalize(
      item?.approval_backend_identifier ||
        item?.backend_identifier ||
        item?.display_id ||
        item?.approval_display_id
    );

  const onApproveApproval = useCallback(
    async (item) => {
      if (!canApprove) {
        setStatusVariant('error');
        setStatusMessage('Approval action requires admin privileges.');
        return;
      }
      const approvalIdentifier = resolveQueueItemIdentifier(item);
      if (!approvalIdentifier) return;
      const result = await runMutation(() =>
        workspaceApi.approveApproval(approvalIdentifier, {
          decision_notes: 'Approved from billing queue.',
        })
      );
      if (!result) return;
      setStatusVariant('success');
      setStatusMessage('Approval completed.');
      await refreshSections();
    },
    [canApprove, refreshSections, runMutation, workspaceApi]
  );

  const onRejectApproval = useCallback(
    async (item) => {
      if (!canApprove) {
        setStatusVariant('error');
        setStatusMessage('Approval action requires admin privileges.');
        return;
      }
      const approvalIdentifier = resolveQueueItemIdentifier(item);
      if (!approvalIdentifier) return;
      const result = await runMutation(() =>
        workspaceApi.rejectApproval(approvalIdentifier, {
          reason: 'Rejected from billing queue.',
          decision_notes: 'Rejected from billing queue.',
        })
      );
      if (!result) return;
      setStatusVariant('success');
      setStatusMessage('Approval rejected.');
      await refreshSections();
    },
    [canApprove, refreshSections, runMutation, workspaceApi]
  );

  const onSubmitAction = useCallback(async () => {
    const invoiceIdentifier = normalize(actionDraft.invoiceIdentifier);
    const paymentIdentifier = normalize(actionDraft.paymentIdentifier);
    const notes = normalize(actionDraft.notes) || null;
    const amount = normalize(actionDraft.amount) || undefined;
    const reason = normalize(actionDraft.reason);
    const recipientEmail = normalize(actionDraft.recipientEmail) || undefined;

    const result = await runMutation(async () => {
      if (actionType === 'ISSUE_INVOICE') {
        if (!invoiceIdentifier) return null;
        return workspaceApi.issueInvoice(invoiceIdentifier, { notes });
      }
      if (actionType === 'SEND_INVOICE') {
        if (!invoiceIdentifier) return null;
        return workspaceApi.sendInvoice(invoiceIdentifier, {
          recipient_email: recipientEmail,
          notes,
        });
      }
      if (actionType === 'REQUEST_VOID') {
        if (!invoiceIdentifier || !reason) return null;
        return workspaceApi.requestInvoiceVoid(invoiceIdentifier, { reason, notes });
      }
      if (actionType === 'RECORD_PAYMENT') {
        if (!paymentIdentifier) return null;
        return workspaceApi.reconcilePayment(paymentIdentifier, {
          status: 'COMPLETED',
          notes,
        });
      }
      if (actionType === 'REQUEST_REFUND') {
        if (!paymentIdentifier || !reason) return null;
        return workspaceApi.requestPaymentRefund(paymentIdentifier, {
          amount,
          reason,
          notes,
        });
      }
      if (actionType === 'REQUEST_ADJUSTMENT') {
        if (!invoiceIdentifier || !amount || !reason) return null;
        return workspaceApi.requestAdjustment({
          invoice_id: invoiceIdentifier,
          amount,
          reason,
          status: normalize(actionDraft.adjustmentStatus || 'ISSUED'),
          notes,
        });
      }
      return null;
    });

    if (!result) {
      setStatusVariant('error');
      setStatusMessage('Action failed. Check required fields and try again.');
      return;
    }

    setStatusVariant('success');
    setStatusMessage('Action submitted successfully.');
    resetActionDraft();
    await refreshSections();
  }, [
    actionDraft.adjustmentStatus,
    actionDraft.amount,
    actionDraft.invoiceIdentifier,
    actionDraft.notes,
    actionDraft.paymentIdentifier,
    actionDraft.reason,
    actionDraft.recipientEmail,
    actionType,
    refreshSections,
    resetActionDraft,
    runMutation,
    workspaceApi,
  ]);

  const invoiceOptions = useMemo(() => {
    const byValue = new Map();
    const sources = [
      ...(workspace?.timeline?.items || []),
      ...(queueItems || []),
      ...(ledger?.ledger?.items || []),
    ];
    sources.forEach((entry) => {
      const value = normalize(entry.invoice_display_id || entry.display_id || entry.invoice_backend_identifier);
      if (!value || byValue.has(value)) return;
      const labelBase = normalize(entry.invoice_display_id || entry.display_id) || 'Invoice';
      const patientName = normalize(entry.patient_display_name);
      byValue.set(
        value,
        buildOption(value, patientName ? `${labelBase} | ${patientName}` : labelBase)
      );
    });
    return Array.from(byValue.values()).filter(Boolean);
  }, [ledger?.ledger?.items, queueItems, workspace?.timeline?.items]);

  const paymentOptions = useMemo(() => {
    const byValue = new Map();
    const sources = [
      ...(workspace?.timeline?.items || []),
      ...(queueItems || []),
    ];
    sources.forEach((entry) => {
      const value = normalize(
        entry.payment_display_id ||
          (upper(entry.type) === 'PAYMENT' ? entry.backend_identifier : null) ||
          entry.payment_backend_identifier
      );
      if (!value || byValue.has(value)) return;
      const labelBase = normalize(entry.payment_display_id || entry.display_id) || 'Payment';
      const patientName = normalize(entry.patient_display_name);
      byValue.set(
        value,
        buildOption(value, patientName ? `${labelBase} | ${patientName}` : labelBase)
      );
    });
    return Array.from(byValue.values()).filter(Boolean);
  }, [queueItems, workspace?.timeline?.items]);

  const queueList = useMemo(() => {
    const rows = Array.isArray(workspace?.queues) ? workspace.queues : [];
    if (rows.length > 0) return rows;
    return [
      { queue: 'NEEDS_ISSUE', label: 'Needs issue', count: 0 },
      { queue: 'PENDING_PAYMENT', label: 'Pending payment', count: 0 },
      { queue: 'CLAIMS_PENDING', label: 'Claims pending', count: 0 },
      { queue: 'APPROVAL_REQUIRED', label: 'Approval required', count: 0 },
      { queue: 'OVERDUE', label: 'Overdue', count: 0 },
    ];
  }, [workspace?.queues]);

  const timelineGroups = useMemo(
    () => (Array.isArray(workspace?.timeline?.groups) ? workspace.timeline.groups : []),
    [workspace?.timeline?.groups]
  );

  return {
    canViewWorkbench: canRead,
    canWrite,
    canApprove,
    isOffline,
    isLoading: !scope.isResolved || isWorkspaceLoading,
    isWorkspaceLoading,
    isQueueLoading,
    isLedgerLoading,
    isActionLoading,
    hasError: Boolean(workspaceApi.errorCode),
    errorCode: workspaceApi.errorCode,
    summary: workspace?.summary || {},
    queues: queueList,
    activeQueue,
    queueItems,
    selectedQueueItem,
    selectedQueueItemIdentifier: resolveQueueItemIdentifier(selectedQueueItem),
    timelineGroups,
    ledger,
    selectedPatientDisplayId,
    actionType,
    actionDraft,
    invoiceOptions,
    paymentOptions,
    statusMessage,
    statusVariant,
    onRetry: () => {
      loadWorkspace();
      if (normalize(activeQueue)) loadQueue(activeQueue);
      if (normalize(selectedPatientDisplayId)) loadLedger(selectedPatientDisplayId);
    },
    onSelectQueue: (queue) => loadQueue(queue),
    onSelectQueueItem,
    onOpenPatientLedger,
    onClosePatientLedger,
    onDownloadInvoice,
    onActionTypeChange: (value) => setActionType(normalize(value) || 'ISSUE_INVOICE'),
    onDraftChange,
    onSubmitAction,
    onApproveApproval,
    onRejectApproval,
    onOpenLegacyRoute: (path) => {
      const normalizedPath = normalize(path);
      if (!normalizedPath) return;
      router.push(normalizedPath);
    },
  };
};

export default useBillingWorkbenchScreen;
