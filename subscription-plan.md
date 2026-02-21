# HOSSPI HMS Subscription Plans

Version: 2.0
Date: 2026-02-21
Status: Active pricing baseline

## Overview
This pricing model keeps entry affordable for small clinics while scaling for hospitals, enterprise groups, and government deployments.

## Plan Selection Rule (Advanced vs Custom)
Use this decision rule first:
- Choose `Advanced` when you need on-premise deployment with standard product behavior and no custom engineering.
- Choose `Custom` when you need contract-specific engineering, multi-region architecture, advanced compliance mapping, or enterprise/government procurement terms.

## 1. Free - Starter Tier
**Price:** $0

**Best for:** Very small clinics evaluating the system

**Limits**
- Users: 1
- Facilities: 1
- New patients: 5 per day
- Attachments storage: 200MB

**Permissions**
- Patient edits allowed:
  - Full edit within 24h of creation
  - After 24h: contact/address fields only
- Printing: No
- Data export: No
- Branding: No (HOSSPI watermark visible)

**Included Modules**
- Auth and RBAC basics
- Patient registry
- Basic scheduling and queue
- Basic encounters and vitals
- Basic invoicing and receipts
- Basic dashboards (view only)
- Notification templates
- Equipment fault reporting

**Support**
- Email or community (best effort)

---

## 2. Basic - Small Clinic
**Price**
- $39/month
- $390/year (2 months free)

**Includes**
- Up to 5 users
- Extra user: $6/month or $60/year

**Capabilities**
- 1 facility (optionally up to 2 branches)
- Unlimited patients
- Printing enabled
- CSV/Excel exports
- Logo and receipt branding

**Modules**
- Patient registry and consent
- Scheduling and queue
- Encounters and prescriptions
- Billing and payments
- Basic reports
- Notifications
- Optional Inventory and Procurement Lite add-on

**Support**
- Email support (48-72h response)

---

## 3. Pro - Growing Hospital
**Price**
- $89/month
- $890/year

**Includes**
- Up to 10 users
- Extra user: $8/month or $80/year

**Facilities**
- Up to 3 facilities
- Extra facility: $15/month or $150/year

**Capabilities**
- Unlimited patients
- Full printing and exports
- Scheduled reports
- Advanced dashboards

**Modules**
- All Basic features, plus:
- IPD and bed management
- Nursing workflows and MAR
- Lab and radiology workflows
- Pharmacy dispensing and batch tracking
- Inventory and procurement
- Insurance workflows
- HR basics and rosters

**Support**
- Priority support (24-48h)
- 1 onboarding session

---

## 4. Advanced - On-Prem Standard
**Pricing**
- Setup: $2,500-$7,500 (one-time)
- Annual maintenance: $600-$1,500 (recurring)

**Best for**
- Hospitals requiring local hosting with standard workflows
- Facilities with strict data-locality policies but no custom engineering requirement

**Commercial Model**
- Standardized implementation package (fixed scope)
- Fast deployment using existing HMS capabilities and documented connectors

**Hosting Model**
- Single customer environment
- On-premise deployment only (customer-managed infrastructure)

**Includes**
- Local server installation
- Data migration assistance
- Admin training
- Backup guidance
- Offline optimization
- Optional SLA tiers

**Not Included by Default**
- Net-new custom product features
- Deep custom integrations outside standard connector patterns
- Multi-region active-active architecture
- Dedicated account management team

---

## 5. Custom - Enterprise and Government
**Pricing**
- Setup: $10,000+
- Annual support: 15-25% of setup

**Best for**
- Enterprise health groups and government programs
- Organizations with formal procurement, legal, and compliance controls

**Commercial Model**
- Statement of Work (SOW) with milestone-based delivery
- Contractual SLAs and governance commitments

**Hosting Model**
- Cloud, on-premise, or hybrid
- Multi-region support and enterprise disaster-recovery patterns

