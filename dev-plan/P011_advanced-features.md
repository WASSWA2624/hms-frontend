# Phase 11: Advanced Features (Biomed-Specific & Enterprise)

## Purpose
Implement **biomed-specific**, **regulated/enterprise**, and **advanced** features that weren't covered in Phase 9. These features are specific to the biomedical marketplace domain and include compliance, approvals, enterprise payments, support systems, and marketing features.

## Rule References
- `.cursor/rules/features-domain.mdc` (Feature Template Structure - **MANDATORY**)
- `.cursor/rules/state-management.mdc`
- `.cursor/rules/services-integration.mdc`
- `.cursor/rules/errors-logging.mdc`
- `.cursor/rules/security.mdc`
- `.cursor/rules/offline-sync.mdc`
- `.cursor/rules/testing.mdc`

## Prerequisites
- Phase 10 completed (screens, routes, and UI wiring are complete)
- Phase 9 completed (all 21 core features implemented)

## Feature Development Contract (mandatory for each step)
**Each feature must follow the template structure defined in `.cursor/rules/features-domain.mdc`**:

- `src/features/<feature>/<feature>.rules.js` - Business rules & validation (pure functions)
- `src/features/<feature>/<feature>.model.js` - Domain models (normalize API responses)
- `src/features/<feature>/<feature>.api.js` - Feature-level API orchestration
- `src/features/<feature>/<feature>.usecase.js` - Application use cases
- `src/features/<feature>/index.js` - Barrel exports (public API only)
- `src/store/slices/<feature>.slice.js` - Redux slice (if global state needed)
- `src/hooks/use<Feature>.js` - UI gateway hook (exposes feature API)

**Testing Requirements**:
- Rules/models: **100% coverage** (all branches)
- API/usecase/slice/hook: **high coverage**, include error paths
- All tests must mock services/storage/time

**Definition of Done** (per feature):
- ✅ All template files exist and follow structure
- ✅ Unit tests pass with required coverage
- ✅ No UI imports in features/store/services
- ✅ No raw errors in Redux state (error codes only)
- ✅ Errors are normalized and domain-specific
- ✅ All public APIs exported via `index.js`

## Steps

### Step 11.1: Product Certification Feature
**Goal**: Implement product certification management (FDA, CE, ISO) per write-up section 5 and backend `/api/v1/product-certifications` endpoints.

**Backend API**: `/api/v1/product-certifications/*` (create, list, get, update, delete, validate)

**Write-up Reference**: `write-up/05-product-catalog-search.md` (section 3.1), `write-up/10-security-privacy-compliance.md` (section 8.2)

**Feature Files**:
- `src/features/productCertification/productCertification.rules.js` - Certification validation, expiry rules, regulatory code rules
- `src/features/productCertification/productCertification.model.js` - Certification model, regulatory code model
- `src/features/productCertification/productCertification.api.js` - Call `/api/v1/product-certifications/*` endpoints
- `src/features/productCertification/productCertification.usecase.js` - Create certification, validate certification, check expiry, list certifications
- `src/store/slices/productCertification.slice.js` - Certification state (certifications, expiry alerts, error codes)
- `src/hooks/useProductCertifications.js` - Expose `{ certifications, createCertification, validateCertification, checkExpiry, error }`

**Business Rules**:
- Certification type validation (FDA, CE, ISO, etc.)
- Expiry date validation and alerts
- Regulatory code validation
- Certification status rules (Active → Expired → Renewed)
- Automated compliance monitoring rules

**Tests (mandatory)**:
- `src/__tests__/features/productCertification/productCertification.rules.test.js` (100% coverage)
- `src/__tests__/features/productCertification/productCertification.model.test.js` (100% coverage)
- `src/__tests__/features/productCertification/productCertification.api.test.js` (mock apiClient)
- `src/__tests__/features/productCertification/productCertification.usecase.test.js` (error paths)
- `src/__tests__/store/slices/productCertification.slice.test.js` (state transitions)
- `src/__tests__/hooks/useProductCertifications.test.js` (selector/dispatch interactions)

---

### Step 11.2: Product Hazard Feature
**Goal**: Implement product hazard classification per write-up section 5 and backend `/api/v1/product-hazards` endpoints.

**Backend API**: `/api/v1/product-hazards/*` (create, list, get, update, delete)

**Write-up Reference**: `write-up/05-product-catalog-search.md` (section 3.1)

**Feature Files**:
- `src/features/productHazard/productHazard.rules.js` - Hazard classification rules, safety validation rules
- `src/features/productHazard/productHazard.model.js` - Hazard model, classification model
- `src/features/productHazard/productHazard.api.js` - Call `/api/v1/product-hazards/*` endpoints
- `src/features/productHazard/productHazard.usecase.js` - Create hazard, update hazard, list hazards, validate safety
- `src/store/slices/productHazard.slice.js` - Hazard state (hazards, classifications, error codes)
- `src/hooks/useProductHazards.js` - Expose `{ hazards, createHazard, updateHazard, validateSafety, error }`

**Business Rules**:
- Hazard classification validation (biohazard, flammable, corrosive, etc.)
- Safety handling rules
- Warning display rules
- Compliance with safety regulations

**Tests (mandatory)**:
- `src/__tests__/features/productHazard/productHazard.rules.test.js` (100% coverage)
- `src/__tests__/features/productHazard/productHazard.model.test.js` (100% coverage)
- `src/__tests__/features/productHazard/productHazard.api.test.js` (mock apiClient)
- `src/__tests__/features/productHazard/productHazard.usecase.test.js` (error paths)
- `src/__tests__/store/slices/productHazard.slice.test.js` (state transitions)
- `src/__tests__/hooks/useProductHazards.test.js` (selector/dispatch interactions)

---

### Step 11.3: Product Recall Feature
**Goal**: Implement product recall management per write-up section 18 and backend `/api/v1/product-recalls` endpoints.

