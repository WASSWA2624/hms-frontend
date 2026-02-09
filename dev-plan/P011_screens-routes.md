# Phase 11: HMS Screens, Routes, and UI Wiring

## Purpose
Implementation guide: one step = one screen, in chronological order below. Wire screens to Phase 10 hooks; routes per `app-router.mdc`, UI per `platform-ui.mdc`. This phase must fully incorporate `onboarding-journey.md` (self-serve onboarding, trial, payment, retention hooks).

## Rules
- `.cursor/rules/index.mdc` / `app-router.mdc` / `platform-ui.mdc` / `component-structure.mdc` / `features-domain.mdc` / `security.mdc` / `accessibility.mdc` / `testing.mdc` / `theme-design.mdc` / `i18n.mdc`

## Prerequisites
Phase 10 (hooks), Phase 9 (layouts/nav), Phase 7 (app shell), Phase 6 (components).

## Guidelines
- **Order**: Follow **Sequential Build Order** below; one screen per step.
- Screens -> feature hooks only; i18n for all text; no hardcoded strings.
- Routes: per `app-router.mdc`; omit group in links; guards in group layouts.
- Nav: every route reachable from Phase 9 nav; add entry/icon/label per main screen.
- **Pattern**: Main screens in sidebar; sub-screens as tabs (list/detail/create-edit per tab). Deep links: e.g. `/settings/users`, `/billing/invoice`.
- Onboarding must implement: facility-type entry, minimal signup, resume-onboarding link handling, post-signup provisioning, facility-specific checklist, progressive module unlocks, trial status/limits, upgrade/paywall messaging, and self-serve payments.
- Onboarding state is saved after every step; resume link must restore exact step.
- Paywall never blocks existing data; only limits new actions and shows upgrade value.

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
|   |-- home.jsx
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

**One step = one screen.** Complete each step before the next. Where multiple tabs are listed, implement one screen per tab in that order.

### Tier 0: Public Entry + Onboarding (Self-Serve)
- **11.S.1** Landing + facility type selection -- `(public)/landing`
- **11.S.2** Register (minimal signup) -- `(auth)/register`
- **11.S.3** Resume link sent (check email) -- `(auth)/resume-link-sent`
- **11.S.4** Resume onboarding (token handler) -- `(onboarding)/resume`
- **11.S.5** Provisioning (tenant + modules + sample data) -- `(onboarding)/provisioning`
- **11.S.6** Welcome / activation summary -- `(onboarding)/welcome`
- **11.S.7** First-run checklist (facility-specific) -- `(onboarding)/checklist`
- **11.S.8** Module recommendations + progressive unlocks -- `(onboarding)/modules`
- **11.S.9** Trial status + limits -- `(onboarding)/trial`
- **11.S.10** Upgrade value (paywall messaging) -- `(onboarding)/upgrade`
- **11.S.11** Plan/modules selection -- `(onboarding)/plan`
- **11.S.12** Billing cycle selection -- `(onboarding)/billing-cycle`
- **11.S.13** Payment checkout -- `(onboarding)/payment`
- **11.S.14** Payment success + activation -- `(onboarding)/payment-success`

### Tier 1: Auth & Shell
- **11.S.15** Login -- `(auth)/login`
- **11.S.16** Forgot password -- `(auth)/forgot-password`
- **11.S.17** Reset password -- `(auth)/reset-password`
- **11.S.18** Verify email -- `(auth)/verify-email`
- **11.S.19** Verify phone -- `(auth)/verify-phone`
- **11.S.20** Tenant selection -- `(auth)/tenant-selection`
- **11.S.21** Facility selection -- `(auth)/facility-selection`
- **11.S.22** Home -- `(main)/home`

