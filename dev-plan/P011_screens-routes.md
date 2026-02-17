# Phase 11: HMS Screens, Routes, and UI Wiring

## Purpose
Implement HMS routes and screens in strict chronological order. One step equals one screen route. Each screen consumes Phase 10 hooks/features and maps to backend resources. Tier 1 onboarding steps must preserve self-serve onboarding, trial, payment, and resume-flow requirements.

## Rule References
- `.cursor/rules/index.mdc`
- `.cursor/rules/app-router.mdc`
- `.cursor/rules/platform-ui.mdc`
- `.cursor/rules/component-structure.mdc`
- `.cursor/rules/features-domain.mdc`
- `.cursor/rules/hooks-utils.mdc`
- `.cursor/rules/security.mdc`
- `.cursor/rules/errors-logging.mdc`
- `.cursor/rules/offline-sync.mdc`
- `.cursor/rules/performance.mdc`
- `.cursor/rules/accessibility.mdc`
- `.cursor/rules/testing.mdc`
- `.cursor/rules/theme-design.mdc`
- `.cursor/rules/i18n.mdc`

## Prerequisites
- Phase 10 completed (feature modules and hooks)
- Phase 9 completed (layouts and shell UI)
- Phase 7 completed (router groups and guards)
- Phase 6 completed (reusable platform components)

## Write-up Coverage
- `write-up.md` sections `7.1` to `7.10` (workflow route journeys).
- `write-up.md` section `8.2` (screen contract: list/create/detail/edit + related panels).
- `write-up.md` sections `8.3` to `8.6` (a11y, low-bandwidth behavior, i18n, UI simplicity charter).
- `write-up.md` sections `9` and `10` (entitlement and commercial route behavior).
- `write-up.md` section `17` (placeholder route retirement and route parity verification).

## Backend Alignment (Mandatory)
- Module source of truth: mounted backend modules in `hms-backend/src/app/router.js` (use `hms-backend/dev-plan/P011_modules.mdc` where synchronized)
- Endpoint/path source of truth: `hms-backend/dev-plan/P010_api_endpoints.mdc`
- Frontend module implementation source of truth: `P010_core-features.md`
- Every module-backed screen below includes explicit backend module mapping.
- Workflow actions source of truth: `hms-backend/dev-plan/P010_api_endpoints.mdc` section `25`.
- Commercial/interop/growth route dependencies source of truth: sections `26`, `27`, and `28`.

## Atomic Step Contract
- One step equals one route file under `src/app/**` and one screen implementation under `src/platform/screens/**`.
- Do not combine multiple module screens into one step.
- Do not skip step order.
- Complete tests and verification for the current step before moving to the next.

## Route Coverage Snapshot (2026-02-17)
- Planned route steps in this file: **207**.
- Planned route steps with on-disk route entry files: **207/207**.
- Remaining placeholder catch-all files in `src/app/**`: **22** (tracked for retirement in Phase 13).

## Route Structure

```text
src/app/
|-- _layout.jsx
|-- index.jsx
|-- _error.jsx
|-- +not-found.jsx
|
|-- (public)/
|   |-- _layout.jsx
|   |-- landing.jsx
|
|-- (auth)/
|   |-- _layout.jsx
|   |-- login.jsx
|   |-- register.jsx
|   |-- resume-link-sent.jsx
|   |-- forgot-password.jsx
|   |-- reset-password.jsx
|   |-- verify-email.jsx
|   |-- verify-phone.jsx
|   |-- tenant-selection.jsx
|   |-- facility-selection.jsx
|
|-- (onboarding)/
|   |-- _layout.jsx
|   |-- resume.jsx
|   |-- provisioning.jsx
|   |-- welcome.jsx
|   |-- checklist.jsx
|   |-- modules.jsx
|   |-- trial.jsx
|   |-- upgrade.jsx
|   |-- plan.jsx
|   |-- billing-cycle.jsx
|   |-- payment.jsx
|   |-- payment-success.jsx
|
|-- (main)/
|   |-- _layout.jsx
|   |-- dashboard.jsx
|   |-- patients/
|   |-- scheduling/
|   |-- clinical/
|   |-- ipd/
|   |-- icu/
|   |-- theatre/
|   |-- diagnostics/
|   |   |-- lab/
|   |   |-- radiology/
|   |-- pharmacy/
|   |-- inventory/
|   |-- emergency/
|   |-- billing/
|   |-- hr/
|   |-- housekeeping/
|   |   |-- biomedical/
|   |-- reports/
|   |-- communications/
|   |-- subscriptions/
|   |-- integrations/
|   |-- compliance/
|   |-- settings/
|
|-- (patient)/
    |-- _layout.jsx
    |-- portal/
    |-- appointments/
    |-- results/
    |-- prescriptions/
    |-- billing/
```

