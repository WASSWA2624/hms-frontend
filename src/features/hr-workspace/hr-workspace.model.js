const UUID_LIKE_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const sanitizeString = (value) => String(value || '').trim();
const normalizeObject = (value) =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? { ...value }
    : null;
const normalizeArray = (value) => (Array.isArray(value) ? value : []);

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toPublicId = (value) => {
  const normalized = sanitizeString(value);
  if (!normalized || UUID_LIKE_REGEX.test(normalized)) return null;
  return normalized;
};

const resolvePublicId = (...candidates) => {
  for (const candidate of candidates) {
    const normalized = toPublicId(candidate);
    if (normalized) return normalized;
  }
  return null;
};

const toBackendId = (...candidates) => {
  for (const candidate of candidates) {
    const normalized = sanitizeString(candidate);
    if (normalized) return normalized;
  }
  return null;
};

const mapEntity = (row = {}) => {
  const objectRow = normalizeObject(row) || {};
  const displayId = resolvePublicId(
    objectRow.display_id,
    objectRow.human_friendly_id,
    objectRow.displayId
  );

  return {
    ...objectRow,
    id: displayId,
    display_id: displayId,
    backend_identifier: toBackendId(
      objectRow.backend_identifier,
      objectRow.id,
      objectRow.backendIdentifier
    ),
  };
};

const normalizeQueueItem = (value) => {
  const row = mapEntity(value);
  return {
    ...row,
    queue: sanitizeString(row.queue).toUpperCase() || null,
    status: sanitizeString(row.status).toUpperCase() || null,
    timeline_at: row.timeline_at || row.updated_at || row.created_at || null,
    shift_display_id: resolvePublicId(row.shift_display_id, row.shiftDisplayId),
    staff_profile_display_id: resolvePublicId(
      row.staff_profile_display_id,
      row.staffProfileDisplayId
    ),
    requester_staff_display_id: resolvePublicId(
      row.requester_staff_display_id,
      row.requesterStaffDisplayId
    ),
    target_staff_display_id: resolvePublicId(
      row.target_staff_display_id,
      row.targetStaffDisplayId
    ),
    nurse_roster_display_id: resolvePublicId(
      row.nurse_roster_display_id,
      row.nurseRosterDisplayId
    ),
    assignment_count: toNumber(row.assignment_count),
  };
};

const normalizeTimelineEntry = (value, index = 0) => {
  const row = mapEntity(value);
  const type = sanitizeString(row.type).toUpperCase() || 'ACTIVITY';
  const action = sanitizeString(row.action).toUpperCase() || 'UPDATED';

  return {
    ...row,
    id: row.display_id || row.backend_identifier || `hr-activity-${index + 1}`,
    type,
    action,
    status: sanitizeString(row.status).toUpperCase() || null,
    timestamp: row.timeline_at || row.created_at || row.updated_at || null,
    label:
      sanitizeString(row.label) || `${type.replace(/_/g, ' ')} ${action.replace(/_/g, ' ')}`,
  };
};

const normalizeWorkspacePayload = (value) => {
  const payload = normalizeObject(value) || {};
  const summary = normalizeObject(payload.summary) || {};

  return {
    summary: {
      total_staff: toNumber(summary.total_staff),
      leave_requests: toNumber(summary.leave_requests),
      swap_requests: toNumber(summary.swap_requests),
      draft_rosters: toNumber(summary.draft_rosters),
      unassigned_shifts: toNumber(summary.unassigned_shifts),
      payroll_draft_runs: toNumber(summary.payroll_draft_runs),
      overdue_shifts: toNumber(summary.overdue_shifts),
    },
    queues: normalizeArray(payload.queues).map((entry) => ({
      queue: sanitizeString(entry?.queue).toUpperCase() || null,
      label: sanitizeString(entry?.label) || sanitizeString(entry?.queue),
      count: toNumber(entry?.count),
    })),
    timeline: {
      items: normalizeArray(payload?.timeline?.items)
        .map((entry, index) => normalizeTimelineEntry(entry, index))
        .filter(Boolean)
        .sort((left, right) => {
          const leftTime = Date.parse(left.timestamp || '') || 0;
          const rightTime = Date.parse(right.timestamp || '') || 0;
          return rightTime - leftTime;
        }),
      pagination: normalizeObject(payload?.timeline?.pagination),
    },
    generated_at: payload.generated_at || null,
  };
};