### Tier 2: Settings (main + tabs)
- **11.S.23** Settings (main) -- `(main)/settings`
- **11.S.24** Tenant -- `(main)/settings/tenants`
- **11.S.25** Facility -- `(main)/settings/facilities`
- **11.S.26** Branch -- `(main)/settings/branches`
- **11.S.27** Department -- `(main)/settings/departments`
- **11.S.28** Unit -- `(main)/settings/units`
- **11.S.29** Room -- `(main)/settings/rooms`
- **11.S.30** Ward -- `(main)/settings/wards`
- **11.S.31** Bed -- `(main)/settings/beds`
- **11.S.32** Address -- `(main)/settings/addresses`
- **11.S.33** Contact -- `(main)/settings/contacts`
- **11.S.34** User -- `(main)/settings/users`
- **11.S.35** User profile -- `(main)/settings/user-profiles`
- **11.S.36** Role -- `(main)/settings/roles`
- **11.S.37** Permission -- `(main)/settings/permissions`
- **11.S.38** Role-permission -- `(main)/settings/role-permissions`
- **11.S.39** User-role -- `(main)/settings/user-roles`
- **11.S.40** API key -- `(main)/settings/api-keys`
- **11.S.41** API key permission -- `(main)/settings/api-key-permissions`
- **11.S.42** User MFA -- `(main)/settings/user-mfas`
- **11.S.43** User session -- `(main)/settings/user-sessions`
- **11.S.44** OAuth account -- `(main)/settings/oauth-accounts`

### Tier 3: Patients (main + tabs)
- **11.S.45** Patients (main) -- `(main)/patients`
- **11.S.46** Patient -- `(main)/patients/patients`
- **11.S.47** Patient identifier -- `(main)/patients/patient-identifiers`
- **11.S.48** Patient contact -- `(main)/patients/patient-contacts`
- **11.S.49** Patient guardian -- `(main)/patients/patient-guardians`
- **11.S.50** Patient allergy -- `(main)/patients/patient-allergies`
- **11.S.51** Patient medical history -- `(main)/patients/patient-medical-histories`
- **11.S.52** Patient document -- `(main)/patients/patient-documents`

### Tier 4: Scheduling (main + tabs)
- **11.S.53** Scheduling (main) -- `(main)/scheduling`
- **11.S.54** Appointment -- `(main)/scheduling/appointments`
- **11.S.55** Provider schedule -- `(main)/scheduling/provider-schedules`
- **11.S.56** Availability slot -- `(main)/scheduling/availability-slots`
- **11.S.57** Visit queue -- `(main)/scheduling/visit-queues`

### Tier 5: Clinical (main + tabs)
- **11.S.58** Clinical (main) -- `(main)/clinical`
- **11.S.59** Encounter -- `(main)/clinical/encounters`
- **11.S.60** Clinical note -- `(main)/clinical/clinical-notes`
- **11.S.61** Diagnosis -- `(main)/clinical/diagnoses`
- **11.S.62** Procedure -- `(main)/clinical/procedures`
- **11.S.63** Vital sign -- `(main)/clinical/vital-signs`
- **11.S.64** Care plan -- `(main)/clinical/care-plans`
- **11.S.65** Referral -- `(main)/clinical/referrals`
- **11.S.66** Follow-up -- `(main)/clinical/follow-ups`

### Tier 6: IPD, ICU, Theatre, Emergency
- **11.S.67** IPD (main) -- `(main)/ipd`
- **11.S.68** IPD tabs: admission, bed-assignment, ward-round, nursing-note, medication-admin, discharge, transfer -- `(main)/ipd/*` (one step per tab)
- **11.S.69** ICU (main) -- `(main)/icu`
- **11.S.70** ICU tabs: stay, observation, critical-alert -- `(main)/icu/*` (one step per tab)
- **11.S.71** Theatre (main) -- `(main)/theatre`
- **11.S.72** Theatre tabs: case, anesthesia-record, post-op-note -- `(main)/theatre/*` (one step per tab)
- **11.S.73** Emergency (main) -- `(main)/emergency`
- **11.S.74** Emergency tabs: case, triage, response, ambulance, dispatch, trip -- `(main)/emergency/*` (one step per tab)

