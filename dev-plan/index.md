# Frontend Development Plan

## Purpose
This development plan provides a **complete, step-by-step, chronological guide** for building the React Native (Expo + App Router) application. Each step is **modular**, creates the **smallest unit** of functionality, and ensures **100% compliance** with project rules defined in `.cursor/rules/`.

## Principles
- **Modularity**: Each step is independent and testable
- **Reproducibility**: Any developer following this plan will produce the same application
- **Rule Compliance**: Every step strictly follows `.cursor/rules/` standards (rules are not redefined here)
- **Incremental**: Each step builds on previous steps
- **Testable**: Every step includes testing requirements

## Development Order
The plan follows the **layered architecture** and **initialization order**, but intentionally implements **reusable app building blocks first** and **app-specific features last**.

**IMPORTANT**: Phases 0-8 are **generic React Native app building blocks** that apply to any React Native application without requiring modifications. App-specific implementations (marketplace features, biomed-specific features, etc.) start in Phase 9.

1. **Foundation** → Config, Utils, Logging, Errors (generic)
2. **Infrastructure** → Services, Security (generic)
3. **State & Theme** → Store, Theme System (generic)
4. **Offline** → Offline-first architecture + Bootstrap layer (wires security, store, theme, offline) (generic)
5. **Reusable Hooks** → Cross-cutting hooks used by any app (used by UI patterns) (generic)
6. **Reusable Platform UI Foundation** → Primitives, patterns, layouts (no domain coupling) (generic)
7. **App Shell (App Router + Guards)** → Providers, route groups, navigation shell, error routes (generic)
8. **Minimal Runnable App** → Landing page, home screen, error routes (verify app runs before features) (generic)
9. **Core Features** → Implement all 21 core marketplace features (Auth, User, Products, Cart, Orders, Payments, Shops, Subscriptions, RFQ, Reviews, etc.) (**app-specific starts here**)
10. **Screens & Routes** → Implement screens, routes, and UI wiring for all features (**app-specific**)
11. **Advanced Features** → Biomed-specific features (certifications, recalls, batch lots), compliance (GDPR/HIPAA), enterprise payments, support systems, marketing features (**app-specific**)
12. **Finalization** → Onboarding/help + comprehensive testing/polish (**app-specific**)

## File Structure
- `P000_setup.md` - Project initialization
- `P001_foundation.md` - Foundation layer (config, utils, logging, errors, i18n)
- `P002_infrastructure.md` - Infrastructure layer (services, security)
- `P003_state-theme.md` - State management & theming (light, dark, high-contrast)
- `P004_offline.md` - Offline-first architecture + Bootstrap layer
- `P005_reusable-hooks.md` - Reusable Hooks (cross-cutting hooks; no feature hooks)
- `P006_platform-ui-foundation.md` - Reusable Platform UI Foundation (primitives, patterns, layouts)
- `P007_app-shell.md` - App Shell (App Router + guards + navigation skeleton)
- `P008_minimal-app.md` - Minimal Runnable App (landing page, home screen, error routes)
- `P009_core-features.md` - Core Features (implement all 21 marketplace features)
- `P010_screens-routes.md` - Screens & Routes (implement screens, routes, and UI wiring)
- `P011_advanced-features.md` - Advanced Features (biomed-specific, compliance, enterprise, marketing)
- `P012_finalization.md` - Finalization (onboarding/help + testing/polish)

## Development Flow

```
Phase 0: Setup (Generic)
    ↓
Phase 1: Foundation (Config, Utils, Logging, Errors) (Generic)
    ↓
Phase 2: Infrastructure (Services, Security) (Generic)
    ↓
Phase 3: State & Theme (Redux, Theme System) (Generic)
    ↓
Phase 4: Offline (Queue, Sync, Network) + Bootstrap (wires all systems) (Generic)
    ↓
Phase 5: Reusable Hooks (Cross-cutting hooks) (Generic)
    ↓
Phase 6: Reusable Platform UI Foundation (Primitives, Patterns, Layouts) (Generic)
    ↓
Phase 7: App Shell (App Router + Guards + Navigation Skeleton) (Generic)
    ↓
Phase 8: Minimal Runnable App (Landing page, home screen, error routes) (Generic)
    ↓
Phase 9: Core Features (App-specific starts here - Implement all 21 marketplace features)
    ↓
Phase 10: Screens & Routes (App-specific - Implement screens, routes, and UI wiring)
    ↓
Phase 11: Advanced Features (App-specific - Biomed-specific, compliance, enterprise payments, support, marketing)
    ↓
Phase 12: Finalization (App-specific - Onboarding/Help + Testing/Polish)
```

