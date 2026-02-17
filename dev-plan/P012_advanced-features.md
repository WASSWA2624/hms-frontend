# Phase 12: Advanced Feature Slices

## Purpose
Implement advanced HMS capabilities after core modules and screens are in place. Steps remain atomic, chronological, and backend-aligned.

## Rule References
- `.cursor/rules/features-domain.mdc`
- `.cursor/rules/state-management.mdc`
- `.cursor/rules/services-integration.mdc`
- `.cursor/rules/errors-logging.mdc`
- `.cursor/rules/security.mdc`
- `.cursor/rules/offline-sync.mdc`
- `.cursor/rules/platform-ui.mdc`
- `.cursor/rules/accessibility.mdc`
- `.cursor/rules/performance.mdc`
- `.cursor/rules/testing.mdc`
- `.cursor/rules/i18n.mdc`

## Prerequisites
- Phase 11 completed
- Phase 10 completed
- Backend module and endpoint parity confirmed (`hms-backend/dev-plan/P011_modules.mdc`, `hms-backend/dev-plan/P010_api_endpoints.mdc`)
- Backend realtime scope confirmed for event-driven UX (`hms-backend/dev-plan/P013_ws_features.mdc`)

## Write-up Coverage
- `write-up.md` sections `7`, `9`, `10`, and `11` (workflow overlays, modules strategy, commercial controls, growth engine).
- `write-up.md` sections `12` and `20` (interoperability and KPI frameworks).
- `write-up.md` sections `14.5`, `18.3`, and `21` (observability, product DoD closure, and priority backlog themes).

## Backend Alignment Gate
- Realtime UX must map to WS event scope in `hms-backend/dev-plan/P013_ws_features.mdc`.
- Advanced action/control UX must map to endpoint sections `25`, `26`, `27`, and `28` in `hms-backend/dev-plan/P010_api_endpoints.mdc`.
- Feature-mapped Group 21 scope must reuse Phase 10 modules; no unsanctioned backend module creation in frontend architecture.

## Advanced Scope Contract
- Advanced features must reuse core modules; do not introduce unauthorized module boundaries.
- Any backend dependency used by a step must be documented in that step.
- If a backend contract is intentionally deferred, keep UI behind a feature flag and do not break chronology.
- Tenant-specific behavior must be configuration-first (policies/workflows/forms/templates), not forked code paths.

## Steps (Atomic, Chronological)

### Step 12.1: Teleconsultation scheduling UX
- Build teleconsultation scheduling flow using appointments and provider schedules.
- Backend dependencies: `appointment`, `provider-schedule`, `availability-slot`.

### Step 12.2: Teleconsultation session state UX
- Build session lifecycle UI (waiting, active, completed, interrupted).
- Backend dependencies: `appointment`, `visit-queue`, notifications realtime events.

### Step 12.3: Telemedicine secure messaging UX
- Build secure messaging surfaces for telemedicine care teams and patients.
- Backend dependencies: `conversation`, `message`, `notification`.

### Step 12.4: Remote patient monitoring dashboards
- Build monitored vitals/alerts views and threshold surfaces.
- Backend dependencies: `vital-sign`, `clinical-alert`, `critical-alert`.

### Step 12.5: Patient engagement dashboard enhancements
- Build consolidated portal dashboard views for appointments, results, prescriptions, billing.
- Backend dependencies: `appointment`, `lab-result`, `radiology-result`, `pharmacy-order`, `invoice`.

### Step 12.6: Feedback and complaints workflows
- Build patient feedback and complaint capture and tracking UX.
- Backend dependencies: `message`, `conversation`, compliance/audit logs as applicable.

### Step 12.7: Patient education surfaces
- Build educational content sections in portal and clinician-facing contexts.
- Backend dependencies: `template`, `template-variable`, `notification`.

### Step 12.8: Notification preference management
- Build preference controls for channels and reminder categories.
- Backend dependencies: `notification`, `notification-delivery`.

### Step 12.9: AI insights surface
- Build AI insight cards/panels for diagnostics support.
- Backend dependencies: `analytics-event`, `report-run`, diagnostic result modules.

### Step 12.10: Predictive capacity dashboards
- Build predictive dashboards for occupancy, staffing, and risk trends.
- Backend dependencies: `dashboard-widget`, `kpi-snapshot`, `report-definition`, `report-run`.

### Step 12.11: Explainability and AI audit visibility
- Build explainability details and model output traceability UI.
- Backend dependencies: `audit-log`, `data-processing-log`, `analytics-event`.

### Step 12.12: Clinical decision support alerts
- Build medication interaction/protocol reminder and escalation UI.
- Backend dependencies: `clinical-alert`, `adverse-event`, `care-plan`, `critical-alert`.

### Step 12.13: Research cohorts and eligibility filters
- Build cohort selection and eligibility filtering UI.
- Backend dependencies: patient registry modules, `consent`, `terms-acceptance`.

### Step 12.14: Research consent tracking UX
- Build research consent lifecycle views and actions.
- Backend dependencies: `consent`, `terms-acceptance`, `audit-log`.

### Step 12.15: Trial and research reporting dashboards
- Build trial execution and outcome dashboard views.
- Backend dependencies: `report-definition`, `report-run`, `dashboard-widget`.