**Backend API**: `/api/v1/product-recalls/*`, `/api/v1/recall-notifications/*` (create, list, get, update, notify)

**Write-up Reference**: `write-up/05-product-catalog-search.md` (section 3.5)

**Feature Files**:
- `src/features/productRecall/productRecall.rules.js` - Recall creation rules, notification rules, urgency rules
- `src/features/productRecall/productRecall.model.js` - Recall model, recall notification model
- `src/features/productRecall/productRecall.api.js` - Call `/api/v1/product-recalls/*` and `/api/v1/recall-notifications/*` endpoints
- `src/features/productRecall/productRecall.usecase.js` - Create recall, notify users, acknowledge recall, list recalls
- `src/store/slices/productRecall.slice.js` - Recall state (recalls, notifications, acknowledgements, error codes)
- `src/hooks/useProductRecalls.js` - Expose `{ recalls, createRecall, notifyUsers, acknowledgeRecall, error }`

**Business Rules**:
- Recall creation validation (product must exist, reason required)
- Notification urgency rules (immediate, high, medium, low)
- User notification rules (notify all purchasers)
- Recall acknowledgement rules
- Recall status rules (Active → Resolved → Closed)

**Tests (mandatory)**:
- `src/__tests__/features/productRecall/productRecall.rules.test.js` (100% coverage)
- `src/__tests__/features/productRecall/productRecall.model.test.js` (100% coverage)
- `src/__tests__/features/productRecall/productRecall.api.test.js` (mock apiClient)
- `src/__tests__/features/productRecall/productRecall.usecase.test.js` (error paths)
- `src/__tests__/store/slices/productRecall.slice.test.js` (state transitions)
- `src/__tests__/hooks/useProductRecalls.test.js` (selector/dispatch interactions)

---

### Step 11.4: Batch/Lot Tracking Feature
**Goal**: Implement batch/lot tracking for medical consumables per write-up section 5 and backend `/api/v1/batch-lots` endpoints.

**Backend API**: `/api/v1/batch-lots/*` (create, list, get, update, track)

**Write-up Reference**: `write-up/05-product-catalog-search.md` (section 3.1, 3.5)

**Feature Files**:
- `src/features/batchLot/batchLot.rules.js` - Batch number validation, expiry date rules, traceability rules
- `src/features/batchLot/batchLot.model.js` - Batch lot model, traceability model
- `src/features/batchLot/batchLot.api.js` - Call `/api/v1/batch-lots/*` endpoints
- `src/features/batchLot/batchLot.usecase.js` - Create batch, track batch, check expiry, list batches
- `src/store/slices/batchLot.slice.js` - Batch lot state (batches, traceability, expiry alerts, error codes)
- `src/hooks/useBatchLots.js` - Expose `{ batches, createBatch, trackBatch, checkExpiry, error }`

**Business Rules**:
- Batch number format validation
- Expiry date validation and alerts
- Traceability requirements (complete chain of custody)
- Quantity validation (cannot exceed batch quantity)
- Expiry date management rules

**Tests (mandatory)**:
- `src/__tests__/features/batchLot/batchLot.rules.test.js` (100% coverage)
- `src/__tests__/features/batchLot/batchLot.model.test.js` (100% coverage)
- `src/__tests__/features/batchLot/batchLot.api.test.js` (mock apiClient)
- `src/__tests__/features/batchLot/batchLot.usecase.test.js` (error paths)
- `src/__tests__/store/slices/batchLot.slice.test.js` (state transitions)
- `src/__tests__/hooks/useBatchLots.test.js` (selector/dispatch interactions)

---

### Step 11.5: Warehouse Feature
**Goal**: Implement warehouse management per backend `/api/v1/warehouses` endpoints.

**Backend API**: `/api/v1/warehouses/*` (create, list, get, update, delete, inventory)

**Write-up Reference**: `write-up/05-product-catalog-search.md` (section 3.5)

**Feature Files**:
- `src/features/warehouse/warehouse.rules.js` - Warehouse creation rules, location validation, inventory rules
- `src/features/warehouse/warehouse.model.js` - Warehouse model, inventory model
- `src/features/warehouse/warehouse.api.js` - Call `/api/v1/warehouses/*` endpoints
- `src/features/warehouse/warehouse.usecase.js` - Create warehouse, update warehouse, manage inventory, list warehouses
- `src/store/slices/warehouse.slice.js` - Warehouse state (warehouses, inventory, error codes)
- `src/hooks/useWarehouses.js` - Expose `{ warehouses, createWarehouse, updateWarehouse, manageInventory, error }`

**Business Rules**:
- Warehouse location validation
- Inventory management rules
- Warehouse access control rules
- Multi-warehouse support

**Tests (mandatory)**:
- `src/__tests__/features/warehouse/warehouse.rules.test.js` (100% coverage)
- `src/__tests__/features/warehouse/warehouse.model.test.js` (100% coverage)
- `src/__tests__/features/warehouse/warehouse.api.test.js` (mock apiClient)
- `src/__tests__/features/warehouse/warehouse.usecase.test.js` (error paths)
- `src/__tests__/store/slices/warehouse.slice.test.js` (state transitions)
- `src/__tests__/hooks/useWarehouses.test.js` (selector/dispatch interactions)

---

### Step 11.6: Department Feature
**Goal**: Implement department management per backend `/api/v1/departments` endpoints.

**Backend API**: `/api/v1/departments/*` (create, list, get, update, delete)

**Write-up Reference**: `write-up/05-product-catalog-search.md` (section 3.5)

**Feature Files**:
- `src/features/department/department.rules.js` - Department creation rules, hierarchy rules
- `src/features/department/department.model.js` - Department model
- `src/features/department/department.api.js` - Call `/api/v1/departments/*` endpoints
- `src/features/department/department.usecase.js` - Create department, update department, list departments
- `src/store/slices/department.slice.js` - Department state (departments, error codes)
- `src/hooks/useDepartments.js` - Expose `{ departments, createDepartment, updateDepartment, error }`

