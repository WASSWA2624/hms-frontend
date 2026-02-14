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

### Tier 1: Public Entry + Onboarding (Self-Serve)
- **11.1.1** Landing + facility type selection -- `(public)/landing`
- **11.1.2** Register (minimal signup) -- `(auth)/register`
- **11.1.3** Resume link sent (check email) -- `(auth)/resume-link-sent`
- **11.1.4** Resume onboarding (token handler) -- `(onboarding)/resume`
- **11.1.5** Provisioning (tenant + modules + sample data) -- `(onboarding)/provisioning`
- **11.1.6** Welcome / activation summary -- `(onboarding)/welcome`
- **11.1.7** First-run checklist (facility-specific) -- `(onboarding)/checklist`
- **11.1.8** Module recommendations + progressive unlocks -- `(onboarding)/modules`
- **11.1.9** Trial status + limits -- `(onboarding)/trial`
- **11.1.10** Upgrade value (paywall messaging) -- `(onboarding)/upgrade`
- **11.1.11** Plan/modules selection -- `(onboarding)/plan`
- **11.1.12** Billing cycle selection -- `(onboarding)/billing-cycle`
- **11.1.13** Payment checkout -- `(onboarding)/payment`
- **11.1.14** Payment success + activation -- `(onboarding)/payment-success`

### Tier 2: Auth & Shell
- **11.2.1** Login -- `(auth)/login`
- **11.2.2** Forgot password -- `(auth)/forgot-password`
- **11.2.3** Reset password -- `(auth)/reset-password`
- **11.2.4** Verify email -- `(auth)/verify-email`
- **11.2.5** Verify phone -- `(auth)/verify-phone`
- **11.2.6** Tenant selection -- `(auth)/tenant-selection`
- **11.2.7** Facility selection -- `(auth)/facility-selection`
- **11.2.8** Dashboard -- `(main)/dashboard`

### Tier 3: Settings (main)
- **11.3.1** Settings (main) -- `(main)/settings`
- **11.3.2** Tenant -- `(main)/settings/tenants`
- **11.3.3** Facility -- `(main)/settings/facilities`
- **11.3.4** Branch -- `(main)/settings/branches`
- **11.3.5** Department -- `(main)/settings/departments`
- **11.3.6** Unit -- `(main)/settings/units`
- **11.3.7** Room -- `(main)/settings/rooms`
- **11.3.8** Ward -- `(main)/settings/wards`
- **11.3.9** Bed -- `(main)/settings/beds`
- **11.3.10** Address -- `(main)/settings/addresses`
- **11.3.11** Contact -- `(main)/settings/contacts`
- **11.3.12** User -- `(main)/settings/users`
- **11.3.13** User profile -- `(main)/settings/user-profiles`
- **11.3.14** Role -- `(main)/settings/roles`
- **11.3.15** Permission -- `(main)/settings/permissions`
- **11.3.16** Role-permission -- `(main)/settings/role-permissions`
- **11.3.17** User-role -- `(main)/settings/user-roles`
- **11.3.18** API key -- `(main)/settings/api-keys`
- **11.3.19** API key permission -- `(main)/settings/api-key-permissions`
- **11.3.20** User MFA -- `(main)/settings/user-mfas`
- **11.3.21** User session -- `(main)/settings/user-sessions`
- **11.3.22** OAuth account -- `(main)/settings/oauth-accounts`

### Tier 4: Patients (main)
- **11.4.1** Patients (main) -- `(main)/patients`
- **11.4.2** Patient -- `(main)/patients/patients`
- **11.4.3** Patient identifier -- `(main)/patients/patient-identifiers`
- **11.4.4** Patient contact -- `(main)/patients/patient-contacts`
- **11.4.5** Patient guardian -- `(main)/patients/patient-guardians`
- **11.4.6** Patient allergy -- `(main)/patients/patient-allergies`
- **11.4.7** Patient medical history -- `(main)/patients/patient-medical-histories`
- **11.4.8** Patient document -- `(main)/patients/patient-documents`