const normalizeWorkItemsPayload = (value) => {
  const payload = normalizeObject(value) || {};

  if (Array.isArray(payload.items)) {
    return {
      queue: sanitizeString(payload.queue).toUpperCase() || null,
      items: normalizeArray(payload.items).map(normalizeQueueItem).filter(Boolean),
      pagination: normalizeObject(payload.pagination),
    };
  }

  return {
    queues: normalizeArray(payload.queues).map((entry) => ({
      queue: sanitizeString(entry?.queue).toUpperCase() || null,
      total: toNumber(entry?.total),
      items: normalizeArray(entry?.items).map(normalizeQueueItem).filter(Boolean),
    })),
  };
};

const normalizeRosterWorkflowPayload = (value) => {
  const payload = normalizeObject(value) || {};
  const roster = mapEntity(payload.roster);

  const shifts = normalizeArray(payload.shifts).map((entry) => {
    const shift = mapEntity(entry);
    return {
      ...shift,
      shift_type: sanitizeString(shift.shift_type).toUpperCase() || null,
      status: sanitizeString(shift.status).toUpperCase() || null,
      assignments: normalizeArray(shift.assignments).map((assignment) => {
        const mapped = mapEntity(assignment);
        return {
          ...mapped,
          staff_profile_display_id: resolvePublicId(mapped.staff_profile_display_id),
          staff_number: sanitizeString(mapped.staff_number) || null,
        };
      }),
    };
  });

  const assignments = normalizeArray(payload.assignments).map((entry) => {
    const assignment = mapEntity(entry);
    return {
      ...assignment,
      shift_display_id: resolvePublicId(assignment.shift_display_id),
      staff_profile_display_id: resolvePublicId(assignment.staff_profile_display_id),
    };
  });

  const gaps = normalizeArray(payload.gaps).map((entry) => ({
    shift_id: toBackendId(entry?.shift_id),
    shift_display_id: resolvePublicId(entry?.shift_display_id),
    shift_type: sanitizeString(entry?.shift_type).toUpperCase() || null,
    start_time: entry?.start_time || null,
    end_time: entry?.end_time || null,
    reason: sanitizeString(entry?.reason).toUpperCase() || 'UNASSIGNED',
  }));

  return {
    roster,
    shifts,
    assignments,
    gaps,
    coverage: {
      total_shifts: toNumber(payload?.coverage?.total_shifts),
      assigned_shifts: toNumber(payload?.coverage?.assigned_shifts),
      unassigned_shifts: toNumber(payload?.coverage?.unassigned_shifts),
      assignment_ratio: Number(payload?.coverage?.assignment_ratio || 0),
    },
  };
};

const normalizeRosterGeneratePayload = (value) => {
  const payload = normalizeObject(value) || {};
  return {
    roster: mapEntity(payload.roster),
    generation_summary: normalizeObject(payload.generation_summary) || {},
    coverage: normalizeObject(payload.coverage) || {},
    assignments: normalizeArray(payload.assignments).map(mapEntity).filter(Boolean),
    unassigned_shifts: normalizeArray(payload.unassigned_shifts).map((entry) => ({
      shift_id: toBackendId(entry?.shift_id),
      shift_display_id: resolvePublicId(entry?.shift_display_id),
      reason: sanitizeString(entry?.reason).toUpperCase() || 'NO_ELIGIBLE_CANDIDATE',
      shift_type: sanitizeString(entry?.shift_type).toUpperCase() || null,
      start_time: entry?.start_time || null,
      end_time: entry?.end_time || null,
    })),
  };
};