**Business Rules**:
- Department name validation
- Department hierarchy rules
- Department access control rules

**Tests (mandatory)**:
- `src/__tests__/features/department/department.rules.test.js` (100% coverage)
- `src/__tests__/features/department/department.model.test.js` (100% coverage)
- `src/__tests__/features/department/department.api.test.js` (mock apiClient)
- `src/__tests__/features/department/department.usecase.test.js` (error paths)
- `src/__tests__/store/slices/department.slice.test.js` (state transitions)
- `src/__tests__/hooks/useDepartments.test.js` (selector/dispatch interactions)

---

### Step 11.7: Manufacturer Feature
**Goal**: Implement manufacturer management per backend `/api/v1/manufacturers` endpoints.

**Backend API**: `/api/v1/manufacturers/*` (create, list, get, update, delete)

**Write-up Reference**: `write-up/05-product-catalog-search.md` (section 3.2)

**Feature Files**:
- `src/features/manufacturer/manufacturer.rules.js` - Manufacturer creation rules, validation rules
- `src/features/manufacturer/manufacturer.model.js` - Manufacturer model
- `src/features/manufacturer/manufacturer.api.js` - Call `/api/v1/manufacturers/*` endpoints
- `src/features/manufacturer/manufacturer.usecase.js` - Create manufacturer, update manufacturer, list manufacturers
- `src/store/slices/manufacturer.slice.js` - Manufacturer state (manufacturers, error codes)
- `src/hooks/useManufacturers.js` - Expose `{ manufacturers, createManufacturer, updateManufacturer, error }`

**Business Rules**:
- Manufacturer name validation
- Manufacturer information validation
- Manufacturer product association rules

**Tests (mandatory)**:
- `src/__tests__/features/manufacturer/manufacturer.rules.test.js` (100% coverage)
- `src/__tests__/features/manufacturer/manufacturer.model.test.js` (100% coverage)
- `src/__tests__/features/manufacturer/manufacturer.api.test.js` (mock apiClient)
- `src/__tests__/features/manufacturer/manufacturer.usecase.test.js` (error paths)
- `src/__tests__/store/slices/manufacturer.slice.test.js` (state transitions)
- `src/__tests__/hooks/useManufacturers.test.js` (selector/dispatch interactions)

---

### Step 11.8: Product Approval Feature
**Goal**: Implement product approval workflows per write-up section 8.2 and backend `/api/v1/product-approvals` endpoints.

**Backend API**: `/api/v1/product-approvals/*`, `/api/v1/product-approval-histories/*` (create, list, get, approve, reject)

**Write-up Reference**: `write-up/08-reviews-ratings-approval.md` (section 6.2)

**Feature Files**:
- `src/features/productApproval/productApproval.rules.js` - Approval workflow rules, status transition rules, rejection rules
- `src/features/productApproval/productApproval.model.js` - Approval model, approval history model
- `src/features/productApproval/productApproval.api.js` - Call `/api/v1/product-approvals/*` and `/api/v1/product-approval-histories/*` endpoints
- `src/features/productApproval/productApproval.usecase.js` - Submit for approval, approve product, reject product, get approval history
- `src/store/slices/productApproval.slice.js` - Approval state (approvals, history, status, error codes)
- `src/hooks/useProductApprovals.js` - Expose `{ approvals, submitForApproval, approveProduct, rejectProduct, getHistory, error }`

**Business Rules**:
- Approval submission validation (certifications required, completeness check)
- Status transition rules (Pending → Under Review → Approved/Rejected)
- Automated validation rules (completeness, required fields)
- Manual review rules (admin review required)
- Rejection feedback rules

**Tests (mandatory)**:
- `src/__tests__/features/productApproval/productApproval.rules.test.js` (100% coverage)
- `src/__tests__/features/productApproval/productApproval.model.test.js` (100% coverage)
- `src/__tests__/features/productApproval/productApproval.api.test.js` (mock apiClient)
- `src/__tests__/features/productApproval/productApproval.usecase.test.js` (error paths)
- `src/__tests__/store/slices/productApproval.slice.test.js` (state transitions)
- `src/__tests__/hooks/useProductApprovals.test.js` (selector/dispatch interactions)

---

### Step 11.9: Vendor Approval Feature
**Goal**: Implement vendor approval workflows per write-up section 7 and backend `/api/v1/vendor-approvals` endpoints.

**Backend API**: `/api/v1/vendor-approvals/*`, `/api/v1/vendor-approval-documents/*`, `/api/v1/vendor-approval-histories/*` (create, list, get, approve, reject)

**Write-up Reference**: `write-up/07-shop-vendor-management.md` (section 5.1), `write-up/08-reviews-ratings-approval.md` (section 6.2)

**Feature Files**:
- `src/features/vendorApproval/vendorApproval.rules.js` - Vendor approval rules, document validation rules, KYC rules
- `src/features/vendorApproval/vendorApproval.model.js` - Vendor approval model, document model, approval history model
- `src/features/vendorApproval/vendorApproval.api.js` - Call `/api/v1/vendor-approvals/*` and related endpoints
- `src/features/vendorApproval/vendorApproval.usecase.js` - Submit vendor application, approve vendor, reject vendor, upload documents, get history
- `src/store/slices/vendorApproval.slice.js` - Vendor approval state (approvals, documents, history, status, error codes)
- `src/hooks/useVendorApprovals.js` - Expose `{ approvals, submitApplication, approveVendor, rejectVendor, uploadDocuments, error }`

**Business Rules**:
- Vendor application validation (business documents required)
- Automated KYC validation rules
- Manual review rules (high-risk categories)
- Document upload validation
- Status transition rules (Pending → Under Review → Approved/Rejected)
- Ongoing compliance monitoring rules