### Step 12.16: PACS viewer integration surface
- Build imaging viewer launch and embedding surfaces.
- Backend dependencies: `imaging-study`, `imaging-asset`, `pacs-link`.

### Step 12.17: Imaging sharing and collaboration UX
- Build imaging sharing/review workflows for care teams.
- Backend dependencies: `imaging-asset`, `radiology-result`, `conversation`, `message`.

### Step 12.18: Device and wearable integration UX
- Build UI for external device feeds and wearable-linked trends.
- Backend dependencies: `integration`, `integration-log`, `webhook-subscription`.

### Step 12.19: Executive multi-branch KPI cockpit
- Build branch/facility aggregated KPI cockpit.
- Backend dependencies: `dashboard-widget`, `kpi-snapshot`, `report-run`.

### Step 12.20: Trend and forecasting analytics views
- Build long-range trend and forecast visualizations.
- Backend dependencies: `analytics-event`, `report-definition`, `report-run`.

### Step 12.21: Leadership custom report templates UX
- Build custom report template builder and scheduling surface.
- Backend dependencies: `report-definition`, `report-run`, `template`.

### Step 12.22: Nurse roster generation constraints UX
- Build roster rule/constraint configuration and generation trigger UI.
- Backend dependencies: `nurse-roster`, `shift-template`, `staff-availability`, `roster-day-off`.

### Step 12.23: Roster publish and distribution UX
- Build roster publish flows and nurse notification views.
- Backend dependencies: `nurse-roster`, `notification`, `notification-delivery`.

### Step 12.24: Manual overrides and swap governance UX
- Build override/swap handling with audit visibility.
- Backend dependencies: `shift-swap-request`, `shift-assignment`, `audit-log`, `system-change-log`.

### Step 12.25: Biomedical fault reporting entry points
- Build fast fault-report actions from nurse/clinical/ops contexts with prefilled location/context.
- Backend dependencies: `equipment-incident-report`, `equipment-registry`, `equipment-location-history`.

### Step 12.26: Biomedical engineering workbench core flows
- Build registry, preventive maintenance, corrective work order, and service-provider management workflows.
- Backend dependencies: `equipment-registry`, `equipment-maintenance-plan`, `equipment-work-order`, `equipment-service-provider`, `equipment-spare-part`.

### Step 12.27: Biomedical calibration, safety, and downtime insights
- Build calibration/safety logs and downtime/utilization dashboards for operations and compliance reviews.
- Backend dependencies: `equipment-calibration-log`, `equipment-safety-test-log`, `equipment-downtime-log`, `equipment-utilization-snapshot`, `equipment-recall-notice`.

### Step 12.28: Realtime event orchestration UX
- Build event-driven UI updates for queue, admissions, critical alerts, diagnostics release, pharmacy dispense, emergency dispatch, billing, and entitlement updates.
- Backend dependencies: WS event contracts from `hms-backend/dev-plan/P013_ws_features.mdc`.

### Step 12.29: Workflow action endpoint UX controls
- Build explicit UI controls for backend workflow actions (prioritize, transfer, finalize, release, sign-off, dispense, claim submit/reconcile, roster generate, biomedical triage/start/return-to-service).
- Backend dependencies: endpoint section `25` in `hms-backend/dev-plan/P010_api_endpoints.mdc`.

### Step 12.30: Commercial and entitlement operations UX
- Build subscription/module lifecycle UX for upgrade, downgrade, renewal, proration preview, activation/deactivation, and invoice collection/retry.
- Backend dependencies: endpoint section `26` in `hms-backend/dev-plan/P010_api_endpoints.mdc`.

### Step 12.31: Interoperability and migration operations console
- Build admin UX for integration test/sync/replay and interop import/export controls (FHIR/HL7/DICOM/migration flows).
- Backend dependencies: endpoint section `27` in `hms-backend/dev-plan/P010_api_endpoints.mdc`.

### Step 12.32: Growth acquisition surfaces
- Build public-facing services/providers/branches discovery and campaign management views with conversion instrumentation.
- Backend dependencies: endpoint section `28` (`public/services`, `public/providers`, `public/branches`, `campaigns`).

### Step 12.33: Referral and reputation loops UX
- Build referral redemption flows and NPS/CSAT capture/reporting surfaces.
- Backend dependencies: endpoint section `28` (`referrals`, `referrals/{id}/redeem`, `feedback/nps`, `feedback/csat`).

### Step 12.34: Configuration-first adaptability foundation UX
- Build policy/workflow/form configuration surfaces for tenant-level rules without code forks.
- Backend dependencies: `system-change-log`, `template`, `template-variable`, module entitlement resources.

### Step 12.35: Versioned tenant configuration governance UX
- Build publish/rollback/approval UX for tenant configuration releases with audit trails and scope-aware overrides.
- Backend dependencies: `system-change-log`, `audit-log`, `module-subscription`, `license`.

## Testing Gate (Applies to Every Step)
- Add tests for normal flow, edge cases, permission failures, and offline behavior.
- Maintain 100% coverage for changed modules per `testing.mdc`.
- Validate i18n and accessibility for all new user-facing UI.
- Validate WS event idempotency handling and duplicate-event safety for realtime-driven screens.
- Validate entitlement and feature-flag fallback paths for deferred backend contracts.