## Sequential Build Order

### Tier 1: Public Entry and Onboarding
- **11.1.1** Landing and facility type - `(public)/landing`
- **11.1.2** Register (minimal signup) - `(auth)/register` - backend `auth`
- **11.1.3** Resume link sent - `(auth)/resume-link-sent`
- **11.1.4** Resume onboarding token handler - `(onboarding)/resume`
- **11.1.5** Provisioning flow - `(onboarding)/provisioning`
- **11.1.6** Welcome and activation summary - `(onboarding)/welcome`
- **11.1.7** Facility checklist - `(onboarding)/checklist`
- **11.1.8** Module recommendations and unlocks - `(onboarding)/modules`
- **11.1.9** Trial status and limits - `(onboarding)/trial`
- **11.1.10** Upgrade value and paywall messaging - `(onboarding)/upgrade`
- **11.1.11** Plan and modules selection - `(onboarding)/plan`
- **11.1.12** Billing cycle selection - `(onboarding)/billing-cycle`
- **11.1.13** Payment checkout - `(onboarding)/payment`
- **11.1.14** Payment success and activation - `(onboarding)/payment-success`

### Tier 2: Auth and Entry Shell
- **11.2.1** Login - `(auth)/login` - backend `auth`
- **11.2.2** Forgot password - `(auth)/forgot-password` - backend `auth`
- **11.2.3** Reset password - `(auth)/reset-password` - backend `auth`
- **11.2.4** Verify email - `(auth)/verify-email` - backend `auth`
- **11.2.5** Verify phone - `(auth)/verify-phone` - backend `auth`
- **11.2.6** Tenant selection - `(auth)/tenant-selection` - backend `tenant`
- **11.2.7** Facility selection - `(auth)/facility-selection` - backend `facility`
- **11.2.8** Dashboard - `(main)/dashboard`

### Tier 3: Settings and Core Access Modules
- **11.3.1** Settings home - `(main)/settings`
- **11.3.2** Tenants - `(main)/settings/tenants` - backend `tenant`
- **11.3.3** Facilities - `(main)/settings/facilities` - backend `facility`
- **11.3.4** Branches - `(main)/settings/branches` - backend `branch`
- **11.3.5** Departments - `(main)/settings/departments` - backend `department`
- **11.3.6** Units - `(main)/settings/units` - backend `unit`
- **11.3.7** Rooms - `(main)/settings/rooms` - backend `room`
- **11.3.8** Wards - `(main)/settings/wards` - backend `ward`
- **11.3.9** Beds - `(main)/settings/beds` - backend `bed`
- **11.3.10** Addresses - `(main)/settings/addresses` - backend `address`
- **11.3.11** Contacts - `(main)/settings/contacts` - backend `contact`
- **11.3.12** Users - `(main)/settings/users` - backend `user`
- **11.3.13** User profiles - `(main)/settings/user-profiles` - backend `user-profile`
- **11.3.14** Roles - `(main)/settings/roles` - backend `role`
- **11.3.15** Permissions - `(main)/settings/permissions` - backend `permission`
- **11.3.16** Role permissions - `(main)/settings/role-permissions` - backend `role-permission`
- **11.3.17** User roles - `(main)/settings/user-roles` - backend `user-role`
- **11.3.18** API keys - `(main)/settings/api-keys` - backend `api-key`
- **11.3.19** API key permissions - `(main)/settings/api-key-permissions` - backend `api-key-permission`
- **11.3.20** User MFA - `(main)/settings/user-mfas` - backend `user-mfa`
- **11.3.21** User sessions - `(main)/settings/user-sessions` - backend `user-session`
- **11.3.22** OAuth accounts - `(main)/settings/oauth-accounts` - backend `oauth-account`

