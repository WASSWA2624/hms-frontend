import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SCOPE_KEYS } from '@config/accessPolicy';
import { parsePharmacyWorkbenchRouteState } from '@features/pharmacy-workspace';
import {
  useI18n,
  useNetwork,
  usePharmacyWorkspace,
  useRealtimeEvent,
  useScopeAccess,
} from '@hooks';

const SESSION = {
  panel: 'orders',
  orderSearch: '',
  orderStatus: '',
  stockSearch: '',
  lowStockOnly: false,
};

const ORDER_STATUS_OPTIONS = ['', 'ORDERED', 'PARTIALLY_DISPENSED', 'DISPENSED', 'CANCELLED'];
const INVENTORY_REASON_OPTIONS = ['OTHER', 'PURCHASE', 'RETURN', 'DAMAGE', 'EXPIRY'];

const orderSummaryDefaults = {
  total_orders: 0,
  ordered_queue: 0,
  partially_dispensed_queue: 0,
  dispensed_orders: 0,
  cancelled_orders: 0,
  pending_attestations: 0,
};

const stockSummaryDefaults = {
  total_stock_rows: 0,
  low_stock_rows: 0,
};

const sanitize = (value) => String(value || '').trim();
const norm = (value) => (Array.isArray(value) ? sanitize(value[0]) : sanitize(value));
const asId = (value) => sanitize(value);
const asInt = (value) => {
  const parsed = Number.parseInt(sanitize(value), 10);
  return Number.isFinite(parsed) ? parsed : 0;
};
const asIso = (value) => {
  const normalized = sanitize(value);
  if (!normalized) return undefined;
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
};
const asLocalDateTime = (value = new Date()) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d}T${h}:${min}`;
};
const formatDateTime = (value) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? sanitize(value) : parsed.toLocaleString();
};

const buildQuantitiesDraft = (items = [], key) =>
  items.reduce((acc, item) => {
    const itemId = asId(item?.id || item?.display_id);
    if (!itemId) return acc;
    const quantity = Number(item?.[key] || 0);
    if (quantity > 0) acc[itemId] = String(quantity);
    return acc;
  }, {});

const defaultDrafts = () => ({
  prepare: {
    dispense_batch_ref: '',
    statement: '',
    reason: '',
    quantities: {},
  },
  attest: {
    dispense_batch_ref: '',
    statement: '',
    reason: '',
    attested_at: asLocalDateTime(),
  },
  cancel: {
    reason: '',
    notes: '',
  },
  returns: {
    reason: '',
    notes: '',
    quantities: {},
  },
  adjust: {
    inventory_item_id: '',
    facility_id: '',
    quantity_delta: '',
    reason: 'OTHER',
    notes: '',
    occurred_at: asLocalDateTime(),
  },
});

const usePharmacyWorkbenchScreen = (defaultPanel = 'orders') => {
  const { t } = useI18n();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isOffline } = useNetwork();
  const workspace = usePharmacyWorkspace();

  const pharmacyScope = useScopeAccess(SCOPE_KEYS.PHARMACY);
  const inventoryScope = useScopeAccess(SCOPE_KEYS.INVENTORY);

  const [orderSummary, setOrderSummary] = useState(orderSummaryDefaults);
  const [stockSummary, setStockSummary] = useState(stockSummaryDefaults);
  const [worklist, setWorklist] = useState([]);
  const [stockRows, setStockRows] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [activePanel, setActivePanel] = useState(
    defaultPanel === 'inventory' && SESSION.panel !== 'inventory'
      ? 'inventory'
      : SESSION.panel === 'inventory'
        ? 'inventory'
        : 'orders'
  );
  const [orderSearch, setOrderSearch] = useState(SESSION.orderSearch);
  const [debouncedOrderSearch, setDebouncedOrderSearch] = useState(SESSION.orderSearch);
  const [orderStatusFilter, setOrderStatusFilter] = useState(SESSION.orderStatus);
  const [stockSearch, setStockSearch] = useState(SESSION.stockSearch);
  const [debouncedStockSearch, setDebouncedStockSearch] = useState(SESSION.stockSearch);
  const [lowStockOnly, setLowStockOnly] = useState(SESSION.lowStockOnly);
  const [drafts, setDrafts] = useState(defaultDrafts);
  const [isQueueLoading, setIsQueueLoading] = useState(false);
  const [isWorkflowLoading, setIsWorkflowLoading] = useState(false);
  const [isStockLoading, setIsStockLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const realtimeTickRef = useRef(0);

  const parsedRouteState = useMemo(() => {
    try {
      return parsePharmacyWorkbenchRouteState(params || {});
    } catch (_error) {
      return {};
    }
  }, [params]);

  const requestedOrderId = norm(parsedRouteState?.id);
  const requestedLegacyResource = norm(parsedRouteState?.resource).toLowerCase();
  const requestedLegacyId = norm(parsedRouteState?.legacyId);
  const requestedPanel = norm(parsedRouteState?.panel).toLowerCase();
  const requestedPatientId = norm(parsedRouteState?.patientId);
  const requestedEncounterId = norm(parsedRouteState?.encounterId);

  const hasPharmacyScope =
    pharmacyScope.canManageAllTenants || Boolean(asId(pharmacyScope.tenantId));
  const hasInventoryScope =
    inventoryScope.canManageAllTenants || Boolean(asId(inventoryScope.tenantId));
  const canReadWorkspace =
    (pharmacyScope.canRead && hasPharmacyScope) ||
    (inventoryScope.canRead && hasInventoryScope);
  const canMutatePharmacy = pharmacyScope.canWrite && !isOffline;
  const canMutateInventory = (inventoryScope.canWrite || pharmacyScope.canWrite) && !isOffline;
  const isResolved = pharmacyScope.isResolved && inventoryScope.isResolved;

  const buildQueryUrl = useCallback(
    (orderId, extras = {}, panel = activePanel) => {
      const query = new URLSearchParams();
      const normalizedPanel = panel === 'inventory' ? 'inventory' : 'orders';
      if (normalizedPanel !== 'orders') query.set('panel', normalizedPanel);
      if (asId(orderId)) query.set('id', asId(orderId));
      Object.entries(extras).forEach(([key, value]) => {
        if (sanitize(value)) query.set(key, sanitize(value));
      });
      const targetPath = '/pharmacy';
      const serialized = query.toString();
      return `${targetPath}${serialized ? `?${serialized}` : ''}`;
    },
    [activePanel]
  );

  const upsertOrder = useCallback((order) => {
    const id = asId(order?.id || order?.display_id);
    if (!id) return;

    setWorklist((previous) => {
      const index = previous.findIndex(
        (entry) =>
          asId(entry?.id || entry?.display_id).toUpperCase() === id.toUpperCase()
      );
      if (index < 0) return [order, ...previous];
      const next = [...previous];
      next[index] = { ...next[index], ...order };
      return next;
    });
  }, []);

  const applyWorkflow = useCallback(
    (workflow) => {
      const order = workflow?.order || null;
      const id = asId(order?.id || order?.display_id);
      setSelectedWorkflow(workflow || null);
      if (id) {
        setSelectedOrderId(id);
        upsertOrder(order);
      }
    },
    [upsertOrder]
  );

  const buildWorkbenchParams = useCallback(() => {
    const params = {
      page: 1,
      limit: 50,
      sort_by: 'ordered_at',
      order: 'desc',
    };

    if (sanitize(debouncedOrderSearch)) params.search = sanitize(debouncedOrderSearch);
    if (sanitize(orderStatusFilter)) params.status = sanitize(orderStatusFilter).toUpperCase();
    if (requestedPatientId) params.patient_id = requestedPatientId;
    if (requestedEncounterId) params.encounter_id = requestedEncounterId;

    return params;
  }, [debouncedOrderSearch, orderStatusFilter, requestedEncounterId, requestedPatientId]);

  const buildStockParams = useCallback(() => {
    const params = {
      page: 1,
      limit: 60,
      sort_by: 'updated_at',
      order: 'desc',
    };

    if (sanitize(debouncedStockSearch)) params.search = sanitize(debouncedStockSearch);
    if (lowStockOnly) params.low_stock_only = true;
    return params;
  }, [debouncedStockSearch, lowStockOnly]);

  const loadWorkbench = useCallback(
    async (light = false) => {
      if (!canReadWorkspace || isOffline) return;
      if (!light) {
        setIsQueueLoading(true);
        workspace.reset();
      }

      try {
        const payload = await workspace.listWorkbench(buildWorkbenchParams());
        if (!payload) return;

        const queue = Array.isArray(payload.worklist) ? payload.worklist : [];
        setOrderSummary(payload.summary || orderSummaryDefaults);
        setWorklist(queue);

        if (requestedOrderId) {
          setSelectedOrderId(requestedOrderId);
        } else if (!selectedOrderId && queue.length > 0) {
          const firstId = asId(queue[0]?.id || queue[0]?.display_id);
          if (firstId) setSelectedOrderId(firstId);
        }
      } finally {
        if (!light) setIsQueueLoading(false);
      }
    },
    [
      buildWorkbenchParams,
      canReadWorkspace,
      isOffline,
      requestedOrderId,
      selectedOrderId,
      workspace,
    ]
  );

  const loadWorkflow = useCallback(async () => {
    if (!canReadWorkspace || isOffline) return;
    const orderId = asId(selectedOrderId);
    if (!orderId) {
      setSelectedWorkflow(null);
      return;
    }

    setIsWorkflowLoading(true);
    try {
      const workflow = await workspace.getWorkflow(orderId);
      if (workflow) applyWorkflow(workflow);
    } finally {
      setIsWorkflowLoading(false);
    }
  }, [applyWorkflow, canReadWorkspace, isOffline, selectedOrderId, workspace]);

  const loadInventoryStock = useCallback(
    async (light = false) => {
      if (!canReadWorkspace || isOffline) return;
      if (!light) setIsStockLoading(true);

      try {
        const payload = await workspace.listInventoryStock(buildStockParams());
        if (!payload) return;
        setStockSummary(payload.summary || stockSummaryDefaults);
        setStockRows(Array.isArray(payload.stocks) ? payload.stocks : []);
      } finally {
        if (!light) setIsStockLoading(false);
      }
    },
    [buildStockParams, canReadWorkspace, isOffline, workspace]
  );

  const mutate = useCallback(
    async (work, options = {}) => {
      const {
        refreshQueue = false,
        refreshWorkflow = true,
        refreshStock = false,
        require = 'pharmacy',
      } = options;

      if (require === 'pharmacy' && !canMutatePharmacy) {
        setFormError(t('pharmacy.workbench.errors.readOnlyPharmacy'));
        return null;
      }
      if (require === 'inventory' && !canMutateInventory) {
        setFormError(t('pharmacy.workbench.errors.readOnlyInventory'));
        return null;
      }

      setFormError('');
      setSuccessMessage('');
      const result = await work();
      if (!result) {
        setFormError(t('pharmacy.workbench.errors.actionFailed'));
        return null;
      }

      if (result.workflow) applyWorkflow(result.workflow);
      if (refreshQueue) await loadWorkbench(true);
      if (refreshWorkflow && selectedOrderId) await loadWorkflow();
      if (refreshStock) await loadInventoryStock(true);

      return result;
    },
    [
      applyWorkflow,
      canMutateInventory,
      canMutatePharmacy,
      loadInventoryStock,
      loadWorkbench,
      loadWorkflow,
      selectedOrderId,
      t,
    ]
  );

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedOrderSearch(sanitize(orderSearch)), 280);
    return () => clearTimeout(timer);
  }, [orderSearch]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedStockSearch(sanitize(stockSearch)), 280);
    return () => clearTimeout(timer);
  }, [stockSearch]);

  useEffect(() => {
    SESSION.panel = activePanel;
    SESSION.orderSearch = orderSearch;
    SESSION.orderStatus = orderStatusFilter;
    SESSION.stockSearch = stockSearch;
    SESSION.lowStockOnly = lowStockOnly;
  }, [activePanel, lowStockOnly, orderSearch, orderStatusFilter, stockSearch]);

  useEffect(() => {
    if (requestedPanel === 'inventory' || requestedPanel === 'orders') {
      setActivePanel(requestedPanel);
    } else if (defaultPanel === 'inventory') {
      setActivePanel('inventory');
    }
  }, [defaultPanel, requestedPanel]);

  useEffect(() => {
    if (requestedOrderId) {
      setSelectedOrderId(requestedOrderId);
    }
  }, [requestedOrderId]);

  useEffect(() => {
    loadWorkbench(false);
  }, [loadWorkbench]);

  useEffect(() => {
    loadWorkflow();
  }, [loadWorkflow]);

  useEffect(() => {
    loadInventoryStock(false);
  }, [loadInventoryStock]);

  useEffect(() => {
    if (!requestedLegacyId || !requestedLegacyResource || requestedOrderId) return;
    if (!canReadWorkspace || isOffline) return;

    workspace
      .resolveLegacyRoute(requestedLegacyResource, requestedLegacyId)
      .then((resolved) => {
        const resolvedId = asId(resolved?.identifier || resolved?.id);
        if (!resolvedId) return;
        router.replace(
          buildQueryUrl(resolvedId, {
            resource: requestedLegacyResource,
            legacyId: requestedLegacyId,
          })
        );
      })
      .catch(() => {});
  }, [
    buildQueryUrl,
    canReadWorkspace,
    isOffline,
    requestedLegacyId,
    requestedLegacyResource,
    requestedOrderId,
    router,
    workspace,
  ]);

  const items = useMemo(
    () => (Array.isArray(selectedWorkflow?.items) ? selectedWorkflow.items : []),
    [selectedWorkflow?.items]
  );

  const pendingAttestationBatches = useMemo(
    () =>
      Array.isArray(selectedWorkflow?.order?.pending_attestation_batches)
        ? selectedWorkflow.order.pending_attestation_batches
        : [],
    [selectedWorkflow?.order?.pending_attestation_batches]
  );

  useEffect(() => {
    if (!selectedWorkflow?.order) return;

    const firstPendingBatch =
      pendingAttestationBatches[0]?.dispense_batch_ref ||
      sanitize(selectedWorkflow?.order?.pending_attestation_batches?.[0]?.dispense_batch_ref);

    const firstMappedInventoryItem = items
      .flatMap((item) => item?.stock_mappings || [])
      .map((mapping) => asId(mapping?.inventory_item_id))
      .find(Boolean);

    setDrafts((previous) => ({
      ...previous,
      prepare: {
        ...previous.prepare,
        quantities: Object.keys(previous.prepare.quantities || {}).length
          ? previous.prepare.quantities
          : buildQuantitiesDraft(items, 'quantity_remaining'),
      },
      attest: {
        ...previous.attest,
        dispense_batch_ref: previous.attest.dispense_batch_ref || firstPendingBatch || '',
      },
      returns: {
        ...previous.returns,
        quantities: Object.keys(previous.returns.quantities || {}).length
          ? previous.returns.quantities
          : buildQuantitiesDraft(items, 'quantity_dispensed'),
      },
      adjust: {
        ...previous.adjust,
        inventory_item_id: previous.adjust.inventory_item_id || firstMappedInventoryItem || '',
        facility_id:
          previous.adjust.facility_id ||
          asId(stockRows[0]?.facility_id) ||
          '',
      },
    }));
  }, [items, pendingAttestationBatches, selectedWorkflow?.order, stockRows]);

  const onRealtimeOrder = useCallback(
    () => {
      const now = Date.now();
      if (now - realtimeTickRef.current < 450) return;
      realtimeTickRef.current = now;
      if (selectedOrderId) {
        loadWorkflow();
      }
      loadWorkbench(true);
    },
    [loadWorkbench, loadWorkflow, selectedOrderId]
  );

  const onRealtimeStock = useCallback(() => {
    const now = Date.now();
    if (now - realtimeTickRef.current < 450) return;
    realtimeTickRef.current = now;
    loadInventoryStock(true);
  }, [loadInventoryStock]);

  useRealtimeEvent('pharmacy.workspace_updated', onRealtimeOrder, {
    enabled: canReadWorkspace && !isOffline,
  });
  useRealtimeEvent('pharmacy.order_updated', onRealtimeOrder, {
    enabled: canReadWorkspace && !isOffline,
  });
  useRealtimeEvent('inventory.stock_updated', onRealtimeStock, {
    enabled: canReadWorkspace && !isOffline,
  });

  const batchOptions = useMemo(
    () =>
      pendingAttestationBatches
        .map((entry) => {
          const value = asId(entry?.dispense_batch_ref);
          if (!value) return null;
          return {
            value,
            label: `${value} | ${sanitize(entry?.prepared_at) ? formatDateTime(entry.prepared_at) : t('common.notAvailable')}`,
          };
        })
        .filter(Boolean),
    [pendingAttestationBatches, t]
  );

  const inventoryItemOptions = useMemo(() => {
    const mapped = items.flatMap((item) => item?.stock_mappings || []);
    const stockDerived = stockRows
      .filter((row) => row?.inventory_item_id)
      .map((row) => ({
        inventory_item_id: row.inventory_item_id,
        inventory_item: row.inventory_item,
      }));

    const byId = new Map();
    [...mapped, ...stockDerived].forEach((entry) => {
      const value = asId(entry?.inventory_item_id || entry?.inventory_item?.id);
      if (!value || byId.has(value)) return;
      byId.set(value, {
        value,
        label:
          sanitize(entry?.inventory_item?.name) ||
          sanitize(entry?.inventory_item?.sku) ||
          value,
      });
    });

    return Array.from(byId.values());
  }, [items, stockRows]);

  const selectedSummary = useMemo(() => {
    const order = selectedWorkflow?.order || {};
    return {
      orderId: asId(order.id || order.display_id),
      patientName: sanitize(order.patient_display_name),
      patientId: asId(order.patient_id),
      encounterId: asId(order.encounter_id),
      status: sanitize(order.status).toUpperCase(),
      orderedAt: sanitize(order.ordered_at) ? formatDateTime(order.ordered_at) : '',
      itemCount: Number(order.item_count || 0),
      prescribed: Number(order.quantity_prescribed_total || 0),
      dispensed: Number(order.quantity_dispensed_total || 0),
      remaining: Number(order.quantity_remaining_total || 0),
      pendingBatches: Number(order.pending_attestation_batch_count || 0),
    };
  }, [selectedWorkflow?.order]);

  const timelineItems = useMemo(
    () =>
      (Array.isArray(selectedWorkflow?.timeline) ? selectedWorkflow.timeline : [])
        .slice(0, 40)
        .map((entry, index) => ({
          id: `${sanitize(entry?.id || entry?.type)}-${index + 1}`,
          label: sanitize(entry?.label || entry?.type) || t('common.notAvailable'),
          timestamp: sanitize(entry?.at)
            ? formatDateTime(entry.at)
            : t('common.notAvailable'),
        })),
    [selectedWorkflow?.timeline, t]
  );

  const actionMatrix = useMemo(() => {
    const next = selectedWorkflow?.next_actions || {};
    const hasPrepareLines = items.some((item) => {
      const itemId = asId(item?.id || item?.display_id);
      if (!itemId) return false;
      const entered = asInt(drafts.prepare.quantities?.[itemId]);
      return entered > 0 && entered <= Number(item.quantity_remaining || 0);
    });

    const hasReturnLines = items.some((item) => {
      const itemId = asId(item?.id || item?.display_id);
      if (!itemId) return false;
      const entered = asInt(drafts.returns.quantities?.[itemId]);
      return entered > 0 && entered <= Number(item.quantity_dispensed || 0);
    });

    return {
      canPrepareDispense: Boolean(next.can_prepare_dispense) && hasPrepareLines,
      canAttestDispense:
        Boolean(next.can_attest_dispense) && Boolean(asId(drafts.attest.dispense_batch_ref)),
      canCancel: Boolean(next.can_cancel),
      canReturn: Boolean(next.can_return) && hasReturnLines,
      canAdjustInventory: Boolean(next.can_adjust_inventory),
    };
  }, [drafts.attest.dispense_batch_ref, drafts.prepare.quantities, drafts.returns.quantities, items, selectedWorkflow?.next_actions]);

  const summaryCards =
    activePanel === 'inventory'
      ? [
          {
            id: 'totalStockRows',
            label: t('pharmacy.workbench.summary.totalStockRows'),
            value: Number(stockSummary.total_stock_rows || 0),
          },
          {
            id: 'lowStockRows',
            label: t('pharmacy.workbench.summary.lowStockRows'),
            value: Number(stockSummary.low_stock_rows || 0),
          },
          {
            id: 'pendingAttestations',
            label: t('pharmacy.workbench.summary.pendingAttestations'),
            value: Number(orderSummary.pending_attestations || 0),
          },
          {
            id: 'partiallyDispensedQueue',
            label: t('pharmacy.workbench.summary.partiallyDispensedQueue'),
            value: Number(orderSummary.partially_dispensed_queue || 0),
          },
        ]
      : [
          {
            id: 'totalOrders',
            label: t('pharmacy.workbench.summary.totalOrders'),
            value: Number(orderSummary.total_orders || 0),
          },
          {
            id: 'orderedQueue',
            label: t('pharmacy.workbench.summary.orderedQueue'),
            value: Number(orderSummary.ordered_queue || 0),
          },
          {
            id: 'partiallyDispensedQueue',
            label: t('pharmacy.workbench.summary.partiallyDispensedQueue'),
            value: Number(orderSummary.partially_dispensed_queue || 0),
          },
          {
            id: 'pendingAttestations',
            label: t('pharmacy.workbench.summary.pendingAttestations'),
            value: Number(orderSummary.pending_attestations || 0),
          },
        ];

  const setDraftField = useCallback((section, field, value) => {
    setDrafts((previous) => ({
      ...previous,
      [section]: {
        ...previous[section],
        [field]: value,
      },
    }));
  }, []);

  const onPrepareQuantityChange = useCallback((itemId, value) => {
    const normalizedId = asId(itemId);
    if (!normalizedId) return;
    setDrafts((previous) => ({
      ...previous,
      prepare: {
        ...previous.prepare,
        quantities: {
          ...previous.prepare.quantities,
          [normalizedId]: sanitize(value),
        },
      },
    }));
  }, []);

  const onReturnQuantityChange = useCallback((itemId, value) => {
    const normalizedId = asId(itemId);
    if (!normalizedId) return;
    setDrafts((previous) => ({
      ...previous,
      returns: {
        ...previous.returns,
        quantities: {
          ...previous.returns.quantities,
          [normalizedId]: sanitize(value),
        },
      },
    }));
  }, []);

  const onPrepareDispense = useCallback(async () => {
    const orderId = asId(selectedOrderId);
    if (!orderId) {
      setFormError(t('pharmacy.workbench.validation.orderRequired'));
      return;
    }

    const lines = items
      .map((item) => {
        const itemId = asId(item?.id || item?.display_id);
        if (!itemId) return null;

        const quantity = asInt(drafts.prepare.quantities?.[itemId]);
        const remaining = Number(item?.quantity_remaining || 0);
        if (!quantity || quantity <= 0 || quantity > remaining) return null;

        return {
          order_item_id: itemId,
          quantity,
        };
      })
      .filter(Boolean);

    if (!lines.length) {
      setFormError(t('pharmacy.workbench.validation.prepareQuantityRequired'));
      return;
    }

    const result = await mutate(
      () =>
        workspace.prepareDispense(orderId, {
          dispense_batch_ref: sanitize(drafts.prepare.dispense_batch_ref) || undefined,
          statement: sanitize(drafts.prepare.statement) || undefined,
          reason: sanitize(drafts.prepare.reason) || undefined,
          items: lines,
        }),
      { refreshQueue: true, refreshWorkflow: true, require: 'pharmacy' }
    );

    if (result?.dispense_batch_ref) {
      setDrafts((previous) => ({
        ...previous,
        attest: {
          ...previous.attest,
          dispense_batch_ref: result.dispense_batch_ref,
        },
      }));
      setSuccessMessage(
        t('pharmacy.workbench.feedback.prepareSuccess', {
          batch: result.dispense_batch_ref,
        })
      );
    }
  }, [drafts.prepare.dispense_batch_ref, drafts.prepare.quantities, drafts.prepare.reason, drafts.prepare.statement, items, mutate, selectedOrderId, t, workspace]);

  const onAttestDispense = useCallback(async () => {
    const orderId = asId(selectedOrderId);
    const batchRef = asId(drafts.attest.dispense_batch_ref).toUpperCase();

    if (!orderId) {
      setFormError(t('pharmacy.workbench.validation.orderRequired'));
      return;
    }
    if (!batchRef) {
      setFormError(t('pharmacy.workbench.validation.batchRequired'));
      return;
    }

    const result = await mutate(
      () =>
        workspace.attestDispense(orderId, {
          dispense_batch_ref: batchRef,
          statement: sanitize(drafts.attest.statement) || undefined,
          reason: sanitize(drafts.attest.reason) || undefined,
          attested_at: asIso(drafts.attest.attested_at) || undefined,
        }),
      {
        refreshQueue: true,
        refreshWorkflow: true,
        refreshStock: true,
        require: 'pharmacy',
      }
    );

    if (result) {
      setSuccessMessage(
        t('pharmacy.workbench.feedback.attestSuccess', {
          batch: batchRef,
        })
      );
    }
  }, [drafts.attest.attested_at, drafts.attest.dispense_batch_ref, drafts.attest.reason, drafts.attest.statement, mutate, selectedOrderId, t, workspace]);

  const onCancelOrder = useCallback(async () => {
    const orderId = asId(selectedOrderId);
    const reason = sanitize(drafts.cancel.reason);

    if (!orderId) {
      setFormError(t('pharmacy.workbench.validation.orderRequired'));
      return;
    }
    if (!reason) {
      setFormError(t('pharmacy.workbench.validation.cancelReasonRequired'));
      return;
    }

    const result = await mutate(
      () =>
        workspace.cancelOrder(orderId, {
          reason,
          notes: sanitize(drafts.cancel.notes) || undefined,
        }),
      { refreshQueue: true, refreshWorkflow: true, require: 'pharmacy' }
    );

    if (result) {
      setSuccessMessage(t('pharmacy.workbench.feedback.cancelSuccess'));
    }
  }, [drafts.cancel.notes, drafts.cancel.reason, mutate, selectedOrderId, t, workspace]);

  const onReturnOrder = useCallback(async () => {
    const orderId = asId(selectedOrderId);
    if (!orderId) {
      setFormError(t('pharmacy.workbench.validation.orderRequired'));
      return;
    }

    const lines = items
      .map((item) => {
        const itemId = asId(item?.id || item?.display_id);
        if (!itemId) return null;

        const quantity = asInt(drafts.returns.quantities?.[itemId]);
        const max = Number(item.quantity_dispensed || 0);
        if (!quantity || quantity <= 0 || quantity > max) return null;

        return {
          order_item_id: itemId,
          quantity,
        };
      })
      .filter(Boolean);

    if (!lines.length) {
      setFormError(t('pharmacy.workbench.validation.returnQuantityRequired'));
      return;
    }

    const result = await mutate(
      () =>
        workspace.returnOrder(orderId, {
          reason: sanitize(drafts.returns.reason) || undefined,
          notes: sanitize(drafts.returns.notes) || undefined,
          items: lines,
        }),
      {
        refreshQueue: true,
        refreshWorkflow: true,
        refreshStock: true,
        require: 'pharmacy',
      }
    );

    if (result) {
      setSuccessMessage(t('pharmacy.workbench.feedback.returnSuccess'));
    }
  }, [drafts.returns.notes, drafts.returns.quantities, drafts.returns.reason, items, mutate, selectedOrderId, t, workspace]);

  const onAdjustInventory = useCallback(async () => {
    const inventoryItemId = asId(drafts.adjust.inventory_item_id);
    const quantityDelta = asInt(drafts.adjust.quantity_delta);

    if (!inventoryItemId) {
      setFormError(t('pharmacy.workbench.validation.inventoryItemRequired'));
      return;
    }
    if (!quantityDelta) {
      setFormError(t('pharmacy.workbench.validation.quantityDeltaRequired'));
      return;
    }

    const result = await mutate(
      () =>
        workspace.adjustInventory({
          inventory_item_id: inventoryItemId,
          facility_id: asId(drafts.adjust.facility_id) || undefined,
          quantity_delta: quantityDelta,
          reason: sanitize(drafts.adjust.reason).toUpperCase() || 'OTHER',
          notes: sanitize(drafts.adjust.notes) || undefined,
          occurred_at: asIso(drafts.adjust.occurred_at) || undefined,
        }),
      {
        refreshStock: true,
        require: 'inventory',
        refreshWorkflow: false,
      }
    );

    if (result) {
      setSuccessMessage(t('pharmacy.workbench.feedback.adjustSuccess'));
      setDrafts((previous) => ({
        ...previous,
        adjust: {
          ...previous.adjust,
          quantity_delta: '',
        },
      }));
    }
  }, [drafts.adjust.facility_id, drafts.adjust.inventory_item_id, drafts.adjust.notes, drafts.adjust.occurred_at, drafts.adjust.quantity_delta, drafts.adjust.reason, mutate, t, workspace]);

  return {
    isResolved,
    canViewWorkbench: canReadWorkspace,
    canMutatePharmacy,
    canMutateInventory,
    isOffline,
    isLoading: !isResolved || (isQueueLoading && worklist.length === 0),
    isQueueLoading,
    isWorkflowLoading,
    isStockLoading,
    isCrudLoading: workspace.isLoading,
    hasError: Boolean(workspace.errorCode),
    errorCode: workspace.errorCode,
    activePanel,
    summaryCards,
    orderSummary,
    stockSummary,
    worklist,
    stockRows,
    selectedOrderId,
    selectedWorkflow,
    selectedSummary,
    timelineItems,
    items,
    batchOptions,
    inventoryItemOptions,
    actionMatrix,
    drafts,
    formError,
    successMessage,
    orderSearch,
    orderStatusFilter,
    stockSearch,
    lowStockOnly,
    orderStatusOptions: ORDER_STATUS_OPTIONS,
    inventoryReasonOptions: INVENTORY_REASON_OPTIONS,
    onSetPanel: (panel) => {
      const nextPanel = panel === 'inventory' ? 'inventory' : 'orders';
      setActivePanel(nextPanel);
      router.replace(buildQueryUrl(selectedOrderId, {}, nextPanel));
    },
    onSelectOrder: (order) => {
      const orderId = asId(order?.id || order?.display_id);
      if (!orderId) return;
      setSelectedOrderId(orderId);
      router.replace(buildQueryUrl(orderId, {}, 'orders'));
      if (asId(selectedWorkflow?.order?.id) !== orderId) {
        setSelectedWorkflow({
          order,
          items: [],
          attestations: [],
          timeline: [],
          next_actions: {},
        });
      }
    },
    onOrderSearchChange: setOrderSearch,
    onOrderStatusFilterChange: setOrderStatusFilter,
    onStockSearchChange: setStockSearch,
    onLowStockOnlyChange: setLowStockOnly,
    onClearFilters: () => {
      setOrderSearch('');
      setOrderStatusFilter('');
      setStockSearch('');
      setLowStockOnly(false);
    },
    onDraftChange: setDraftField,
    onPrepareQuantityChange,
    onReturnQuantityChange,
    onPrepareDispense,
    onAttestDispense,
    onCancelOrder,
    onReturnOrder,
    onAdjustInventory,
    onRetry: () => {
      loadWorkbench(false);
      loadWorkflow();
      loadInventoryStock(false);
    },
    onOpenPatientProfile: () => {
      const patientId = asId(selectedWorkflow?.order?.patient_id);
      if (patientId) {
        router.push(`/patients/patients/${encodeURIComponent(patientId)}`);
      }
    },
    onOpenOrderRoute: () => {
      const orderId = asId(selectedOrderId);
      if (!orderId) return;
      router.push(`/pharmacy?id=${encodeURIComponent(orderId)}`);
    },
  };
};

export default usePharmacyWorkbenchScreen;