**Includes**
- Custom integrations and interface development
- Custom workflow/feature engineering
- Multi-region deployment and data governance controls
- Advanced compliance configuration and evidence mapping
- Dedicated support channel and named account ownership
- Custom SLA and enterprise governance tooling
- Data warehouse and advanced analytics integration

---

## Hard Boundary: Advanced vs Custom
`Advanced` is for standard product delivery on customer infrastructure.
`Custom` is required when any of the following is true:
- You need custom feature development or major workflow redesign.
- You need complex multi-system integration beyond standard connectors.
- You require multi-region architecture with contractual resilience targets.
- You require government/enterprise procurement artifacts (SOW, legal controls, audit commitments).
- You require dedicated account governance and custom SLA terms.

---

## Module Entitlement Framework (All HMS Module Groups)

This map aligns subscription entitlements with module groups defined in `write-up.md` section `6.1` through `6.20`.

| Module Group | Free | Basic | Pro | Advanced | Custom | Upgrade Signal |
|------|------|------|------|------|------|------|
| Group 1: Auth, sessions, tenancy, core access | Limited | Included | Included | Included | Included | Need more users, stronger role governance, or multi-site access |
| Group 2: Patient registry and consent | Basic | Included | Included | Included | Included | Need full consent workflows and complete records |
| Group 3: Scheduling, availability, queue | Basic | Included | Included | Included | Included | Need higher throughput and multi-provider scheduling |
| Group 4: Encounters and clinical documentation | Basic | Included | Included | Included | Included | Need advanced clinical workflow depth |
| Groups 5-7: IPD, ICU, theatre | Not included | Not included | Included | Included | Included | Inpatient or critical-care operations start |
| Groups 8-9: Lab and radiology | Not included | Not included | Included | Included | Included | Diagnostics order-to-result workflow required |
| Group 10: Pharmacy | Not included | Not included | Included | Included | Included | Dispensing and medication safety controls required |
| Group 11: Inventory and procurement | Not included | Lite add-on | Included | Included | Included | Need stock governance and procurement controls |
| Group 12: Emergency and ambulance | Not included | Not included | Included | Included | Included | Emergency triage/dispatch workflows required |
| Group 13: Billing, payments, insurance | Basic billing | Core billing | Full with insurance | Full with insurance | Full with insurance | Claim/pre-authorization workflows required |
| Group 14: HR, payroll, staffing | Not included | Not included | Included | Included | Included | Roster/payroll optimization required |
| Group 15: Housekeeping, facilities, maintenance foundation | Basic issue reporting | Basic maintenance | Included | Included | Included | Asset SLA workflows needed |
| Group 15A: Biomedical Engineering Suite | Not included | Not included | Add-on | Add-on | Included/contract | Biomedical lifecycle and calibration governance required |
| Group 16: Notifications and communications | Basic templates | Included | Included | Included | Included | Multi-channel communication scale required |
| Group 17: Reporting and analytics | View-only basics | Basic reports | Advanced dashboards | Advanced dashboards | Advanced dashboards + DW options | Need executive analytics and forecasting depth |
| Group 18: Subscription, licensing, module controls | Platform managed | Platform managed | Platform managed | Platform managed | Platform managed + contract controls | Need enterprise license governance terms |
| Group 19: Compliance, audit, security logs | Basic operational logs | Basic operational logs | Add-on | Included | Included | Regulatory audit evidence or strict PHI controls required |
| Group 20: Integrations and webhooks | Not included | Not included | Add-on | Add-on/contract | Included/contract | External system integration becomes critical |

---

## Add-Ons (Optional Revenue Modules)

Add-on eligibility is gated by minimum plan to protect feature fit, supportability, and margin.