## How to Use This Plan
1. Follow steps **sequentially** within each phase
2. Complete **all steps** in a phase before moving to the next
3. Write **tests immediately** after each implementation step
4. Verify **rule compliance** by referencing `.cursor/rules/` files
5. **Do not skip** steps or merge them
6. **Use correct file extensions** (`.jsx` for JSX, `.js` for everything else)
7. **Enforce 100% internationalization** - All UI text must use i18n (see `.cursor/rules/i18n.mdc`)
8. **Enforce mandatory grouping** - All related routes MUST be grouped using parentheses `(group-name)` in `src/app/` (see `.cursor/rules/app-router.mdc`). All related components and screens MUST be grouped using regular folder names (NO parentheses) in `src/platform/` (see `.cursor/rules/component-structure.mdc`)

## Quick Start

1. **Read** `index.md` (this file)
2. **Review** relevant rules in `.cursor/rules/` before starting each phase
3. **Start** with `P000_setup.md`
4. **Follow** each phase sequentially
5. **Complete** all steps in a phase before moving to next
6. **Test** after each implementation
7. **Verify** rule compliance at each step

## Rule References
All implementation steps follow rules defined in `.cursor/rules/`:
- `core-principles.mdc` - Fundamental principles
- `project-structure.mdc` - Folder structure
- `tech-stack.mdc` - Technology stack
- `bootstrap-config.mdc` - Initialization order
- And all other rule files as needed

**Note**: This dev-plan contains **implementation steps only**. Rules are defined in `.cursor/rules/` and should be referenced, not redefined here.

## Feature Coverage

This development plan covers all features specified in the write-up (`@write-up/`) and aligns with all backend modules (`@backend/src/modules/`):

### Marketplace Core (Phase 9)
- ✅ Authentication & User Management
- ✅ Product Catalog & Search
- ✅ Shopping Cart
- ✅ Orders & Checkout
- ✅ Payments
- ✅ Shop & Vendor Management
- ✅ Subscriptions & Monetization
- ✅ Quote Requests (RFQ)
- ✅ Reviews & Ratings
- ✅ Categories
- ✅ Addresses
- ✅ Companies
- ✅ Conversations/Messaging
- ✅ Notifications
- ✅ Shipments
- ✅ Returns
- ✅ Wishlists
- ✅ Saved Searches

### Advanced Features & Biomed-Specific Modules (Phase 11)
- ✅ Product Certifications (FDA, CE, ISO)
- ✅ Product Hazards
- ✅ Product Recalls & Recall Notifications
- ✅ Batch/Lot Tracking
- ✅ Warehouses
- ✅ Departments
- ✅ Manufacturers
- ✅ Product Approvals
- ✅ Vendor Approvals
- ✅ Compliance Features (GDPR/HIPAA: consent, data processing, breach notifications, PHI access, audit logs)
- ✅ Purchase Orders
- ✅ Net Terms (30/60/90-day payment terms)
- ✅ Lease Agreements (lease-to-own)
- ✅ Payment Method Requests
- ✅ Support Tickets
- ✅ Disputes
- ✅ Promotions
- ✅ Coupon Redemptions
- ✅ Loyalty Program (points, badges, tiers)
- ✅ Referrals & Affiliates
- ✅ Media Assets
- ✅ Price History
- ✅ Integration Logs
- ✅ Enhanced Authentication (MFA & OAuth)

### Platform Features
- ✅ Offline-First Architecture
- ✅ Multi-Language Support (i18n) - 22 languages with location-based defaults (per `.cursor/rules/i18n.mdc`)
  - **Note**: During development (Phases 1-11), only English (`en`) locale is created. All other 21 locales are created in Phase 12 (Finalization) to ensure English is complete first.
- ✅ Accessibility (WCAG AA/AAA with high-contrast mode)
- ✅ Security & Compliance (MFA, OAuth/SSO, encryption)
- ✅ Performance Optimization
- ✅ Responsive Design (Mobile-first: 320px, 768px, 1024px, 1440px)
- ✅ Progressive Web App (PWA) - Installable, offline, push notifications
- ✅ Onboarding & Help System - Progressive onboarding, tutorials, knowledge base

All features follow the backend API structure and implement the complete functionality described in the write-up.

---

**Start with**: `P000_setup.md`