### Tier 4: Patient Registry and Consent
- **11.4.1** Patients home - `(main)/patients`
- **11.4.2** Patients - `(main)/patients/patients` - backend `patient`
- **11.4.3** Patient identifiers - `(main)/patients/patient-identifiers` - backend `patient-identifier`
- **11.4.4** Patient contacts - `(main)/patients/patient-contacts` - backend `patient-contact`
- **11.4.5** Patient guardians - `(main)/patients/patient-guardians` - backend `patient-guardian`
- **11.4.6** Patient allergies - `(main)/patients/patient-allergies` - backend `patient-allergy`
- **11.4.7** Patient medical histories - `(main)/patients/patient-medical-histories` - backend `patient-medical-history`
- **11.4.8** Patient documents - `(main)/patients/patient-documents` - backend `patient-document`
- **11.4.9** Consents - `(main)/patients/consents` - backend `consent`
- **11.4.10** Terms acceptances - `(main)/patients/terms-acceptances` - backend `terms-acceptance`

### Tier 5: Scheduling, Availability, and Queues
- **11.5.1** Scheduling home - `(main)/scheduling`
- **11.5.2** Appointments - `(main)/scheduling/appointments` - backend `appointment`
- **11.5.3** Appointment participants - `(main)/scheduling/appointment-participants` - backend `appointment-participant`
- **11.5.4** Appointment reminders - `(main)/scheduling/appointment-reminders` - backend `appointment-reminder`
- **11.5.5** Provider schedules - `(main)/scheduling/provider-schedules` - backend `provider-schedule`
- **11.5.6** Availability slots - `(main)/scheduling/availability-slots` - backend `availability-slot`
- **11.5.7** Visit queues - `(main)/scheduling/visit-queues` - backend `visit-queue`

### Tier 6: Encounters and Clinical Documentation
- **11.6.1** Clinical home - `(main)/clinical`
- **11.6.2** Encounters - `(main)/clinical/encounters` - backend `encounter`
- **11.6.3** Clinical notes - `(main)/clinical/clinical-notes` - backend `clinical-note`
- **11.6.4** Diagnoses - `(main)/clinical/diagnoses` - backend `diagnosis`
- **11.6.5** Procedures - `(main)/clinical/procedures` - backend `procedure`
- **11.6.6** Vital signs - `(main)/clinical/vital-signs` - backend `vital-sign`
- **11.6.7** Care plans - `(main)/clinical/care-plans` - backend `care-plan`
- **11.6.8** Clinical alerts - `(main)/clinical/clinical-alerts` - backend `clinical-alert`
- **11.6.9** Referrals - `(main)/clinical/referrals` - backend `referral`
- **11.6.10** Follow-ups - `(main)/clinical/follow-ups` - backend `follow-up`