**Tests (mandatory)**:
- `src/__tests__/features/vendorApproval/vendorApproval.rules.test.js` (100% coverage)
- `src/__tests__/features/vendorApproval/vendorApproval.model.test.js` (100% coverage)
- `src/__tests__/features/vendorApproval/vendorApproval.api.test.js` (mock apiClient)
- `src/__tests__/features/vendorApproval/vendorApproval.usecase.test.js` (error paths)
- `src/__tests__/store/slices/vendorApproval.slice.test.js` (state transitions)
- `src/__tests__/hooks/useVendorApprovals.test.js` (selector/dispatch interactions)

---

### Step 11.10: Compliance Feature (GDPR/HIPAA)
**Goal**: Implement compliance features (consent, data processing, breach notifications, PHI access) per write-up section 10 and backend compliance endpoints.

**Backend API**: `/api/v1/consents/*`, `/api/v1/data-processing/*`, `/api/v1/breach-notifications/*`, `/api/v1/phi-access/*`, `/api/v1/audit-logs/*`, `/api/v1/terms-acceptance/*`

**Write-up Reference**: `write-up/10-security-privacy-compliance.md`

**Feature Files**:
- `src/features/compliance/compliance.rules.js` - Consent rules, data processing rules, breach notification rules, PHI access rules
- `src/features/compliance/compliance.model.js` - Consent model, data processing model, breach notification model, PHI access model, audit log model
- `src/features/compliance/compliance.api.js` - Call compliance endpoints
- `src/features/compliance/compliance.usecase.js` - Manage consent, log data processing, report breach, log PHI access, view audit logs, accept terms
- `src/store/slices/compliance.slice.js` - Compliance state (consents, data processing logs, breach notifications, PHI access logs, audit logs, error codes)
- `src/hooks/useCompliance.js` - Expose `{ consents, manageConsent, logDataProcessing, reportBreach, logPHIAccess, getAuditLogs, acceptTerms, error }`

**Business Rules**:
- Consent validation (opt-in/opt-out, granular controls)
- Data processing logging rules (lawful basis, purpose)
- Breach notification rules (timeline, severity)
- PHI access logging rules (who, what, when, why)
- Audit log rules (immutable, tamper-evident)
- Terms acceptance rules (version tracking, re-acceptance)

**Tests (mandatory)**:
- `src/__tests__/features/compliance/compliance.rules.test.js` (100% coverage)
- `src/__tests__/features/compliance/compliance.model.test.js` (100% coverage)
- `src/__tests__/features/compliance/compliance.api.test.js` (mock apiClient)
- `src/__tests__/features/compliance/compliance.usecase.test.js` (error paths)
- `src/__tests__/store/slices/compliance.slice.test.js` (state transitions)
- `src/__tests__/hooks/useCompliance.test.js` (selector/dispatch interactions)

---

### Step 11.11: Purchase Order Feature
**Goal**: Implement purchase order management per write-up section 6.3 and backend `/api/v1/purchase-orders` endpoints.

**Backend API**: `/api/v1/purchase-orders/*` (create, list, get, update, approve, reject)

**Write-up Reference**: `write-up/06-ordering-checkout-interaction.md` (section 4.3), `write-up/09-subscription-monetization.md` (section 7.4)

**Feature Files**:
- `src/features/purchaseOrder/purchaseOrder.rules.js` - PO creation rules, approval rules, validation rules
- `src/features/purchaseOrder/purchaseOrder.model.js` - Purchase order model, PO item model
- `src/features/purchaseOrder/purchaseOrder.api.js` - Call `/api/v1/purchase-orders/*` endpoints
- `src/features/purchaseOrder/purchaseOrder.usecase.js` - Create PO, approve PO, reject PO, list POs, get PO details
- `src/store/slices/purchaseOrder.slice.js` - Purchase order state (POs, current PO, status, error codes)
- `src/hooks/usePurchaseOrders.js` - Expose `{ purchaseOrders, createPO, approvePO, rejectPO, getPO, error }`

**Business Rules**:
- PO creation validation (order must exist, amount validation)
- PO approval workflow rules
- PO number validation
- Invoice generation rules
- Status transition rules (Created → Pending Approval → Approved/Rejected)

**Tests (mandatory)**:
- `src/__tests__/features/purchaseOrder/purchaseOrder.rules.test.js` (100% coverage)
- `src/__tests__/features/purchaseOrder/purchaseOrder.model.test.js` (100% coverage)
- `src/__tests__/features/purchaseOrder/purchaseOrder.api.test.js` (mock apiClient)
- `src/__tests__/features/purchaseOrder/purchaseOrder.usecase.test.js` (error paths)
- `src/__tests__/store/slices/purchaseOrder.slice.test.js` (state transitions)
- `src/__tests__/hooks/usePurchaseOrders.test.js` (selector/dispatch interactions)

---

### Step 11.12: Net Terms Feature
**Goal**: Implement net terms payment option per write-up section 9.4 and backend `/api/v1/net-terms` endpoints.

**Backend API**: `/api/v1/net-terms/*` (create, list, get, update, approve)

**Write-up Reference**: `write-up/09-subscription-monetization.md` (section 7.4)

**Feature Files**:
- `src/features/netTerms/netTerms.rules.js` - Net terms validation, eligibility rules, approval rules
- `src/features/netTerms/netTerms.model.js` - Net terms model, payment schedule model
- `src/features/netTerms/netTerms.api.js` - Call `/api/v1/net-terms/*` endpoints
- `src/features/netTerms/netTerms.usecase.js` - Create net terms, approve net terms, list net terms, get payment schedule
- `src/store/slices/netTerms.slice.js` - Net terms state (net terms, payment schedules, error codes)
- `src/hooks/useNetTerms.js` - Expose `{ netTerms, createNetTerms, approveNetTerms, getPaymentSchedule, error }`

**Business Rules**:
- Net terms eligibility rules (30/60/90-day terms)
- Approval rules (enterprise clients only)
- Payment schedule calculation rules
- Status transition rules (Pending → Approved → Active)

