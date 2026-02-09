# HMS Frontend

React Native (Expo + App Router) frontend for the HMS platform. This app targets web and native clients using a shared codebase.

## Features
- Role-based experiences for clinicians, nurses, admins, and patients
- Multi-tenant, multi-branch workflows with granular access control
- Patient registry, appointments, encounters, and clinical notes
- IPD/ICU, theatre, nursing, and bed management
- Diagnostics (lab + radiology), imaging, and pharmacy
- Billing, insurance claims, payments, and refunds
- Inventory, procurement, suppliers, and asset tracking
- HR, staffing, shifts, and payroll coordination
- Reporting, analytics, and executive dashboards
- Notifications and secure messaging across teams
- Internationalization and localization ready
- Accessibility-first UI with responsive design
- Offline-tolerant critical workflows

## Requirements
- Node.js >= 20
- Expo CLI (optional; `npx expo` works)

## Getting Started
1. Copy `env.template.txt` to your local env file and set values as needed.
2. Install dependencies:
   - `npm install`
3. Start the app:
   - `npm run start`

## Common Scripts
- `npm run start` - start Expo dev server (clears cache)
- `npm run android` - run on Android
- `npm run ios` - run on iOS
- `npm run web` - run on web
- `npm run test` - run tests
- `npm run test:watch` - run tests in watch mode
- `npm run test:coverage` - run tests with coverage

## Project Docs
- `dev-plan/` - step-by-step implementation plan
- `.cursor/rules/` - project rules and standards