const normalizeRosterPublishPayload = (value) => {
  const payload = normalizeObject(value) || {};
  return {
    published_roster: mapEntity(payload.published_roster),
    publish_summary: normalizeObject(payload.publish_summary) || {},
  };
};

const normalizeOverridePayload = (value) => {
  const payload = normalizeObject(value) || {};
  return {
    assignment: mapEntity(payload.assignment),
    shift: mapEntity(payload.shift),
    audit_ref: sanitizeString(payload.audit_ref) || null,
  };
};

const normalizeSwapMutationPayload = (value) => {
  const payload = normalizeObject(value) || {};
  return {
    swap: mapEntity(payload.swap),
    shift_assignments: normalizeArray(payload.shift_assignments).map(mapEntity).filter(Boolean),
  };
};

const normalizeLeaveMutationPayload = (value) => {
  const payload = normalizeObject(value) || {};
  return {
    leave: mapEntity(payload.leave),
  };
};

const normalizePayrollPreviewPayload = (value) => {
  const payload = normalizeObject(value) || {};
  const runSummary = mapEntity(payload.run_summary);

  return {
    run_summary: {
      ...runSummary,
      status: sanitizeString(runSummary.status).toUpperCase() || null,
      period_start: runSummary.period_start || null,
      period_end: runSummary.period_end || null,
    },
    proposed_items: normalizeArray(payload.proposed_items).map((entry) => ({
      ...entry,
      staff_profile_display_id: resolvePublicId(entry?.staff_profile_display_id),
      assignment_count: toNumber(entry?.assignment_count),
      total_hours: Number(entry?.total_hours || 0),
      hourly_rate: Number(entry?.hourly_rate || 0),
      amount: Number(entry?.amount || 0),
      currency: sanitizeString(entry?.currency).toUpperCase() || null,
    })),
    totals: {
      total_amount: Number(payload?.totals?.total_amount || 0),
      total_hours: Number(payload?.totals?.total_hours || 0),
      staff_count: toNumber(payload?.totals?.staff_count),
      currency: sanitizeString(payload?.totals?.currency).toUpperCase() || null,
    },
  };
};

const normalizePayrollProcessPayload = (value) => {
  const payload = normalizeObject(value) || {};
  return {
    processed_summary: normalizeObject(payload.processed_summary) || {},
    items: normalizeArray(payload.items).map((entry) => ({
      ...entry,
      staff_profile_display_id: resolvePublicId(entry?.staff_profile_display_id),
      assignment_count: toNumber(entry?.assignment_count),
      total_hours: Number(entry?.total_hours || 0),
      hourly_rate: Number(entry?.hourly_rate || 0),
      amount: Number(entry?.amount || 0),
      currency: sanitizeString(entry?.currency).toUpperCase() || null,
    })),
  };
};

const normalizeHrLegacyResolution = (value) => {
  const payload = normalizeObject(value);
  if (!payload) return null;

  return {
    resource: sanitizeString(payload.resource).toLowerCase(),
    backend_identifier: toBackendId(payload.backend_identifier),
    display_id: resolvePublicId(payload.display_id),
    target_path: sanitizeString(payload.target_path) || '/hr',
    matched_by: sanitizeString(payload.matched_by).toLowerCase() || null,
  };
};

export {
  normalizeWorkspacePayload,
  normalizeWorkItemsPayload,
  normalizeRosterWorkflowPayload,
  normalizeRosterGeneratePayload,
  normalizeRosterPublishPayload,
  normalizeOverridePayload,
  normalizeSwapMutationPayload,
  normalizeLeaveMutationPayload,
  normalizePayrollPreviewPayload,
  normalizePayrollProcessPayload,
  normalizeHrLegacyResolution,
};