**Tests (mandatory)**:
- `src/__tests__/features/netTerms/netTerms.rules.test.js` (100% coverage)
- `src/__tests__/features/netTerms/netTerms.model.test.js` (100% coverage)
- `src/__tests__/features/netTerms/netTerms.api.test.js` (mock apiClient)
- `src/__tests__/features/netTerms/netTerms.usecase.test.js` (error paths)
- `src/__tests__/store/slices/netTerms.slice.test.js` (state transitions)
- `src/__tests__/hooks/useNetTerms.test.js` (selector/dispatch interactions)

---

### Step 11.13: Lease Agreement Feature
**Goal**: Implement lease-to-own payment option per write-up section 9.4 and backend `/api/v1/lease-agreements` endpoints.

**Backend API**: `/api/v1/lease-agreements/*`, `/api/v1/lease-payments/*` (create, list, get, update, process-payment)

**Write-up Reference**: `write-up/09-subscription-monetization.md` (section 7.4)

**Feature Files**:
- `src/features/leaseAgreement/leaseAgreement.rules.js` - Lease validation, payment schedule rules, eligibility rules
- `src/features/leaseAgreement/leaseAgreement.model.js` - Lease agreement model, lease payment model
- `src/features/leaseAgreement/leaseAgreement.api.js` - Call `/api/v1/lease-agreements/*` and `/api/v1/lease-payments/*` endpoints
- `src/features/leaseAgreement/leaseAgreement.usecase.js` - Create lease, process payment, list leases, get payment schedule
- `src/store/slices/leaseAgreement.slice.js` - Lease agreement state (leases, payments, schedules, error codes)
- `src/hooks/useLeaseAgreements.js` - Expose `{ leases, createLease, processPayment, getPaymentSchedule, error }`

**Business Rules**:
- Lease eligibility rules (expensive equipment only)
- Payment schedule calculation rules
- Lease status rules (Active → Completed → Defaulted)
- Payment processing rules

**Tests (mandatory)**:
- `src/__tests__/features/leaseAgreement/leaseAgreement.rules.test.js` (100% coverage)
- `src/__tests__/features/leaseAgreement/leaseAgreement.model.test.js` (100% coverage)
- `src/__tests__/features/leaseAgreement/leaseAgreement.api.test.js` (mock apiClient)
- `src/__tests__/features/leaseAgreement/leaseAgreement.usecase.test.js` (error paths)
- `src/__tests__/store/slices/leaseAgreement.slice.test.js` (state transitions)
- `src/__tests__/hooks/useLeaseAgreements.test.js` (selector/dispatch interactions)

---

### Step 11.14: Payment Method Request Feature
**Goal**: Implement payment method request system per write-up section 9.4 and backend `/api/v1/payment-method-requests` endpoints.

**Backend API**: `/api/v1/payment-method-requests/*`, `/api/v1/payment-method-request-upvotes/*` (create, list, get, upvote, approve)

**Write-up Reference**: `write-up/09-subscription-monetization.md` (section 7.4)

**Feature Files**:
- `src/features/paymentMethodRequest/paymentMethodRequest.rules.js` - Request validation, upvote rules, approval rules
- `src/features/paymentMethodRequest/paymentMethodRequest.model.js` - Payment method request model, upvote model
- `src/features/paymentMethodRequest/paymentMethodRequest.api.js` - Call `/api/v1/payment-method-requests/*` and related endpoints
- `src/features/paymentMethodRequest/paymentMethodRequest.usecase.js` - Create request, upvote request, list requests, track status
- `src/store/slices/paymentMethodRequest.slice.js` - Payment method request state (requests, upvotes, status, error codes)
- `src/hooks/usePaymentMethodRequests.js` - Expose `{ requests, createRequest, upvoteRequest, trackStatus, error }`

**Business Rules**:
- Request validation (payment method name, region, justification)
- Upvote rules (one vote per user)
- Status tracking rules (Pending → Under Review → Approved/Rejected)
- Voting system rules

**Tests (mandatory)**:
- `src/__tests__/features/paymentMethodRequest/paymentMethodRequest.rules.test.js` (100% coverage)
- `src/__tests__/features/paymentMethodRequest/paymentMethodRequest.model.test.js` (100% coverage)
- `src/__tests__/features/paymentMethodRequest/paymentMethodRequest.api.test.js` (mock apiClient)
- `src/__tests__/features/paymentMethodRequest/paymentMethodRequest.usecase.test.js` (error paths)
- `src/__tests__/store/slices/paymentMethodRequest.slice.test.js` (state transitions)
- `src/__tests__/hooks/usePaymentMethodRequests.test.js` (selector/dispatch interactions)

---

### Step 11.15: Support Ticket Feature
**Goal**: Implement support ticket system per write-up section 15.2 and backend `/api/v1/support-tickets` endpoints.

**Backend API**: `/api/v1/support-tickets/*`, `/api/v1/support-ticket-comments/*`, `/api/v1/support-ticket-histories/*` (create, list, get, update, comment, close)

**Write-up Reference**: `write-up/15-operational-admin-features.md` (section 13.2)

**Feature Files**:
- `src/features/supportTicket/supportTicket.rules.js` - Ticket creation rules, status transition rules, SLA rules
- `src/features/supportTicket/supportTicket.model.js` - Support ticket model, comment model, history model
- `src/features/supportTicket/supportTicket.api.js` - Call `/api/v1/support-tickets/*` and related endpoints
- `src/features/supportTicket/supportTicket.usecase.js` - Create ticket, add comment, update status, close ticket, list tickets
- `src/store/slices/supportTicket.slice.js` - Support ticket state (tickets, comments, history, status, error codes)
- `src/hooks/useSupportTickets.js` - Expose `{ tickets, createTicket, addComment, updateStatus, closeTicket, error }`

**Business Rules**:
- Ticket creation validation (category, priority, description)
- Status transition rules (Open → In Progress → Resolved → Closed)
- SLA tracking rules (response time, resolution time)
- Comment rules (attachments, internal notes)
- Priority rules (high, medium, low)

