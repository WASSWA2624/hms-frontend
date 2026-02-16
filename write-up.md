# HMS Implementation Master Write-Up

Version: 2.1  
Date: 2026-02-16  
Status: Active implementation baseline  
Primary repos: `hms-frontend`, `hms-backend`

---

## 0. Purpose and Governance

### 0.1 Purpose

This document is the implementation master blueprint for building and improving the HMS application in this codebase. It defines what "complete" means for product, engineering, operations, security, commercialization, and growth.

This is not only a product brief. It is an execution contract.

### 0.2 What this document controls

- Full functional scope across clinical, operational, financial, compliance, and growth areas
- Implementation standards that must map to the current repository structure
- Release readiness and completion criteria
- Priority and sequencing guidance for ongoing delivery

### 0.3 Intended users

- Product owners and founders
- Frontend and backend engineers
- QA and security reviewers
- Implementation consultants and project managers
- Operations and hospital deployment teams

### 0.4 Source-of-truth hierarchy

When conflicts happen, use this order:

1. `.cursor/rules/index.mdc` and linked rule files
2. `hms-frontend/dev-plan/*.md`
3. `hms-backend/dev-plan/*.mdc`
4. This `write-up.md`
5. Ad hoc notes in tickets/chats

### 0.5 Change management

Any major change to this document should include:

- Date and summary
- Affected modules
- Impact on roadmap/release plan
- Migration notes (if workflows are changed)

---

## 1. Product Definition

### 1.1 Vision

Deliver a complete, modern, user-friendly, modular, and self-marketable Hospital Management System that can run facilities from a small clinic to a complex multi-branch hospital network.

### 1.2 Product outcomes

The HMS must:

- Run end-to-end care and operations without spreadsheet dependence
- Improve speed, quality, and consistency of clinical and administrative work
- Support multiple commercial/payment models for real market conditions
- Include complete biomedical engineering capabilities for equipment lifecycle, maintenance, and safety
- Be simple for first-time digital users and powerful for expert operators
- Scale without a rewrite from first clinic launch to enterprise network

### 1.3 What "complete" means in this project

The app is complete only when all are true:

1. 160 backend modules are functionally usable from frontend workflows.
2. Core and advanced workflows pass quality, security, and performance gates.
3. Flexible payment and licensing models are operational.
4. Modular activation works without code changes per tenant.
5. Self-marketing loops are active and measurable.
6. UX is accessible, multilingual, and usable on web + mobile.
7. Deployment and operations are production-ready.

---

## 2. Current Codebase Baseline (As-Is)

### 2.1 Frontend stack snapshot

- React Native + Expo + Expo Router
- Web, Android, iOS targets from one codebase
- Redux Toolkit + persisted state
- Styled components
- Zod validation
- Jest + testing-library

### 2.2 Backend stack snapshot

- Node.js + Express 5
- Prisma + MariaDB/MySQL
- WebSocket support (`ws`)
- Zod validation
- JWT/session/auth infrastructure

### 2.3 Inventory parity snapshot

Observed in current repository:

- Backend module directories: **160**
- Frontend feature directories: **159**
- Feature-module count parity: **not yet matched** (missing frontend `staff-position`)
- Frontend route files under `src/app`: **728**
- Route placeholder catch-all files (`[...missing].jsx`): **22**

### 2.4 Important implications

- Domain scaffolding is strong and broad.
- The key risk is no longer domain absence; it is consistency, route completion, UX quality, and production hardening.
- This write-up therefore focuses on depth, quality gates, and end-to-end completeness.

---

## 3. Product Principles (Mandatory)

1. Complete by default, modular by choice.
2. Patient-first and staff-first UX.
3. Safety, privacy, and auditability are non-negotiable.
4. Configurable workflows over hardcoded behavior.
5. Fast common tasks, low cognitive load.
6. API-first interoperability.
7. Commercial and payment flexibility.
8. Built-in growth and self-marketing.
9. Offline-tolerant for critical operations.
10. Evidence-driven improvement using analytics.
11. Maximum flexibility and adaptability by design, not by ad hoc customization.

---

## 4. Facility Coverage Model

### 4.1 Starter facility (small clinic)

Must run:

- Registration and appointments
- Consultation and e-prescription
- Basic diagnostics ordering
- Pharmacy dispensing
- Billing and common payment channels
- Patient portal basics
- Basic equipment issue reporting by staff and nurses

### 4.2 Growth facility (medium hospital)

Adds:

- IPD, bed management, nursing documentation
- Lab + radiology workflows
- Insurance claims and pre-authorization
- HR shifts and payroll
- Procurement and inventory controls
- Biomedical equipment inventory, maintenance, and repair workflows

### 4.3 Enterprise facility (complex/chain)

Adds:

- ICU, theatre, emergency orchestration
- Multi-branch and multi-region governance
- Advanced analytics and command center
- Integration hub, external systems, and API governance
- Strong audit/compliance and security operations
- Biomedical engineering command center, lifecycle planning, and multi-site equipment governance

---

## 5. Architecture Blueprint

### 5.1 Logical architecture