### Tier 7: IPD, ICU, Theatre, and Emergency
- **11.7.1** IPD home - `(main)/ipd`
- **11.7.2** Admissions - `(main)/ipd/admissions` - backend `admission`
- **11.7.3** Bed assignments - `(main)/ipd/bed-assignments` - backend `bed-assignment`
- **11.7.4** Ward rounds - `(main)/ipd/ward-rounds` - backend `ward-round`
- **11.7.5** Nursing notes - `(main)/ipd/nursing-notes` - backend `nursing-note`
- **11.7.6** Medication administrations - `(main)/ipd/medication-administrations` - backend `medication-administration`
- **11.7.7** Discharge summaries - `(main)/ipd/discharge-summaries` - backend `discharge-summary`
- **11.7.8** Transfer requests - `(main)/ipd/transfer-requests` - backend `transfer-request`
- **11.7.9** ICU home - `(main)/icu`
- **11.7.10** ICU stays - `(main)/icu/icu-stays` - backend `icu-stay`
- **11.7.11** ICU observations - `(main)/icu/icu-observations` - backend `icu-observation`
- **11.7.12** Critical alerts - `(main)/icu/critical-alerts` - backend `critical-alert`
- **11.7.13** Theatre home - `(main)/theatre`
- **11.7.14** Theatre cases - `(main)/theatre/theatre-cases` - backend `theatre-case`
- **11.7.15** Anesthesia records - `(main)/theatre/anesthesia-records` - backend `anesthesia-record`
- **11.7.16** Post-op notes - `(main)/theatre/post-op-notes` - backend `post-op-note`
- **11.7.17** Emergency home - `(main)/emergency`
- **11.7.18** Emergency cases - `(main)/emergency/emergency-cases` - backend `emergency-case`
- **11.7.19** Triage assessments - `(main)/emergency/triage-assessments` - backend `triage-assessment`
- **11.7.20** Emergency responses - `(main)/emergency/emergency-responses` - backend `emergency-response`
- **11.7.21** Ambulances - `(main)/emergency/ambulances` - backend `ambulance`
- **11.7.22** Ambulance dispatches - `(main)/emergency/ambulance-dispatches` - backend `ambulance-dispatch`
- **11.7.23** Ambulance trips - `(main)/emergency/ambulance-trips` - backend `ambulance-trip`

### Tier 8: Diagnostics (Lab and Radiology)
- **11.8.1** Lab home - `(main)/diagnostics/lab`
- **11.8.2** Lab tests - `(main)/diagnostics/lab/lab-tests` - backend `lab-test`
- **11.8.3** Lab panels - `(main)/diagnostics/lab/lab-panels` - backend `lab-panel`
- **11.8.4** Lab orders - `(main)/diagnostics/lab/lab-orders` - backend `lab-order`
- **11.8.5** Lab order items - `(main)/diagnostics/lab/lab-order-items` - backend `lab-order-item`
- **11.8.6** Lab samples - `(main)/diagnostics/lab/lab-samples` - backend `lab-sample`
- **11.8.7** Lab results - `(main)/diagnostics/lab/lab-results` - backend `lab-result`
- **11.8.8** Lab QC logs - `(main)/diagnostics/lab/lab-qc-logs` - backend `lab-qc-log`
- **11.8.9** Radiology home - `(main)/diagnostics/radiology`
- **11.8.10** Radiology tests - `(main)/diagnostics/radiology/radiology-tests` - backend `radiology-test`
- **11.8.11** Radiology orders - `(main)/diagnostics/radiology/radiology-orders` - backend `radiology-order`
- **11.8.12** Radiology results - `(main)/diagnostics/radiology/radiology-results` - backend `radiology-result`
- **11.8.13** Imaging studies - `(main)/diagnostics/radiology/imaging-studies` - backend `imaging-study`
- **11.8.14** Imaging assets - `(main)/diagnostics/radiology/imaging-assets` - backend `imaging-asset`
- **11.8.15** PACS links - `(main)/diagnostics/radiology/pacs-links` - backend `pacs-link`

### Tier 9: Pharmacy and Inventory
- **11.9.1** Pharmacy home - `(main)/pharmacy`
- **11.9.2** Drugs - `(main)/pharmacy/drugs` - backend `drug`
- **11.9.3** Drug batches - `(main)/pharmacy/drug-batches` - backend `drug-batch`
- **11.9.4** Formulary items - `(main)/pharmacy/formulary-items` - backend `formulary-item`
- **11.9.5** Pharmacy orders - `(main)/pharmacy/pharmacy-orders` - backend `pharmacy-order`
- **11.9.6** Pharmacy order items - `(main)/pharmacy/pharmacy-order-items` - backend `pharmacy-order-item`
- **11.9.7** Dispense logs - `(main)/pharmacy/dispense-logs` - backend `dispense-log`
- **11.9.8** Adverse events - `(main)/pharmacy/adverse-events` - backend `adverse-event`
- **11.9.9** Inventory home - `(main)/inventory`
- **11.9.10** Inventory items - `(main)/inventory/inventory-items` - backend `inventory-item`
- **11.9.11** Inventory stocks - `(main)/inventory/inventory-stocks` - backend `inventory-stock`
- **11.9.12** Stock movements - `(main)/inventory/stock-movements` - backend `stock-movement`
- **11.9.13** Suppliers - `(main)/inventory/suppliers` - backend `supplier`
- **11.9.14** Purchase requests - `(main)/inventory/purchase-requests` - backend `purchase-request`
- **11.9.15** Purchase orders - `(main)/inventory/purchase-orders` - backend `purchase-order`
- **11.9.16** Goods receipts - `(main)/inventory/goods-receipts` - backend `goods-receipt`
- **11.9.17** Stock adjustments - `(main)/inventory/stock-adjustments` - backend `stock-adjustment`