**Tests (mandatory)**:
- `src/__tests__/features/supportTicket/supportTicket.rules.test.js` (100% coverage)
- `src/__tests__/features/supportTicket/supportTicket.model.test.js` (100% coverage)
- `src/__tests__/features/supportTicket/supportTicket.api.test.js` (mock apiClient)
- `src/__tests__/features/supportTicket/supportTicket.usecase.test.js` (error paths)
- `src/__tests__/store/slices/supportTicket.slice.test.js` (state transitions)
- `src/__tests__/hooks/useSupportTickets.test.js` (selector/dispatch interactions)

---

### Step 11.16: Dispute Feature
**Goal**: Implement dispute resolution system per write-up section 15.4 and backend `/api/v1/disputes` endpoints.

**Backend API**: `/api/v1/disputes/*`, `/api/v1/dispute-comments/*`, `/api/v1/dispute-histories/*` (create, list, get, update, comment, resolve)

**Write-up Reference**: `write-up/15-operational-admin-features.md` (section 13.4)

**Feature Files**:
- `src/features/dispute/dispute.rules.js` - Dispute creation rules, status transition rules, resolution rules
- `src/features/dispute/dispute.model.js` - Dispute model, comment model, history model
- `src/features/dispute/dispute.api.js` - Call `/api/v1/disputes/*` and related endpoints
- `src/features/dispute/dispute.usecase.js` - Create dispute, add comment, update status, resolve dispute, list disputes
- `src/store/slices/dispute.slice.js` - Dispute state (disputes, comments, history, status, error codes)
- `src/hooks/useDisputes.js` - Expose `{ disputes, createDispute, addComment, updateStatus, resolveDispute, error }`

**Business Rules**:
- Dispute creation validation (order must exist, reason required)
- Status transition rules (Open → Under Review → Resolved → Closed)
- Mediation rules (communication channels)
- Escalation rules (unresolved disputes)
- Resolution rules (refund, replacement, etc.)

**Tests (mandatory)**:
- `src/__tests__/features/dispute/dispute.rules.test.js` (100% coverage)
- `src/__tests__/features/dispute/dispute.model.test.js` (100% coverage)
- `src/__tests__/features/dispute/dispute.api.test.js` (mock apiClient)
- `src/__tests__/features/dispute/dispute.usecase.test.js` (error paths)
- `src/__tests__/store/slices/dispute.slice.test.js` (state transitions)
- `src/__tests__/hooks/useDisputes.test.js` (selector/dispatch interactions)

---

### Step 11.17: Promotion Feature
**Goal**: Implement promotion management per backend `/api/v1/promotions` endpoints.

**Backend API**: `/api/v1/promotions/*` (create, list, get, update, delete, apply)

**Write-up Reference**: `write-up/16-marketing-growth-strategy.md`

**Feature Files**:
- `src/features/promotion/promotion.rules.js` - Promotion validation, discount rules, eligibility rules, expiry rules
- `src/features/promotion/promotion.model.js` - Promotion model, discount model
- `src/features/promotion/promotion.api.js` - Call `/api/v1/promotions/*` endpoints
- `src/features/promotion/promotion.usecase.js` - Create promotion, apply promotion, list promotions, validate promotion
- `src/store/slices/promotion.slice.js` - Promotion state (promotions, active promotions, error codes)
- `src/hooks/usePromotions.js` - Expose `{ promotions, createPromotion, applyPromotion, validatePromotion, error }`

**Business Rules**:
- Promotion validation (discount amount, expiry date, eligibility)
- Discount calculation rules (percentage, fixed amount, buy-one-get-one)
- Eligibility rules (products, categories, users, subscription tiers)
- Expiry date validation
- Usage limit rules

**Tests (mandatory)**:
- `src/__tests__/features/promotion/promotion.rules.test.js` (100% coverage)
- `src/__tests__/features/promotion/promotion.model.test.js` (100% coverage)
- `src/__tests__/features/promotion/promotion.api.test.js` (mock apiClient)
- `src/__tests__/features/promotion/promotion.usecase.test.js` (error paths)
- `src/__tests__/store/slices/promotion.slice.test.js` (state transitions)
- `src/__tests__/hooks/usePromotions.test.js` (selector/dispatch interactions)

---

### Step 11.18: Coupon Redemption Feature
**Goal**: Implement coupon redemption per backend `/api/v1/coupon-redemptions` endpoints.

**Backend API**: `/api/v1/coupon-redemptions/*` (create, list, get, validate)

**Write-up Reference**: `write-up/16-marketing-growth-strategy.md`

**Feature Files**:
- `src/features/couponRedemption/couponRedemption.rules.js` - Coupon validation, redemption rules, usage limit rules
- `src/features/couponRedemption/couponRedemption.model.js` - Coupon redemption model
- `src/features/couponRedemption/couponRedemption.api.js` - Call `/api/v1/coupon-redemptions/*` endpoints
- `src/features/couponRedemption/couponRedemption.usecase.js` - Validate coupon, redeem coupon, list redemptions
- `src/store/slices/couponRedemption.slice.js` - Coupon redemption state (redemptions, error codes)
- `src/hooks/useCouponRedemptions.js` - Expose `{ redemptions, validateCoupon, redeemCoupon, error }`

**Business Rules**:
- Coupon code validation
- Redemption eligibility rules
- Usage limit rules (one-time, multi-use, per-user limits)
- Expiry date validation
- Minimum purchase amount rules

**Tests (mandatory)**:
- `src/__tests__/features/couponRedemption/couponRedemption.rules.test.js` (100% coverage)
- `src/__tests__/features/couponRedemption/couponRedemption.model.test.js` (100% coverage)
- `src/__tests__/features/couponRedemption/couponRedemption.api.test.js` (mock apiClient)
- `src/__tests__/features/couponRedemption/couponRedemption.usecase.test.js` (error paths)
- `src/__tests__/store/slices/couponRedemption.slice.test.js` (state transitions)
- `src/__tests__/hooks/useCouponRedemptions.test.js` (selector/dispatch interactions)