### Tier 7: Diagnostics (Lab + Radiology)
- **11.S.75** Lab (main) -- `(main)/diagnostics/lab`
- **11.S.76** Lab tabs: test, panel, order, sample, result, QC -- `(main)/diagnostics/lab/*` (one step per tab)
- **11.S.77** Radiology (main) -- `(main)/diagnostics/radiology`
- **11.S.78** Radiology tabs: test, order, result, imaging, PACS -- `(main)/diagnostics/radiology/*` (one step per tab)

### Tier 8: Pharmacy, Inventory
- **11.S.79** Pharmacy (main) -- `(main)/pharmacy`
- **11.S.80** Pharmacy tabs: drug, batch, formulary, order, dispense, adverse-event -- `(main)/pharmacy/*` (one step per tab)
- **11.S.81** Inventory (main) -- `(main)/inventory`
- **11.S.82** Inventory tabs: item, stock, movement, supplier, purchase, receipt, adjustment -- `(main)/inventory/*` (one step per tab)

### Tier 9: Billing, HR, Housekeeping, Reports, Comms, Subscriptions, Integrations, Compliance
- **11.S.83** Billing (main) -- `(main)/billing`
- **11.S.84** Billing tabs: invoice, payment, refund, pricing, coverage, claim, pre-auth, adjustment -- `(main)/billing/*` (one step per tab)
- **11.S.85** HR (main) -- `(main)/hr`
- **11.S.86** HR tabs: staff, assignment, leave, shift, nurse-timetable, payroll -- `(main)/hr/*` (one step per tab; nurse-timetable = Nurses Time-table Generator per write-up Sec 5.17)
- **11.S.87** Housekeeping (main) -- `(main)/housekeeping`
- **11.S.88** Housekeeping tabs: task, schedule, maintenance, asset, service-log -- `(main)/housekeeping/*` (one step per tab)
- **11.S.89** Reports (main) -- `(main)/reports`
- **11.S.90** Communications (main) -- `(main)/communications`
- **11.S.91** Subscriptions (main) -- `(main)/subscriptions`
- **11.S.92** Integrations (main) -- `(main)/integrations`
- **11.S.93** Compliance (main) -- `(main)/compliance`

### Tier 10: Patient portal
- **11.S.94** Patient portal (main) -- `(patient)/portal`
- **11.S.95** Patient appointments -- `(patient)/appointments`
- **11.S.96** Patient results -- `(patient)/results`
- **11.S.97** Patient prescriptions -- `(patient)/prescriptions`
- **11.S.98** Patient billing -- `(patient)/billing`

---

## Per-step checklist
Per screen: routes per `app-router.mdc`; screen per `platform-ui.mdc` + `component-structure.mdc`; wire to hooks; i18n; loading/error/empty/guarded states; nav entry for main screens. Tests per `testing.mdc`; a11y per `accessibility.mdc`.

## Completeness
- [ ] 11.S.1-14 (public entry + onboarding)
- [ ] 11.S.15-22 (auth, home)
- [ ] 11.S.23-44 (Settings main + tabs)
- [ ] 11.S.45-66 (Patients, Scheduling, Clinical)
- [ ] 11.S.67-82 (IPD, ICU, Theatre, Emergency, Lab, Radiology, Pharmacy, Inventory)
- [ ] 11.S.83-98 (Billing, HR, Housekeeping, Reports, Comms, Subscriptions, Integrations, Compliance, Patient portal)
- [ ] Nav + deep links for all main screens

## Settings status (11.S.23-44)
- **23-25** tenant, facility -- List OK, Detail OK, Create/Edit OK
- **26-31** branch, department, unit, room, ward, bed -- List OK, Detail OK, Create/Edit OK
- **32-33** address, contact -- List OK, Detail OK, Create/Edit OK
- **34-44** user ... oauth-account -- List OK, Detail OK, Create/Edit TBD

Backend: facility/tenant usecases unwrap `response.data.data`; other CRUD same pattern when backend returns `{ data }`.