### Tier 10: Billing, HR, Facilities, Biomedical Engineering, Reporting, Communications, Subscriptions, Integrations, Compliance
- **11.10.1** Billing home - `(main)/billing`
- **11.10.2** Invoices - `(main)/billing/invoices` - backend `invoice`
- **11.10.3** Invoice items - `(main)/billing/invoice-items` - backend `invoice-item`
- **11.10.4** Payments - `(main)/billing/payments` - backend `payment`
- **11.10.5** Refunds - `(main)/billing/refunds` - backend `refund`
- **11.10.6** Pricing rules - `(main)/billing/pricing-rules` - backend `pricing-rule`
- **11.10.7** Coverage plans - `(main)/billing/coverage-plans` - backend `coverage-plan`
- **11.10.8** Insurance claims - `(main)/billing/insurance-claims` - backend `insurance-claim`
- **11.10.9** Pre-authorizations - `(main)/billing/pre-authorizations` - backend `pre-authorization`
- **11.10.10** Billing adjustments - `(main)/billing/billing-adjustments` - backend `billing-adjustment`
- **11.10.11** HR home - `(main)/hr`
- **11.10.12** Staff positions - `(main)/hr/staff-positions` - backend `staff-position`
- **11.10.13** Staff profiles - `(main)/hr/staff-profiles` - backend `staff-profile`
- **11.10.14** Staff assignments - `(main)/hr/staff-assignments` - backend `staff-assignment`
- **11.10.15** Staff leaves - `(main)/hr/staff-leaves` - backend `staff-leave`
- **11.10.16** Shifts - `(main)/hr/shifts` - backend `shift`
- **11.10.17** Shift assignments - `(main)/hr/shift-assignments` - backend `shift-assignment`
- **11.10.18** Shift swap requests - `(main)/hr/shift-swap-requests` - backend `shift-swap-request`
- **11.10.19** Nurse rosters - `(main)/hr/nurse-rosters` - backend `nurse-roster`
- **11.10.20** Shift templates - `(main)/hr/shift-templates` - backend `shift-template`
- **11.10.21** Roster day offs - `(main)/hr/roster-day-offs` - backend `roster-day-off`
- **11.10.22** Staff availabilities - `(main)/hr/staff-availabilities` - backend `staff-availability`
- **11.10.23** Payroll runs - `(main)/hr/payroll-runs` - backend `payroll-run`
- **11.10.24** Payroll items - `(main)/hr/payroll-items` - backend `payroll-item`
- **11.10.25** Housekeeping home - `(main)/housekeeping`
- **11.10.26** Housekeeping tasks - `(main)/housekeeping/housekeeping-tasks` - backend `housekeeping-task`
- **11.10.27** Housekeeping schedules - `(main)/housekeeping/housekeeping-schedules` - backend `housekeeping-schedule`
- **11.10.28** Maintenance requests - `(main)/housekeeping/maintenance-requests` - backend `maintenance-request`
- **11.10.29** Assets - `(main)/housekeeping/assets` - backend `asset`
- **11.10.30** Asset service logs - `(main)/housekeeping/asset-service-logs` - backend `asset-service-log`
- **11.10.31** Communications home - `(main)/communications`
- **11.10.32** Notifications - `(main)/communications/notifications` - backend `notification`
- **11.10.33** Notification deliveries - `(main)/communications/notification-deliveries` - backend `notification-delivery`
- **11.10.34** Conversations - `(main)/communications/conversations` - backend `conversation`
- **11.10.35** Messages - `(main)/communications/messages` - backend `message`
- **11.10.36** Templates - `(main)/communications/templates` - backend `template`
- **11.10.37** Template variables - `(main)/communications/template-variables` - backend `template-variable`
- **11.10.38** Reports home - `(main)/reports`
- **11.10.39** Report definitions - `(main)/reports/report-definitions` - backend `report-definition`
- **11.10.40** Report runs - `(main)/reports/report-runs` - backend `report-run`
- **11.10.41** Dashboard widgets - `(main)/reports/dashboard-widgets` - backend `dashboard-widget`
- **11.10.42** KPI snapshots - `(main)/reports/kpi-snapshots` - backend `kpi-snapshot`
- **11.10.43** Analytics events - `(main)/reports/analytics-events` - backend `analytics-event`
- **11.10.44** Subscriptions home - `(main)/subscriptions`
- **11.10.45** Subscription plans - `(main)/subscriptions/subscription-plans` - backend `subscription-plan`
- **11.10.46** Subscriptions - `(main)/subscriptions/subscriptions` - backend `subscription`
- **11.10.47** Subscription invoices - `(main)/subscriptions/subscription-invoices` - backend `subscription-invoice`
- **11.10.48** Modules - `(main)/subscriptions/modules` - backend `module`
- **11.10.49** Module subscriptions - `(main)/subscriptions/module-subscriptions` - backend `module-subscription`
- **11.10.50** Licenses - `(main)/subscriptions/licenses` - backend `license`
- **11.10.51** Compliance home - `(main)/compliance`
- **11.10.52** Audit logs - `(main)/compliance/audit-logs` - backend `audit-log`
- **11.10.53** PHI access logs - `(main)/compliance/phi-access-logs` - backend `phi-access-log`
- **11.10.54** Data processing logs - `(main)/compliance/data-processing-logs` - backend `data-processing-log`
- **11.10.55** Breach notifications - `(main)/compliance/breach-notifications` - backend `breach-notification`
- **11.10.56** System change logs - `(main)/compliance/system-change-logs` - backend `system-change-log`
- **11.10.57** Integrations home - `(main)/integrations`
- **11.10.58** Integrations - `(main)/integrations/integrations` - backend `integration`
- **11.10.59** Integration logs - `(main)/integrations/integration-logs` - backend `integration-log`
- **11.10.60** Webhook subscriptions - `(main)/integrations/webhook-subscriptions` - backend `webhook-subscription`
- **11.10.61** Biomedical home - `(main)/housekeeping/biomedical`
- **11.10.62** Equipment categories - `(main)/housekeeping/biomedical/equipment-categories` - backend `equipment-category`
- **11.10.63** Equipment registries - `(main)/housekeeping/biomedical/equipment-registries` - backend `equipment-registry`
- **11.10.64** Equipment location histories - `(main)/housekeeping/biomedical/equipment-location-histories` - backend `equipment-location-history`
- **11.10.65** Equipment disposal transfers - `(main)/housekeeping/biomedical/equipment-disposal-transfers` - backend `equipment-disposal-transfer`
- **11.10.66** Equipment maintenance plans - `(main)/housekeeping/biomedical/equipment-maintenance-plans` - backend `equipment-maintenance-plan`
- **11.10.67** Equipment work orders - `(main)/housekeeping/biomedical/equipment-work-orders` - backend `equipment-work-order`
- **11.10.68** Equipment calibration logs - `(main)/housekeeping/biomedical/equipment-calibration-logs` - backend `equipment-calibration-log`
- **11.10.69** Equipment safety test logs - `(main)/housekeeping/biomedical/equipment-safety-test-logs` - backend `equipment-safety-test-log`
- **11.10.70** Equipment downtime logs - `(main)/housekeeping/biomedical/equipment-downtime-logs` - backend `equipment-downtime-log`
- **11.10.71** Equipment incident reports - `(main)/housekeeping/biomedical/equipment-incident-reports` - backend `equipment-incident-report`
- **11.10.72** Equipment recall notices - `(main)/housekeeping/biomedical/equipment-recall-notices` - backend `equipment-recall-notice`
- **11.10.73** Equipment spare parts - `(main)/housekeeping/biomedical/equipment-spare-parts` - backend `equipment-spare-part`
- **11.10.74** Equipment warranty contracts - `(main)/housekeeping/biomedical/equipment-warranty-contracts` - backend `equipment-warranty-contract`
- **11.10.75** Equipment service providers - `(main)/housekeeping/biomedical/equipment-service-providers` - backend `equipment-service-provider`
- **11.10.76** Equipment utilization snapshots - `(main)/housekeeping/biomedical/equipment-utilization-snapshots` - backend `equipment-utilization-snapshot`