### Tier 5: Scheduling (main)
- **11.5.1** Scheduling (main) -- `(main)/scheduling`
- **11.5.2** Appointment -- `(main)/scheduling/appointments`
- **11.5.3** Provider schedule -- `(main)/scheduling/provider-schedules`
- **11.5.4** Availability slot -- `(main)/scheduling/availability-slots`
- **11.5.5** Visit queue -- `(main)/scheduling/visit-queues`

### Tier 6: Clinical (main)
- **11.6.1** Clinical (main) -- `(main)/clinical`
- **11.6.2** Encounter -- `(main)/clinical/encounters`
- **11.6.3** Clinical note -- `(main)/clinical/clinical-notes`
- **11.6.4** Diagnosis -- `(main)/clinical/diagnoses`
- **11.6.5** Procedure -- `(main)/clinical/procedures`
- **11.6.6** Vital sign -- `(main)/clinical/vital-signs`
- **11.6.7** Care plan -- `(main)/clinical/care-plans`
- **11.6.8** Referral -- `(main)/clinical/referrals`
- **11.6.9** Follow-up -- `(main)/clinical/follow-ups`

### Tier 7: IPD, ICU, Theatre, Emergency
- **11.7.1** IPD (main) -- `(main)/ipd`
- **11.7.2.1** IPD Admission -- `(main)/ipd/admissions`
- **11.7.2.2** IPD Bed assignment -- `(main)/ipd/bed-assignments`
- **11.7.2.3** IPD Ward round -- `(main)/ipd/ward-rounds`
- **11.7.2.4** IPD Nursing note -- `(main)/ipd/nursing-notes`
- **11.7.2.5** IPD Medication admin -- `(main)/ipd/medication-administrations`
- **11.7.2.6** IPD Discharge -- `(main)/ipd/discharge-summaries`
- **11.7.2.7** IPD Transfer -- `(main)/ipd/transfer-requests`
- **11.7.3** ICU (main) -- `(main)/icu`
- **11.7.4.1** ICU Stay -- `(main)/icu/icu-stays`
- **11.7.4.2** ICU Observation -- `(main)/icu/icu-observations`
- **11.7.4.3** ICU Critical alert -- `(main)/icu/critical-alerts`
- **11.7.5** Theatre (main) -- `(main)/theatre`
- **11.7.6.1** Theatre Case -- `(main)/theatre/theatre-cases`
- **11.7.6.2** Theatre Anesthesia record -- `(main)/theatre/anesthesia-records`
- **11.7.6.3** Theatre Post-op note -- `(main)/theatre/post-op-notes`
- **11.7.7** Emergency (main) -- `(main)/emergency`
- **11.7.8.1** Emergency Case -- `(main)/emergency/emergency-cases`
- **11.7.8.2** Emergency Triage -- `(main)/emergency/triage-assessments`
- **11.7.8.3** Emergency Response -- `(main)/emergency/emergency-responses`
- **11.7.8.4** Emergency Ambulance -- `(main)/emergency/ambulances`
- **11.7.8.5** Emergency Dispatch -- `(main)/emergency/ambulance-dispatches`
- **11.7.8.6** Emergency Trip -- `(main)/emergency/ambulance-trips`

### Tier 8: Diagnostics (Lab + Radiology)
- **11.8.1** Lab (main) -- `(main)/diagnostics/lab`
- **11.8.2.1** Lab Test -- `(main)/diagnostics/lab/lab-tests`
- **11.8.2.2** Lab Panel -- `(main)/diagnostics/lab/lab-panels`
- **11.8.2.3** Lab Order -- `(main)/diagnostics/lab/lab-orders`
- **11.8.2.4** Lab Sample -- `(main)/diagnostics/lab/lab-samples`
- **11.8.2.5** Lab Result -- `(main)/diagnostics/lab/lab-results`
- **11.8.2.6** Lab QC Log -- `(main)/diagnostics/lab/lab-qc-logs`
- **11.8.3** Radiology (main) -- `(main)/diagnostics/radiology`
- **11.8.4.1** Radiology Test -- `(main)/diagnostics/radiology/radiology-tests`
- **11.8.4.2** Radiology Order -- `(main)/diagnostics/radiology/radiology-orders`
- **11.8.4.3** Radiology Result -- `(main)/diagnostics/radiology/radiology-results`
- **11.8.4.4** Imaging Study -- `(main)/diagnostics/radiology/imaging-studies`
- **11.8.4.5** PACS Link -- `(main)/diagnostics/radiology/pacs-links`