- Presentation: Expo Router apps and platform UI layers
- Domain features: `src/features/<module>`
- Hooks and screen wiring: `src/hooks`, `src/platform/screens`, `src/app`
- Service integration: API clients and adapters
- Backend modular services: `hms-backend/src/modules`
- Data layer: Prisma models + relational DB + logs/audit records

### 5.2 Frontend architecture contract

Per module, keep:

- Rules: invariants and validation logic
- Model: entity schema normalization
- API: endpoint integration
- Usecase: business orchestration
- Optional events: domain events mapping
- Hook for UI consumption (when needed)

### 5.3 Backend architecture contract

Per module, enforce:

- Input validation
- AuthZ and tenancy constraints
- Transaction-safe data operations
- Audit logging for sensitive changes
- Consistent API response and error shape

### 5.4 Multi-tenancy model

- Tenant data isolation must be guaranteed
- Facility and branch scoping must be explicit in every read/write
- User access must be intersection of role + tenant/facility/branch scope

### 5.5 Eventing and notifications

- Domain events should be published for key lifecycle changes
- Notifications are channel-agnostic (SMS/email/push/chat)
- Delivery tracking and retry status must be visible

### 5.6 Offline and sync

Critical workflows require graceful offline behavior:

- Queue and registration basics
- Vitals capture
- Clinical note draft save
- Medication administration draft

Must support conflict detection and user-resolvable sync recovery.

### 5.7 Flexibility and adaptability architecture controls

The platform must maximize adaptability through configuration-first mechanisms:

- Policy engine: tenant-level clinical, billing, and approval policies configurable without code changes
- Workflow engine: configurable state transitions and approval chains per module
- Dynamic forms: facility-specific fields, validation rules, and requiredness by workflow step
- Rule engine: configurable pricing, triage, scheduling, and escalation rules
- Feature flags: controlled rollout by tenant, branch, role, and environment
- Plugin/extension points: stable interfaces for integrations and optional module packs
- Localization packs: country and regulator-specific presets for documents, taxes, and compliance
- Versioned configuration: change history, rollback, and scheduled configuration releases
- Backward compatibility: configuration/schema changes must not break active tenants
- Override governance: local overrides allowed with scope, owner, expiry, and audit trail

---

## 6. Complete Functional Scope (Module Groups 1-20)

This section is the mandatory feature catalog. It aligns with:

- `hms-frontend/dev-plan/P010_core-features.md`
- `hms-backend/dev-plan/P011_modules.mdc`
- `hms-backend/src/app/router.js` (mounted route source of truth)
- `6.15A` defines Biomedical Engineering expansion modules within the current 160-module backend surface.

### 6.1 Group 1: Auth, Sessions, Tenancy, Core Access

Modules:

- `auth`, `user-session`, `tenant`, `facility`, `branch`, `department`, `unit`, `room`, `ward`, `bed`, `address`, `contact`, `user`, `user-profile`, `role`, `permission`, `role-permission`, `user-role`, `api-key`, `api-key-permission`, `user-mfa`, `oauth-account`

Must deliver:

- Secure login and session lifecycle
- MFA and OAuth account linkage
- Tenant/facility selection and switching
- Fine-grained RBAC with least privilege
- API key governance for integrations

Acceptance essentials:

- Unauthorized access blocked at route + API level
- Tenant boundary leaks impossible
- All role assignment changes are auditable

### 6.2 Group 2: Patient Registry and Consent

Modules:

- `patient`, `patient-identifier`, `patient-contact`, `patient-guardian`, `patient-allergy`, `patient-medical-history`, `patient-document`, `consent`, `terms-acceptance`

Must deliver:

- Longitudinal patient profile
- Duplicate detection and merge flow policy
- Consent capture and status visibility
- Documents lifecycle with secure access

Acceptance essentials:

- Every encounter links to a valid patient identity
- Consent checks enforce restricted actions
- PHI access trails are complete

### 6.3 Group 3: Scheduling, Availability, Queue

Modules:

- `appointment`, `appointment-participant`, `appointment-reminder`, `provider-schedule`, `availability-slot`, `visit-queue`

Must deliver:

- Book/reschedule/cancel flows
- Provider schedule and slot management
- Queue operations with priority handling
- Automated reminder dispatch

Acceptance essentials:

- No overbooking without explicit override
- Queue state transitions validated
- Reminder failures visible and retryable

### 6.4 Group 4: Encounters and Clinical Documentation

Modules:

- `encounter`, `clinical-note`, `diagnosis`, `procedure`, `vital-sign`, `care-plan`, `clinical-alert`, `referral`, `follow-up`

Must deliver:

- Full encounter lifecycle
- Structured and narrative documentation
- Care plan and follow-up tracking
- Alert-driven safety prompts

Acceptance essentials:

- Clinical notes are versioned and attributable
- Sensitive clinical edits are auditable
- Follow-up scheduling links to plan and provider
### 6.5 Group 5: Inpatient and Bed Management

Modules:

- `admission`, `bed-assignment`, `ward-round`, `nursing-note`, `medication-administration`, `discharge-summary`, `transfer-request`

Must deliver:

- Admission to discharge orchestration
- Bed allocation and transfer control
- Daily rounds and nursing documentation
- MAR safety and reconciliation

Acceptance essentials:

- Bed occupancy remains consistent under concurrency
- Transfer approvals enforce role rules
- Discharge summary cannot finalize with critical missing fields