#### Step 11.10.12 Historical Closure Note (`(main)/hr/staff-positions`)
Parity checklist closed on `2026-02-17`.

Verification evidence (keep in CI):
- Route files exist for list/create/detail/edit under `src/app/(main)/hr/staff-positions/`.
- Tier 10 route parity tests include `staff-positions` cases.
- Clinical resource config and CRUD mapping include `staff-positions`.
- Navigation + i18n labels remain wired for `/hr/staff-positions`.

### Tier 11: Patient Portal
- **11.11.1** Patient portal home - `(patient)/portal`
- **11.11.2** Patient appointments - `(patient)/appointments`
- **11.11.3** Patient results - `(patient)/results`
- **11.11.4** Patient prescriptions - `(patient)/prescriptions`
- **11.11.5** Patient billing - `(patient)/billing`

## Per-step Checklist
- Route file created in `src/app/**` with default export.
- Platform screen created in `src/platform/screens/**` following `component-structure.mdc`.
- Screen wired only through hooks/features; no direct service/store internals.
- Module screens provide `list/create/detail/edit` surfaces unless the backend resource is explicitly read-only.
- Workflow action endpoints (section `25`) have explicit UI states: pending, success, failure, retry, and permission-denied.
- All user-facing text uses i18n keys.
- Loading, empty, error, and offline states implemented.
- Guard and navigation behavior verified.
- Tests added and passing per `testing.mdc` (including a11y coverage).