---

### Step 11.19: Loyalty Program Feature
**Goal**: Implement loyalty program (points, badges, transactions) per backend `/api/v1/loyalty-*` endpoints.

**Backend API**: `/api/v1/loyalty-points/*`, `/api/v1/loyalty-transactions/*`, `/api/v1/loyalty-badges/*`, `/api/v1/user-loyalty-badges/*` (earn, redeem, list, badges)

**Write-up Reference**: `write-up/16-marketing-growth-strategy.md` (section 14.2)

**Feature Files**:
- `src/features/loyalty/loyalty.rules.js` - Points earning rules, redemption rules, badge rules, tier rules
- `src/features/loyalty/loyalty.model.js` - Loyalty points model, transaction model, badge model
- `src/features/loyalty/loyalty.api.js` - Call loyalty endpoints
- `src/features/loyalty/loyalty.usecase.js` - Earn points, redeem points, get badges, list transactions
- `src/store/slices/loyalty.slice.js` - Loyalty state (points, transactions, badges, tier, error codes)
- `src/hooks/useLoyalty.js` - Expose `{ points, earnPoints, redeemPoints, badges, tier, error }`

**Business Rules**:
- Points earning rules (purchase amount, activities)
- Points redemption rules (minimum redemption, conversion rates)
- Badge earning rules (milestones, achievements)
- Tier calculation rules (bronze, silver, gold, platinum)
- Transaction validation rules

**Tests (mandatory)**:
- `src/__tests__/features/loyalty/loyalty.rules.test.js` (100% coverage)
- `src/__tests__/features/loyalty/loyalty.model.test.js` (100% coverage)
- `src/__tests__/features/loyalty/loyalty.api.test.js` (mock apiClient)
- `src/__tests__/features/loyalty/loyalty.usecase.test.js` (error paths)
- `src/__tests__/store/slices/loyalty.slice.test.js` (state transitions)
- `src/__tests__/hooks/useLoyalty.test.js` (selector/dispatch interactions)

---

### Step 11.20: Referral & Affiliate Feature
**Goal**: Implement referral and affiliate system per write-up section 16.1 and backend `/api/v1/referral-*` and `/api/v1/affiliate-*` endpoints.

**Backend API**: `/api/v1/referral-codes/*`, `/api/v1/referrals/*`, `/api/v1/affiliate-links/*`, `/api/v1/affiliate-commissions/*` (create, list, get, track, commission)

**Write-up Reference**: `write-up/16-marketing-growth-strategy.md` (section 14.1)

**Feature Files**:
- `src/features/referral/referral.rules.js` - Referral code rules, commission rules, tracking rules
- `src/features/referral/referral.model.js` - Referral code model, referral model, affiliate link model, commission model
- `src/features/referral/referral.api.js` - Call referral and affiliate endpoints
- `src/features/referral/referral.usecase.js` - Create referral code, track referral, create affiliate link, calculate commission
- `src/store/slices/referral.slice.js` - Referral state (codes, referrals, affiliate links, commissions, error codes)
- `src/hooks/useReferrals.js` - Expose `{ referralCodes, createReferralCode, trackReferral, affiliateLinks, commissions, error }`

**Business Rules**:
- Referral code generation rules (unique, format validation)
- Commission calculation rules (percentage, fixed amount)
- Tracking rules (click tracking, conversion tracking)
- Affiliate link validation
- Commission payout rules

**Tests (mandatory)**:
- `src/__tests__/features/referral/referral.rules.test.js` (100% coverage)
- `src/__tests__/features/referral/referral.model.test.js` (100% coverage)
- `src/__tests__/features/referral/referral.api.test.js` (mock apiClient)
- `src/__tests__/features/referral/referral.usecase.test.js` (error paths)
- `src/__tests__/store/slices/referral.slice.test.js` (state transitions)
- `src/__tests__/hooks/useReferrals.test.js` (selector/dispatch interactions)

---

### Step 11.21: Media Asset Feature
**Goal**: Implement media asset management (images, documents) per backend `/api/v1/media-assets` endpoints.

**Backend API**: `/api/v1/media-assets/*` (upload, list, get, delete)

**Write-up Reference**: `write-up/05-product-catalog-search.md` (section 3.1)

**Feature Files**:
- `src/features/mediaAsset/mediaAsset.rules.js` - File validation rules, size limits, type validation
- `src/features/mediaAsset/mediaAsset.model.js` - Media asset model
- `src/features/mediaAsset/mediaAsset.api.js` - Call `/api/v1/media-assets/*` endpoints
- `src/features/mediaAsset/mediaAsset.usecase.js` - Upload asset, delete asset, list assets, get asset
- `src/store/slices/mediaAsset.slice.js` - Media asset state (assets, upload progress, error codes)
- `src/hooks/useMediaAssets.js` - Expose `{ assets, uploadAsset, deleteAsset, getAsset, error }`

**Business Rules**:
- File type validation (images, PDFs, documents)
- File size limits
- Upload progress tracking
- Asset deletion rules (cannot delete if in use)

**Tests (mandatory)**:
- `src/__tests__/features/mediaAsset/mediaAsset.rules.test.js` (100% coverage)
- `src/__tests__/features/mediaAsset/mediaAsset.model.test.js` (100% coverage)
- `src/__tests__/features/mediaAsset/mediaAsset.api.test.js` (mock apiClient)
- `src/__tests__/features/mediaAsset/mediaAsset.usecase.test.js` (error paths)
- `src/__tests__/store/slices/mediaAsset.slice.test.js` (state transitions)
- `src/__tests__/hooks/useMediaAssets.test.js` (selector/dispatch interactions)

---

### Step 11.22: Price History Feature
**Goal**: Implement price history tracking per backend `/api/v1/price-history` endpoints.

**Backend API**: `/api/v1/price-history/*` (list, get, track)