### 6.6 Group 6: ICU and Critical Care

Modules:

- `icu-stay`, `icu-observation`, `critical-alert`

Must deliver:

- ICU stay records
- Observation trend capture
- Critical threshold alerts and escalation

Acceptance essentials:

- Alert acknowledgment chain is tracked
- ICU observation updates are time-ordered and immutable where required

### 6.7 Group 7: Theatre and Anesthesia

Modules:

- `theatre-case`, `anesthesia-record`, `post-op-note`

Must deliver:

- Case scheduling and status transitions
- Anesthesia event documentation
- Post-op outcomes and complications

Acceptance essentials:

- Case status transitions enforce allowed sequence
- Procedure-linked documentation is complete before closure

### 6.8 Group 8: Laboratory (LIS)

Modules:

- `lab-test`, `lab-panel`, `lab-order`, `lab-order-item`, `lab-sample`, `lab-result`, `lab-qc-log`

Must deliver:

- Order-to-result lifecycle
- Sample tracking and chain-of-custody states
- QC logs and abnormal result alerts

Acceptance essentials:

- Result release requires validation roles
- Critical result escalation is logged

### 6.9 Group 9: Radiology (RIS/PACS)

Modules:

- `radiology-test`, `radiology-order`, `radiology-result`, `imaging-study`, `imaging-asset`, `pacs-link`

Must deliver:

- Radiology order and reporting lifecycle
- Imaging study records with asset linking
- PACS launch and association

Acceptance essentials:

- Image/result linkage cannot break patient context
- Final report sign-off is role-restricted

### 6.10 Group 10: Pharmacy

Modules:

- `drug`, `drug-batch`, `formulary-item`, `pharmacy-order`, `pharmacy-order-item`, `dispense-log`, `adverse-event`

Must deliver:

- Formulary and stock-aware dispensing
- Batch/expiry visibility
- Dispense traceability
- Adverse event reporting

Acceptance essentials:

- Dispense cannot exceed available stock
- Allergy/interaction checks surface before dispense

### 6.11 Group 11: Inventory and Procurement

Modules:

- `inventory-item`, `inventory-stock`, `stock-movement`, `supplier`, `purchase-request`, `purchase-order`, `goods-receipt`, `stock-adjustment`

Must deliver:

- End-to-end procurement
- Stock accuracy and valuation support
- Movement and adjustment governance

Acceptance essentials:

- All adjustments require reason and audit trail
- GRN and PO matching rules enforced

### 6.12 Group 12: Emergency and Ambulance

Modules:

- `emergency-case`, `triage-assessment`, `emergency-response`, `ambulance`, `ambulance-dispatch`, `ambulance-trip`

Must deliver:

- Rapid emergency registration
- Triage prioritization
- Dispatch lifecycle and trip tracking

Acceptance essentials:

- Triage priority impacts queue/order handling
- Dispatch timestamps and status transitions are reliable

### 6.13 Group 13: Billing, Payments, Insurance

Modules:

- `invoice`, `invoice-item`, `payment`, `refund`, `pricing-rule`, `coverage-plan`, `insurance-claim`, `pre-authorization`, `billing-adjustment`

Must deliver:

- Itemized billing and package support
- Multi-method payment collection
- Refund and adjustment controls
- Insurance claim lifecycle

Acceptance essentials:

- Invoice totals reconcile with line items and tax rules
- Refund approval and posting are auditable
- Claim status transitions are traceable

### 6.14 Group 14: HR, Payroll, Staffing

Modules:

- `staff-position`, `staff-profile`, `staff-assignment`, `staff-leave`, `shift`, `shift-assignment`, `shift-swap-request`, `payroll-run`, `payroll-item`, `nurse-roster`, `shift-template`, `roster-day-off`, `staff-availability`

Must deliver:

- Staff position catalog and assignment alignment for staffing workflows
- Staff records and assignment management
- Shift lifecycle and swap governance
- Payroll run integrity
- Automated nurse roster generation with constraints

Acceptance essentials:

- Roster engine respects max shifts, rest, skill match, and leave
- Manual overrides are logged with reason

### 6.15 Group 15: Housekeeping, Facilities, and Biomedical Foundation

Modules:

- `housekeeping-task`, `housekeeping-schedule`, `maintenance-request`, `asset`, `asset-service-log`

Must deliver:

- Cleaning and sanitation workflows
- Maintenance tickets and SLA tracking
- Asset service history
- Medical equipment issue ticketing and engineering escalation

Acceptance essentials:

- Task completion evidence can be audited
- Critical maintenance delays are escalated
- Equipment downtime and status are visible to care teams

### 6.15A Biomedical Engineering and Medical Equipment Suite (Comprehensive)

This suite is mandatory for complete hospital operations and is delivered as a subscription-gated module set.

Current codebase foundation modules reused by this suite:

- `maintenance-request`
- `asset`
- `asset-service-log`
- `inventory-item`
- `inventory-stock`
- `stock-movement`
- `supplier`
- `purchase-order`
- `goods-receipt`

Biomedical modules to implement and productize as a dedicated bundle:

- `equipment-registry`
- `equipment-category`
- `equipment-location-history`
- `equipment-maintenance-plan`
- `equipment-work-order`
- `equipment-calibration-log`
- `equipment-safety-test-log`
- `equipment-downtime-log`
- `equipment-spare-part`
- `equipment-warranty-contract`
- `equipment-service-provider`
- `equipment-incident-report`
- `equipment-recall-notice`
- `equipment-utilization-snapshot`
- `equipment-disposal-transfer`

Biomedical suite capability requirements:

- Central medical equipment registry with QR/barcode tagging and searchable asset records
- Preventive maintenance scheduling by manufacturer interval, risk class, and usage hours
- Corrective maintenance work orders with SLA clocks, assignment, and escalation
- Calibration and safety testing with certificate/document attachment and expiry alerts
- Spare parts tracking, minimum stock alerts, and procurement integration
- Warranty and vendor contract management with cost, coverage, and renewal reminders
- Equipment lifecycle tracking from commissioning to retirement/disposal
- Device downtime, MTTR, MTBF, and uptime analytics per facility/department/device class
- Biomedical workbench dashboards for open jobs, overdue PM, critical equipment at risk, and engineer workload
- Mobile-first field workflows for onsite engineers, including offline updates and photo evidence
- Cross-functional issue reporting by nurses, clinicians, and operations users with triage and priority routing
- Incident and hazard workflows linked to compliance and patient safety reporting
- Full audit trail for maintenance actions, part replacements, approvals, and status changes

Biomedical suite acceptance essentials:

- Nurses and authorized users can report equipment faults in under 60 seconds
- Critical equipment faults trigger immediate escalation and visible clinical alerts
- PM compliance rate, overdue backlog, and downtime metrics are available in real time
- Equipment cannot be marked serviceable without required test/calibration evidence
- All biomedical actions are tenant-scoped, role-controlled, and audit-logged

### 6.16 Group 16: Notifications and Communications

Modules:

- `notification`, `notification-delivery`, `conversation`, `message`, `template`, `template-variable`

Must deliver:

- Multi-channel notification engine
- Internal secure communications
- Template-driven content

Acceptance essentials:

- Delivery state machine is transparent
- Sensitive conversations enforce role visibility rules

### 6.17 Group 17: Reporting and Analytics

Modules:

- `report-definition`, `report-run`, `dashboard-widget`, `kpi-snapshot`, `analytics-event`

Must deliver:

- Custom report definitions
- Scheduled/on-demand report runs
- Dashboard composition and KPI snapshots

Acceptance essentials:

- Data lineage is visible for critical KPIs
- Report permissions enforce role and scope

### 6.18 Group 18: Subscription, Licensing, Modules

Modules:

- `subscription-plan`, `subscription`, `subscription-invoice`, `module`, `module-subscription`, `license`

Must deliver:

- Module marketplace and activation
- Trial, upgrade, downgrade, and renewal flows
- Licensing and entitlement visibility

Acceptance essentials:

- Disabled modules are technically inaccessible
- Proration logic is test-covered

### 6.19 Group 19: Compliance, Audit, Security Logs

Modules:

- `audit-log`, `phi-access-log`, `data-processing-log`, `breach-notification`, `system-change-log`

Must deliver:

- Full traceability for sensitive actions
- PHI access transparency
- Breach process support
- Change tracking

Acceptance essentials:

- Tamper-evident log strategy
- Strict read permissions for compliance datasets

### 6.20 Group 20: Integrations and Webhooks

Modules:

- `integration`, `integration-log`, `webhook-subscription`

Must deliver:

- Integration registry and status tracking
- Webhook subscription management
- Integration observability

Acceptance essentials:

- Failed integrations are detectable and actionable
- Replay/retry policy is documented and implemented

---

## 7. End-to-End Workflow Contracts

### 7.1 Self-onboarding and activation

1. Prospect arrives on public landing.
2. Registers facility and owner account.
3. Receives resume link and can continue later.
4. Chooses module package and plan.
5. Selects billing cycle and payment method.
6. Completes payment and obtains activation.
7. Starts guided setup checklist.

Required outcomes:

- Resume flow never loses state.
- Trial and paid entitlements enforce module access.
- Conversion metrics are tracked for every onboarding step.

### 7.2 OPD journey

1. Register or locate patient.
2. Book appointment or add to queue.
3. Conduct encounter and clinical documentation.
4. Order tests or prescribe medication.
5. Generate invoice and collect payment.
6. Schedule follow-up and reminders.

Required outcomes:

- Single patient context through entire journey.
- Charges auto-captured from performed services.
- Follow-up plan is visible to patient and care team.

### 7.3 IPD journey

1. Admit patient from OPD/emergency.
2. Assign bed and care team.
3. Capture rounds, nursing notes, and MAR.
4. Process transfers and escalation events.
5. Prepare discharge summary and instructions.
6. Close financials and claim documentation.

Required outcomes:

- No orphan admissions.
- Bed occupancy and transfer records are consistent.
- Discharge packet includes care continuation data.

### 7.4 Emergency and ambulance journey

1. Create emergency case.
2. Perform triage and assign severity.
3. Dispatch ambulance and crew if needed.
4. Track trip and arrival.
5. Continue into OPD/IPD/ICU flow.

Required outcomes:

- Triage priority impacts response urgency.
- Dispatch and trip logs are complete.