## Completeness
Route-file coverage status (`2026-02-17`):
- [x] Tier 1 (`11.1.1-11.1.14`) public entry and onboarding.
- [x] Tier 2 (`11.2.1-11.2.8`) auth and shell.
- [x] Tier 3 (`11.3.1-11.3.22`) settings and core access.
- [x] Tier 4 (`11.4.1-11.4.10`) patient registry and consent.
- [x] Tier 5 (`11.5.1-11.5.7`) scheduling and queues.
- [x] Tier 6 (`11.6.1-11.6.10`) clinical documentation.
- [x] Tier 7 (`11.7.1-11.7.23`) IPD, ICU, theatre, emergency.
- [x] Tier 8 (`11.8.1-11.8.15`) diagnostics.
- [x] Tier 9 (`11.9.1-11.9.17`) pharmacy and inventory.
- [x] Tier 10 (`11.10.1-11.10.76`) billing, HR, facilities, biomedical engineering, reporting, communications, subscriptions, integrations, compliance.
- [x] Tier 11 (`11.11.1-11.11.5`) patient portal.
- [ ] Functional hardening/regression sign-off across all routes (Phase 13 gate).
- [ ] Placeholder catch-all route retirement complete (`[...missing].jsx` files).

## Settings Status (`11.3.1-11.3.22`)
- `11.3.1-11.3.17`: list/detail/create-edit flows implemented.
- `11.3.18`: API keys list/detail implemented; create-edit currently read-only by current policy.
- `11.3.19-11.3.20`: list/detail/create-edit flows implemented.
- `11.3.21`: user sessions list/detail implemented; create-edit not applicable.
- `11.3.22`: list/detail/create-edit flows implemented.