| Add-On | Price Range | Minimum Plan | Eligibility Notes |
|------|-------------|-------------|-------------------|
| Inventory and Procurement Lite | $19-$59/mo | Basic | Adds stock tracking and procurement-lite flows for small clinics. |
| Biomedical Engineering Suite | $49-$199/mo | Pro | Requires advanced operations workflows and role setup. |
| Compliance and Audit Suite | $39-$149/mo | Pro | Enables advanced audit, PHI access, and compliance reporting controls. |
| Advanced Analytics | $29-$99/mo | Pro | Depends on richer data volume and reporting maturity. |
| Integrations/Webhooks Pack | $49-$149/mo | Pro | Requires technical ownership and integration governance. |
| Extra Storage | $5 / 10GB | Basic | Available on all paid plans. |
| SMS Credits | Usage-based | Basic | Available on all paid plans; billed by usage. |

### Add-On Eligibility Rules
- Free plan is not eligible for paid add-ons.
- If a customer needs an ineligible add-on, they must first upgrade to the required minimum plan.
- Advanced and Custom can consume all add-ons, subject to contract scope and infrastructure constraints.
- Custom plan can also include bespoke add-ons via SOW pricing when standard packs are insufficient.

---

## Plan Comparison Snapshot

| Feature | Free | Basic | Pro | Advanced | Custom |
|--------|------|------|-----|---------|--------|
| Users Included | 1 | 5 | 10 | Contracted | Contracted |
| Facilities | 1 | 1 | 3 | Contracted | Contracted |
| Patients | 5/day | Unlimited | Unlimited | Unlimited | Unlimited |
| Printing | No | Yes | Yes | Yes | Yes |
| Exports | No | Basic | Full | Full | Full |
| Branding | No | Yes | Yes | Yes | Yes |
| Advanced Clinical | No | No | Yes | Yes | Yes |
| On-Prem | No | No | No | Yes (standard package) | Yes (tailored) |
| Custom Engineering | No | No | No | No (default) | Yes |
| Multi-Region Architecture | No | No | No | Limited/No (default) | Yes |
| Procurement Model | Self-serve | Self-serve | Commercial | Standard quote | SOW / RFP-ready |
| Support Model | Best effort | Standard | Priority | Priority + optional SLA | Dedicated + custom SLA |

---

## Upgrade Guidance and Plan-Fit Governance

### Upgrade Guidance
- Free -> Basic: when clinics need printing, export, branding, or unlimited patient throughput.
- Basic -> Pro: when care delivery expands into inpatient, diagnostics, pharmacy, emergency, HR/rosters, insurance, or higher user/facility complexity.
- Pro -> Advanced: when deployment must move on-premise for policy, sovereignty, or local-infrastructure requirements.
- Advanced -> Custom: when custom engineering, enterprise integrations, or government/enterprise contracting requirements emerge.

### Keep Current Plan Appropriate
- Keep the current plan when active workflows are fully supported and usage is within plan limits.
- Flag "approaching limit" status when sustained usage exceeds 80% of user/facility/storage thresholds.
- Trigger upgrade recommendation when limits are exceeded or critical workflows are blocked by entitlement.
- Trigger downgrade review when usage remains below 50% of paid limits for 90+ days and no restricted modules are actively required.
- Run monthly plan-fit checks in-product and quarterly commercial reviews with admin owners.
- Position upgrades as workflow-enablement decisions, not forced upsell actions.

---

## Commercial Terms and Assumptions
- Prices are baseline references; final quote depends on scope, region, and deployment complexity.
- Taxes, payment gateway fees, SMS usage, and third-party infrastructure costs are excluded unless stated otherwise.
- Annual plans are prepaid unless contract terms state otherwise.
- Add-ons can be bundled at discounted rates for annual or multi-module commitments.
- Minimum-plan gates for add-ons are mandatory unless explicitly overridden in a signed enterprise contract.

---

## Positioning Summary
- Free: Try platform risk-free.
- Basic: Run a clinic.
- Pro: Run a hospital.
- Advanced: Run on your own infrastructure with standard scope.
- Custom: Run at enterprise/government scale with tailored engineering and governance.