### 7.5 Theatre journey

1. Create and schedule theatre case.
2. Capture anesthesia records.
3. Record post-op note and outcomes.

Required outcomes:

- Procedure lifecycle status is traceable.
- Required safety documentation is non-bypassable.

### 7.6 Diagnostics journey

1. Place lab/radiology order.
2. Process sample/study workflow.
3. Produce validated result/report.
4. Notify clinician and patient channels per policy.

Required outcomes:

- Critical results trigger escalation.
- Result release permissions are strictly controlled.

### 7.7 Pharmacy journey

1. Receive medication order.
2. Validate drug/formulary/allergy constraints.
3. Dispense against stock and batch.
4. Log dispense event and update inventory.

Required outcomes:

- Dispense traceability by user, time, batch.
- Out-of-stock prevention or controlled override.

### 7.8 Billing and claims journey

1. Aggregate billable events.
2. Generate invoice.
3. Accept one or multiple payment methods.
4. Process insurance pre-auth/claim where applicable.
5. Reconcile payment and claim statuses.

Required outcomes:

- Accurate financial audit trail.
- Claim status is transparent and actionable.

### 7.9 Nurse roster journey

1. Configure roster constraints.
2. Generate roster schedule.
3. Review and publish roster.
4. Process swaps/overrides and notifications.
5. Feed payroll and attendance downstream.

Required outcomes:

- Rule-based fairness and compliance.
- Full audit for manual changes.

### 7.10 Biomedical equipment reporting and maintenance journey

1. Nurse, clinician, or operations user reports equipment issue from unit/ward/theatre screen.
2. System captures device, location, severity, symptoms, and optional photo/video evidence.
3. Biomedical triage assigns priority, response SLA, and responsible engineer/team.
4. Engineer performs assessment, creates corrective work order, and logs parts/tests performed.
5. Device status moves through `reported -> triaged -> in-repair -> testing -> returned-to-service` or `retired`.
6. If needed, procurement flow triggers spare parts/service vendor requests.
7. Completion requires verification and serviceability confirmation with traceable sign-off.
8. Downtime, cost, repeat-failure, and compliance metrics update automatically.

Required outcomes:

- Fault reporting is simple, fast, and available from role-relevant screens
- Critical clinical devices get priority and escalation paths
- Biomedical team has a single queue and clear SLA ownership
- Care teams always see current device status before use
- All maintenance evidence is available for inspections and audits

---

## 8. UX, Accessibility, and User-Friendliness

### 8.1 UX goals

- Fast path for top 20 daily tasks per role
- Clear information hierarchy
- Predictable navigation
- Low-click completion for repetitive workflows

### 8.2 Route and screen contract

Target structure:

- Public + auth + onboarding route groups
- Main role-driven route groups by domain
- Patient portal route group

Screen standard per module:

- List
- Create
- Detail
- Edit

Where applicable:

- Timeline/activity log
- Attachments/documents
- Related records panel

### 8.3 Accessibility requirements

- WCAG 2.1 AA target
- Keyboard and screen reader compatibility
- 44x44 minimum touch target
- Focus order correctness
- Support for scalable text and reduced motion
- High-contrast compatibility

### 8.4 Mobile and low-bandwidth behavior

- Responsive and adaptive layouts
- Lightweight data payload strategies
- Skeleton/loading states for all async views
- Offline indicators and safe retry controls

### 8.5 Internationalization and localization

- No hardcoded user-facing strings
- Complete key parity across supported locales
- Locale persistence and runtime switching
- RTL handling where enabled

### 8.6 Mandatory UI simplicity and modernity charter

- UI must be easy, simple, and modern across all modules and roles
- Every high-frequency action must be accessible within 3 interactions from the role home screen
- Forms must prioritize clarity with progressive disclosure, not long uncontrolled fields
- Critical actions must show clear confirmation, success, and rollback/retry guidance
- Empty states, error states, and loading states must be intentionally designed for non-technical users
- Typography, spacing, and contrast must remain consistent for professional medical environments
- Mobile and tablet workflows must be first-class, not reduced versions of desktop flows
- Biomedical and clinical emergency actions must use high-visibility, low-ambiguity UI patterns
- UI layout and navigation should support tenant-level role-based personalization without breaking usability
--- 

## 9. Flexible Modules Strategy

### 9.1 Module activation model

- Modules are tenant-entitled by subscription/license state.
- UI, API, and permissions must all enforce module activation status.
- Activation/deactivation should not require deployment.

### 9.2 Free core modules for all plans

Every plan includes a free basic foundation so facilities can start using HMS immediately.

Free core module scope:

- Authentication, user sessions, tenant/facility setup, and baseline RBAC
- Core patient registry and identifiers
- Basic appointment booking and queue visibility
- Basic encounter notes and vitals capture
- Basic invoicing and payment receipt workflows
- Basic notifications and communication templates
- Basic reports and operational dashboard snapshots
- Basic equipment issue reporting by nurses/users for biomedical triage

### 9.3 Paid module bundles and add-ons

Clients choose which paid modules to enable based on needs and budget.

Paid bundles/add-ons include:

- Advanced clinical operations (IPD, ICU, theatre, advanced nursing workflows)
- Diagnostics bundles (LIS, RIS, PACS integrations)
- Pharmacy and advanced medication safety
- Inventory and procurement automation
- Billing and insurance advanced workflows
- HR, payroll, staffing optimization, and nurse roster automation
- Compliance and advanced audit suites
- Integration and webhook automation packs
- Biomedical Engineering and Medical Equipment Suite
- Advanced analytics, forecasting, and AI-assisted workflows

### 9.4 Client-controlled subscription governance

- The client decides which modules to pay for and activate
- Module activation must be self-service from subscription settings
- Upgrades/downgrades must support clear pricing and proration
- Module access must be enforced consistently at UI, API, and permission layers
- Free core modules remain available across all active plans

### 9.5 Module packaging examples

- Starter: free core modules + basic billing + basic scheduling + basic clinical
- Clinical Core: starter + IPD + nursing + diagnostics + pharmacy
- Ops Core: starter + inventory + HR + housekeeping + reporting
- Biomed Pro: starter + Biomedical Engineering and Medical Equipment Suite
- Enterprise: all modules + compliance + integration + analytics

### 9.6 Module marketplace behavior

- Discoverable in onboarding and settings
- Trial and plan compatibility checks
- Immediate or scheduled activation
- Prorated billing and invoice generation
- Clear labeling of free modules vs paid modules

### 9.7 Adaptability guardrails for modules

- No tenant-specific forked code for normal customization cases
- Custom requirements should first be implemented as configurable policies, forms, or templates
- Module dependencies must be explicit and machine-checkable
- Cross-module contracts must be versioned to avoid upgrade lock-in
- Every module must support optional enablement without breaking core free modules

---

## 10. Flexible Payment and Commercial Strategy

### 10.1 Patient payment flexibility

Support all feasible methods per region:

- Cash
- Card
- Mobile money
- Bank transfer
- QR payments
- USSD (where available)
- Wallets
- Installments and payment plans
- Insurance and corporate payer flows

### 10.2 HMS licensing flexibility

Commercial models to support:

- Free Core plan baseline with upgrade paths
- Monthly/quarterly/annual subscriptions
- Module-based subscriptions
- User-based tiers
- Usage-based billing
- Branch-based pricing
- Hybrid base + usage model
- Enterprise agreements
- Perpetual license + maintenance contract

### 10.3 Financial control requirements

- Multi-currency handling
- Configurable tax rules by jurisdiction
- Reconciliation by payment channel and cashier
- Dunning and retry for failed recurring payments
- Fraud and anomaly flags for suspicious behavior

---

## 11. Self-Marketable Growth Engine

The product must market itself through built-in growth loops.

### 11.1 Acquisition

- SEO-indexable public pages for services/providers/branches
- Embeddable booking widgets for websites and social platforms
- Campaign landing pages with conversion tracking

### 11.2 Activation

- Guided onboarding checklist
- Value-first module recommendations
- Trial experience with clear upgrade path

### 11.3 Retention

- Follow-up reminders and preventive care campaigns
- Family account support and continuity programs
- Service reminders based on history and risk profiles

### 11.4 Referral and reputation

- Referral code programs
- Loyalty/reward mechanisms
- Automated review and feedback requests
- NPS/CSAT measurement and trend dashboards

### 11.5 Revenue growth

- Upsell prompts for module expansion
- Campaign segmentation and automation
- ROI tracking for outreach channels

---

## 12. Data Model and Interoperability

### 12.1 Core data expectations

Each domain record should carry:

- Stable unique ID
- Tenant/facility/branch scope fields
- Created/updated timestamps
- Actor metadata for sensitive changes
- Soft-delete or archival policy where needed

### 12.2 Interoperability requirements

- Standards-oriented APIs (FHIR/HL7 mapping where possible)
- DICOM/PACS interoperability for imaging
- Webhooks and integration logs for external systems
- Import/export for migration and reporting

### 12.3 External integration targets

- National health systems
- Insurance/payer systems
- Payment gateways
- Messaging providers (SMS/email/chat)
- Devices/wearables and lab/imaging platforms

### 12.4 Data quality controls

- Mandatory field validation per workflow
- Duplicate detection for master records
- Cross-module integrity checks
- Reconciliation reports for critical entities

### 12.5 Adaptable data model strategy

- Support extensible metadata fields on key entities with validation rules
- Use schema versioning and migration safety checks for tenant continuity
- Keep core canonical fields stable while allowing extension blocks per tenant
- Ensure exports/imports include extension fields and mapping definitions

---

## 13. Security, Privacy, and Compliance

### 13.1 Access control

- MFA for privileged access
- RBAC with scoped permissions
- Session timeout and revocation controls
- API key lifecycle controls

### 13.2 Data protection

- Encryption in transit and at rest
- Sensitive data masking where required
- Secure document and attachment access
- Secrets management and rotation policies

### 13.3 Audit and compliance logging

- Medical record access logs
- Financial transaction logs
- Configuration and role change logs
- Breach and incident tracking workflows

### 13.4 Compliance adaptability

Support configuration for:

- HIPAA-like controls
- GDPR-like controls
- Country-specific health data rules
- Retention and legal hold requirements

### 13.5 Security operations

- Anomaly detection signals
- Alerting for risky behavior and failed controls
- Incident response runbooks and ownership