**Write-up Reference**: `write-up/05-product-catalog-search.md` (section 3.2)

**Feature Files**:
- `src/features/priceHistory/priceHistory.rules.js` - Price tracking rules, history validation rules
- `src/features/priceHistory/priceHistory.model.js` - Price history model
- `src/features/priceHistory/priceHistory.api.js` - Call `/api/v1/price-history/*` endpoints
- `src/features/priceHistory/priceHistory.usecase.js` - Track price change, get price history, list price changes
- `src/store/slices/priceHistory.slice.js` - Price history state (history, current price, error codes)
- `src/hooks/usePriceHistory.js` - Expose `{ priceHistory, trackPriceChange, getHistory, error }`

**Business Rules**:
- Price change tracking rules
- History retention rules
- Price drop detection rules
- Price alert rules (if integrated with notifications)

**Tests (mandatory)**:
- `src/__tests__/features/priceHistory/priceHistory.rules.test.js` (100% coverage)
- `src/__tests__/features/priceHistory/priceHistory.model.test.js` (100% coverage)
- `src/__tests__/features/priceHistory/priceHistory.api.test.js` (mock apiClient)
- `src/__tests__/features/priceHistory/priceHistory.usecase.test.js` (error paths)
- `src/__tests__/store/slices/priceHistory.slice.test.js` (state transitions)
- `src/__tests__/hooks/usePriceHistory.test.js` (selector/dispatch interactions)

---

### Step 11.23: Integration Log Feature
**Goal**: Implement integration logging per backend `/api/v1/integration-logs` endpoints.

**Backend API**: `/api/v1/integration-logs/*` (list, get, create)

**Write-up Reference**: `write-up/13-integrations.md`

**Feature Files**:
- `src/features/integrationLog/integrationLog.rules.js` - Log validation rules, log level rules
- `src/features/integrationLog/integrationLog.model.js` - Integration log model
- `src/features/integrationLog/integrationLog.api.js` - Call `/api/v1/integration-logs/*` endpoints
- `src/features/integrationLog/integrationLog.usecase.js` - Create log, list logs, get log details
- `src/store/slices/integrationLog.slice.js` - Integration log state (logs, error codes)
- `src/hooks/useIntegrationLogs.js` - Expose `{ logs, createLog, getLogs, error }`

**Business Rules**:
- Log level validation (info, warn, error)
- Integration type validation
- Log retention rules
- Log filtering rules

**Tests (mandatory)**:
- `src/__tests__/features/integrationLog/integrationLog.rules.test.js` (100% coverage)
- `src/__tests__/features/integrationLog/integrationLog.model.test.js` (100% coverage)
- `src/__tests__/features/integrationLog/integrationLog.api.test.js` (mock apiClient)
- `src/__tests__/features/integrationLog/integrationLog.usecase.test.js` (error paths)
- `src/__tests__/store/slices/integrationLog.slice.test.js` (state transitions)
- `src/__tests__/hooks/useIntegrationLogs.test.js` (selector/dispatch interactions)

---

### Step 11.24: Enhanced Authentication (MFA & OAuth) Feature
**Goal**: Implement MFA and OAuth authentication per write-up section 4.3 and backend `/api/v1/user-mfas` and `/api/v1/oauth-accounts` endpoints.

**Backend API**: `/api/v1/user-mfas/*`, `/api/v1/oauth-accounts/*` (setup, verify, enable, disable, link, unlink)

**Write-up Reference**: `write-up/04-user-management-authentication.md` (section 3.3), `write-up/10-security-privacy-compliance.md` (section 8.1)

**Feature Files**:
- `src/features/enhancedAuth/enhancedAuth.rules.js` - MFA setup rules, OAuth validation rules, security rules
- `src/features/enhancedAuth/enhancedAuth.model.js` - MFA model, OAuth account model
- `src/features/enhancedAuth/enhancedAuth.api.js` - Call `/api/v1/user-mfas/*` and `/api/v1/oauth-accounts/*` endpoints
- `src/features/enhancedAuth/enhancedAuth.usecase.js` - Setup MFA, verify MFA, enable/disable MFA, link OAuth, unlink OAuth
- `src/store/slices/enhancedAuth.slice.js` - Enhanced auth state (MFA status, OAuth accounts, error codes)
- `src/hooks/useEnhancedAuth.js` - Expose `{ mfaStatus, setupMFA, verifyMFA, oauthAccounts, linkOAuth, error }`

**Business Rules**:
- MFA setup validation (SMS or Authenticator App)
- MFA verification rules (OTP validation)
- OAuth linking rules (Google, Microsoft, LinkedIn)
- Security rules (mandatory for vendors/admins)
- Account security rules (login history, active sessions)

**Tests (mandatory)**:
- `src/__tests__/features/enhancedAuth/enhancedAuth.rules.test.js` (100% coverage)
- `src/__tests__/features/enhancedAuth/enhancedAuth.model.test.js` (100% coverage)
- `src/__tests__/features/enhancedAuth/enhancedAuth.api.test.js` (mock apiClient)
- `src/__tests__/features/enhancedAuth/enhancedAuth.usecase.test.js` (error paths)
- `src/__tests__/store/slices/enhancedAuth.slice.test.js` (state transitions)
- `src/__tests__/hooks/useEnhancedAuth.test.js` (selector/dispatch interactions)

---

## Completion Criteria
- ✅ All 24 biomed-specific and advanced features implemented following template structure
- ✅ All features have 100% test coverage for rules/models
- ✅ All features have high test coverage for api/usecase/slice/hook
- ✅ All features expose hooks for UI access
- ✅ No UI imports in features/store/services
- ✅ All errors are normalized error codes
- ✅ All features integrate with backend API endpoints
- ✅ Compliance features respect security and privacy requirements
- ✅ No sensitive data leaks in logs/errors

**Next Phase**: `P012_finalization.md` (Onboarding, help system, comprehensive testing, and polish)