### Tier 9: Pharmacy, Inventory
- **11.9.1** Pharmacy (main) -- `(main)/pharmacy`
- **11.9.2** Pharmacy tabs: drug, batch, formulary, order, dispense, adverse-event -- `(main)/pharmacy/*` (one step per tab)
- **11.9.3** Inventory (main) -- `(main)/inventory`
- **11.9.4** Inventory tabs: item, stock, movement, supplier, purchase, receipt, adjustment -- `(main)/inventory/*` (one step per tab)

### Tier 10: Billing, HR, Housekeeping, Reports, Comms, Subscriptions, Integrations, Compliance
- **11.10.1** Billing (main) -- `(main)/billing`
- **11.10.2** Billing tabs: invoice, payment, refund, pricing, coverage, claim, pre-auth, adjustment -- `(main)/billing/*` (one step per tab)
- **11.10.3** HR (main) -- `(main)/hr`
- **11.10.4** HR tabs: staff, assignment, leave, shift, nurse-timetable, payroll -- `(main)/hr/*` (one step per tab; nurse-timetable = Nurses Time-table Generator per write-up Sec 5.17)
- **11.10.5** Housekeeping (main) -- `(main)/housekeeping`
- **11.10.6** Housekeeping tabs: task, schedule, maintenance, asset, service-log -- `(main)/housekeeping/*` (one step per tab)
- **11.10.7** Reports (main) -- `(main)/reports`
- **11.10.8** Communications (main) -- `(main)/communications`
- **11.10.9** Subscriptions (main) -- `(main)/subscriptions`
- **11.10.10** Integrations (main) -- `(main)/integrations`
- **11.10.11** Compliance (main) -- `(main)/compliance`

### Tier 11: Patient portal
- **11.11.1** Patient portal (main) -- `(patient)/portal`
- **11.11.2** Patient appointments -- `(patient)/appointments`
- **11.11.3** Patient results -- `(patient)/results`
- **11.11.4** Patient prescriptions -- `(patient)/prescriptions`
- **11.11.5** Patient billing -- `(patient)/billing`

---

## Per-step checklist
Per screen: routes per `app-router.mdc`; screen per `platform-ui.mdc` + `component-structure.mdc`; wire to hooks; i18n; loading/error/empty/guarded states; nav entry for main screens. Tests per `testing.mdc`; a11y per `accessibility.mdc`.

## Completeness
- [ ] 11.1.1-11.1.14 (public entry + onboarding; done: 11.1.1, 11.1.2; pending: 11.1.3-11.1.14)
- [ ] 11.2.1-11.2.8 (auth, home; done: 11.2.1, 11.2.4, 11.2.8; pending: 11.2.2, 11.2.3, 11.2.5, 11.2.6, 11.2.7)
- [x] 11.3.1-11.3.22 (Settings main + tabs)
- [ ] 11.4.1-11.6.9 (Patients, Scheduling, Clinical)
- [ ] 11.7.1-11.7.8.6, 11.8.1-11.9.4 (IPD, ICU, Theatre, Emergency, Lab, Radiology, Pharmacy, Inventory)
- [ ] 11.10.1-11.11.5 (Billing, HR, Housekeeping, Reports, Comms, Subscriptions, Integrations, Compliance, Patient portal)
- [ ] Nav + deep links for all main screens

## Settings status (11.3.1-11.3.22)
- **11.3.1-11.3.17** settings through user-role -- List OK, Detail OK, Create/Edit OK
- **11.3.18** api-key -- List OK, Detail OK, Create/Edit N/A (current read-only flow)
- **11.3.19-11.3.20** api-key-permission, user-mfa -- List OK, Detail OK, Create/Edit OK
- **11.3.21** user-session -- List OK, Detail OK, Create/Edit N/A (current read-only flow)
- **11.3.22** oauth-account -- List OK, Detail OK, Create/Edit OK

Backend: facility/tenant usecases unwrap `response.data.data`; other CRUD same pattern when backend returns `{ data }`.