---

## 14. Non-Functional Requirements (NFRs)

### 14.1 Availability and reliability

- Core availability target: >= 99.9%
- Planned maintenance windows communicated and controlled
- Disaster recovery with tested restore procedures

### 14.2 Performance

Targets for primary user interactions:

- Initial screen render: <= 2.5s on standard network
- Common list/detail interactions: <= 1.5s API response median
- Search and filter feedback: <= 1.0s perceived response for typical datasets

### 14.3 Scalability

- Horizontal scaling path for API services
- Queue-based background processing for heavy jobs
- Multi-branch and multi-tenant scale planning

### 14.4 Offline tolerance

- Critical actions queue locally with reliable replay
- Explicit conflict resolution strategy
- User-visible sync status and retry controls

### 14.5 Observability

- Centralized logs
- Metrics and traces on key flows
- Dashboard for error rate, latency, and queue health

---

## 15. Testing and Quality Gates

### 15.1 Test pyramid

- Unit tests for rules, models, and usecases
- Integration tests for API-client contracts and state interactions
- Route/screen tests for critical UX flows
- End-to-end smoke tests for high-impact journeys

### 15.2 Coverage expectations

Maintain strict coverage for domain logic and error paths, consistent with dev-plan standards.

### 15.3 Quality gate checklist (per release)

- All critical tests pass
- No P0/P1 unresolved defects
- Security checks pass
- Accessibility checks pass
- Performance baseline not regressed
- i18n key parity check passes

### 15.4 Clinical and financial safety checks

- Medication and allergy checks validated
- Billing totals reconciliation validated
- Claim status and transitions validated

---

## 16. Implementation Roadmap (Aligned to Existing Dev Plan)

### 16.1 Phase map (frontend)

1. P000 Setup
2. P001 Foundation
3. P002 Infrastructure
4. P003 State and Theme
5. P004 Offline
6. P005 Reusable Hooks
7. P006 Platform UI Foundation
8. P007 App Shell
9. P008 Debug Resources
10. P009 App Layouts
11. P010 Core Features
12. P011 Screens and Routes
13. P012 Advanced Features
14. P013 Finalization
15. P014 Locales

### 16.2 Current directional status

- Feature-level module inventory is one module behind backend (`staff-position` pending in frontend feature scope).
- Route and screen wiring is substantial, but completion and consistency checks remain.
- Final hardening (accessibility, performance, parity audits, full localization) must be treated as blocking work, not optional work.

### 16.3 Next execution priorities

Priority A:

- Eliminate all placeholder catch-all route gaps.
- Complete missing screen-route coverage and route-level RBAC checks.
- Finish onboarding conversion path and module subscription flow hardening.
- Deliver biomedical fault reporting entry points in nurse/clinical/ops screens.
- Implement configuration-first adaptability foundation (policy engine + workflow configuration + dynamic forms).

Priority B:

- End-to-end clinical and billing regression packs.
- Security and compliance route audit.
- Offline resilience and sync conflict validation.
- Implement Biomedical Engineering Suite core flows: registry, PM plans, work orders, calibration, and downtime metrics.

Priority C:

- Advanced telemedicine/AI/predictive slices.
- Growth automation and analytics maturity.
- Deep localization and region-specific payment provider packs.
---

## 17. Completion Matrix and Gap Tracking

### 17.1 Known placeholder route files to retire

Current placeholder files detected:

- `src/app/(main)/[...missing].jsx`
- `src/app/(main)/billing/[...missing].jsx`
- `src/app/(main)/clinical/[...missing].jsx`
- `src/app/(main)/communications/[...missing].jsx`
- `src/app/(main)/compliance/[...missing].jsx`
- `src/app/(main)/diagnostics/[...missing].jsx`
- `src/app/(main)/diagnostics/lab/[...missing].jsx`
- `src/app/(main)/diagnostics/radiology/[...missing].jsx`
- `src/app/(main)/emergency/[...missing].jsx`
- `src/app/(main)/housekeeping/[...missing].jsx`
- `src/app/(main)/housekeeping/biomedical/[...missing].jsx`
- `src/app/(main)/hr/[...missing].jsx`
- `src/app/(main)/icu/[...missing].jsx`
- `src/app/(main)/integrations/[...missing].jsx`
- `src/app/(main)/inventory/[...missing].jsx`
- `src/app/(main)/ipd/[...missing].jsx`
- `src/app/(main)/patients/[...missing].jsx`
- `src/app/(main)/pharmacy/[...missing].jsx`
- `src/app/(main)/reports/[...missing].jsx`
- `src/app/(main)/scheduling/[...missing].jsx`
- `src/app/(main)/subscriptions/[...missing].jsx`
- `src/app/(main)/theatre/[...missing].jsx`

### 17.2 Route-coverage verification status

The previous verification queue is mostly resolved at filename level, including pluralized route conventions (for example, `diagnosis` -> `diagnoses`, `notification-delivery` -> `notification-deliveries`).

Current verification queue:

- `staff-position` feature module and route/screen wiring (`/api/v1/staff-positions`, `(main)/hr/staff-positions`)

Execution checklist references:

- `hms-frontend/dev-plan/P010_core-features.md` -> `Step 10.14.1 Execution Checklist (staff-position)`
- `hms-frontend/dev-plan/P011_screens-routes.md` -> `Step 11.10.12 Execution Checklist ((main)/hr/staff-positions)`

Action rule:

- Keep this section updated when new modules are introduced or route naming conventions change.

### 17.3 Biomedical expansion module tracking queue

These modules are part of the Biomedical Engineering expansion suite and are expected to be implemented as subscription-gated additions:

- `equipment-registry`
- `equipment-category`
- `equipment-location-history`
- `equipment-maintenance-plan`
- `equipment-work-order`
- `equipment-calibration-log`
- `equipment-safety-test-log`
- `equipment-downtime-log`
- `equipment-spare-part`
- `equipment-warranty-contract`
- `equipment-service-provider`
- `equipment-incident-report`
- `equipment-recall-notice`
- `equipment-utilization-snapshot`
- `equipment-disposal-transfer`

---

## 18. Definition of Done (Module and Release)

### 18.1 Module-level DoD

A module is done when all are true:

1. Feature contract files are complete and consistent.
2. Route/screen usage is available where required by user workflows.
3. Role permissions are enforced in UI and API.
4. Validation and error handling are deterministic.
5. Audit trail is implemented for sensitive actions.
6. Tests cover success, failure, and edge paths.
7. i18n keys exist for all user-facing copy.
8. Tenant-required variations are delivered through configuration/policies, not hardcoded forks.

### 18.2 Release-level DoD

A release is done when all are true:

1. Critical workflows pass end-to-end regression.
2. Security, accessibility, and performance gates pass.
3. No unresolved P0/P1 defects.
4. Deployment and rollback plans are validated.
5. Monitoring and alerting are in place.
6. Documentation and support handoff are complete.

### 18.3 Product-level DoD

The HMS is complete when all are true:

1. Functional coverage is complete across module groups 1-20.
2. Flexible payment and module strategies are operational.
3. Self-marketing engine is measurable and active.
4. The platform is usable and safe across facility sizes and roles.
5. Compliance posture is acceptable for target jurisdictions.
6. Biomedical Engineering suite baseline capabilities are implemented or formally phased with approved delivery dates.
7. Adaptability controls are operational (policy engine, workflow configuration, and versioned tenant settings).

---

## 19. Operational Readiness

### 19.1 Deployment readiness

- Environment config management for dev/staging/prod
- Migration strategy and rollback plan
- Secrets and credential management
- Post-deploy smoke checks

### 19.2 Support readiness

- Incident triage runbook
- On-call ownership and escalation matrix
- Operational dashboards and alerts
- Known issue playbooks

### 19.3 Implementation readiness for clients

- Tenant onboarding playbook
- Facility setup checklist
- Role mapping and permission template
- Data import template and validation process
- Training plan for clinical/admin/billing users

### 19.4 Adaptability operations readiness

- Configuration lifecycle playbook (draft, review, approve, publish, rollback)
- Tenant-specific configuration regression checklist
- Compatibility matrix for module dependencies and extension packs
- Governance process for converting one-off custom requests into reusable configuration options

---

## 20. KPI Framework for Continuous Improvement

### 20.1 Clinical and operational KPIs

- Registration-to-consultation wait time
- Lab and radiology turnaround times
- Bed occupancy and turnover metrics
- Emergency response time

### 20.2 Financial KPIs

- Collection rate
- Claim approval/rejection rate
- Outstanding receivables aging
- Revenue leakage incidents

### 20.3 Product and UX KPIs

- Task completion time per role
- Screen error frequency
- Feature adoption by module
- User satisfaction/NPS

### 20.4 Growth KPIs

- Online booking conversion rate
- Referral participation rate
- Campaign ROI
- Expansion revenue from module upsells

### 20.5 Flexibility and adaptability KPIs

- Time to configure a new facility workflow without code changes
- Percentage of client change requests solved by configuration vs custom code
- Tenant upgrade success rate without breaking local configuration
- Mean rollback time for misconfigured policies/workflows
- Module activation-to-go-live time per tenant

---

## 21. High-Priority Improvement Backlog Themes

1. Route completion and placeholder elimination.
2. End-to-end workflow consistency across clinical + billing boundaries.
3. Commercial flow polish (trial -> plan -> payment -> activation).
4. Nurse roster and staffing optimization maturity.
5. Biomedical Engineering Suite implementation and equipment safety governance.
6. Compliance and audit visibility UX improvements.
7. Patient portal usability and engagement features.
8. Reporting and executive dashboard standardization.
9. Advanced capabilities behind safe feature flags.
10. Configuration-first adaptability program (policy engine, workflow builder, form builder, versioned tenant configs).

---

## 22. Final Positioning

This HMS is intended to be:

- Complete enough to run a real facility with confidence
- Modern enough to be competitive and future-ready
- Easy, simple, and modern in UI for rapid adoption by diverse users
- Flexible enough for many payment and deployment realities
- Adaptable enough to fit different facility workflows through configuration-first controls
- Comprehensive enough to support biomedical engineering, equipment safety, and maintenance excellence
- Marketable enough to grow through product-led mechanisms
- Robust enough for both small clinics and complex hospital networks

This document is the build contract to achieve that state.
