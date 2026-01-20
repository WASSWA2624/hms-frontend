# Phase 9: Feature Implementation (Core Marketplace Features)

## Purpose
Implement the **core marketplace features** as defined in the write-up and backend API. Each step implements one complete feature following the feature template structure. These features form the foundation of the biomedical marketplace platform.

## Rule References
- `.cursor/rules/features-domain.mdc` (Feature Template Structure - **MANDATORY**)
- `.cursor/rules/state-management.mdc`
- `.cursor/rules/services-integration.mdc`
- `.cursor/rules/errors-logging.mdc`
- `.cursor/rules/i18n.mdc`
- `.cursor/rules/testing.mdc`
- `.cursor/rules/security.mdc`

## Prerequisites
- Phase 7 completed (app shell exists)
- `@services/api` client exists (Phase 2)
- Errors layer exists (Phase 1)
- Shared utilities exist (URL helpers, pagination, Zod helpers, error codes)

## Feature Development Contract (mandatory for each step)
**Each feature must follow the template structure defined in `.cursor/rules/features-domain.mdc` (Feature Template Structure section)**.

**Testing Requirements**:
- **Rules/models:** Absolutely require **100% test coverage**, including all branches and edge cases; no exceptions permitted.
- **API/usecase/slice/hook:** Test coverage must be as close to 100% as possible, with special emphasis on error handling, failure scenarios, and alternate flows—not just the "happy path."
- **Service, storage, and time dependencies:** All such dependencies must be thoroughly mocked in tests; no real network, storage, or system time may be used.
- **Test rigor:** Tests should be rigorous—deliberately probe all possible error states, invalid data, boundary conditions, and side effects to expose incorrect assumptions or implementation bugs.
- **Test quality:** Trivial or superficial tests are not permitted; each test must assert something meaningful about the feature's behavior as defined by the business rules and models.

**Definition of Done** (per feature):
- ✅ All template files exist and follow structure
- ✅ Unit tests pass with required coverage
- ✅ No UI imports in features/store/services
- ✅ No raw errors in Redux state (error codes only)
- ✅ Errors are normalized and domain-specific
- ✅ All public APIs exported via `index.js`

## Steps

### Step 9.1: Auth Feature

**Goal**: Implement authentication (login, register, logout, refresh, password reset) per write-up section 4 and backend `/api/v1/auth` endpoints.

**Backend API**: `/api/v1/auth/*` (login, register, verify-email, verify-phone, forgot-password, reset-password, change-password, refresh-token, logout)

**Write-up Reference**: `write-up/04-user-management-authentication.md`

**Feature Files**:
- `src/features/auth/auth.rules.js` - Password validation, role checks, session rules
- `src/features/auth/auth.model.js` - User model, token model, normalize auth responses
- `src/features/auth/auth.api.js` - Call `/api/v1/auth/*` endpoints
- `src/features/auth/auth.usecase.js` - Login, register, logout, refresh, password reset flows
- `src/store/slices/auth.slice.js` - Auth state (user, tokens metadata, error codes)
- `src/hooks/useAuth.js` - Expose `{ user, login, logout, register, isAuthenticated, error }`

**Business Rules**:
- Password strength validation
- Email/phone verification rules
- Token refresh logic
- Session management rules
- MFA requirements (if applicable)

**Tests (mandatory)**:
- `src/__tests__/features/auth/auth.rules.test.js` (100% coverage)
- `src/__tests__/features/auth/auth.model.test.js` (100% coverage)
- `src/__tests__/features/auth/auth.api.test.js` (mock apiClient)
- `src/__tests__/features/auth/auth.usecase.test.js` (error paths)
- `src/__tests__/store/slices/auth.slice.test.js` (state transitions)
- `src/__tests__/hooks/useAuth.test.js` (selector/dispatch interactions)

---

### Step 9.2: User Feature
**Goal**: Implement user management (profile, roles, company management) per write-up section 4 and backend `/api/v1/users` endpoints.

**Backend API**: `/api/v1/users/*` (profile, update, roles, company management)

**Write-up Reference**: `write-up/04-user-management-authentication.md` (sections 3.1, 3.4)

**Feature Files**:
- `src/features/user/user.rules.js` - Role validation, profile update rules, company access rules
- `src/features/user/user.model.js` - User profile model, role model, company model
- `src/features/user/user.api.js` - Call `/api/v1/users/*` endpoints
- `src/features/user/user.usecase.js` - Fetch profile, update profile, manage roles, company operations
- `src/store/slices/user.slice.js` - User state (profile, roles, company, error codes)
- `src/hooks/useUser.js` - Expose `{ profile, updateProfile, roles, company, error }`

**Business Rules**:
- Role-based access control (GUEST, BUYER, BIOMED, VENDOR, MEDICAL_WORKER, APP_ADMIN, COMPANY_ADMIN)
- Profile update validation
- Company creation/management rules
- Team invitation rules

**Tests (mandatory)**:
- `src/__tests__/features/user/user.rules.test.js` (100% coverage)
- `src/__tests__/features/user/user.model.test.js` (100% coverage)
- `src/__tests__/features/user/user.api.test.js` (mock apiClient)
- `src/__tests__/features/user/user.usecase.test.js` (error paths)
- `src/__tests__/store/slices/user.slice.test.js` (state transitions)
- `src/__tests__/hooks/useUser.test.js` (selector/dispatch interactions)

---

### Step 9.3: Product Feature
**Goal**: Implement product catalog (listing, search, filters, details) per write-up section 5 and backend `/api/v1/products` endpoints.

**Backend API**: `/api/v1/products/*` (list, search, get, create, update, delete, filters, categories, attributes, media, suppliers, compatibility, price-history, comments, inventory)

**Write-up Reference**: `write-up/05-product-catalog-search.md`

**Feature Files**:
- `src/features/product/product.rules.js` - Search validation, filter rules, category rules, price validation, subscription tier gating rules
- `src/features/product/product.model.js` - Product model, category model, search result model
- `src/features/product/product.api.js` - Call `/api/v1/products/*` endpoints
- `src/features/product/product.usecase.js` - Search, list, get details, filter, category operations, AI-powered features (subscription-gated)
- `src/store/slices/product.slice.js` - Product state (list, current, filters, search, error codes)
- `src/hooks/useProducts.js` - Expose `{ products, search, filters, categories, error }`

**Business Rules**:
- Search query validation
- Filter combination rules
- Category hierarchy rules
- Price range validation
- Stock availability rules
- Regulatory code validation
- Subscription tier gating (AI features: recommendations, compatibility checking, natural language search, visual search - see write-up section 5.4)
- AI feature access rules (Free: none, Professional: basic recommendations, Enterprise/Vendor: full AI suite)

**Tests (mandatory)**:
- `src/__tests__/features/product/product.rules.test.js` (100% coverage)
- `src/__tests__/features/product/product.model.test.js` (100% coverage)
- `src/__tests__/features/product/product.api.test.js` (mock apiClient)
- `src/__tests__/features/product/product.usecase.test.js` (error paths)
- `src/__tests__/store/slices/product.slice.test.js` (state transitions)
- `src/__tests__/hooks/useProducts.test.js` (selector/dispatch interactions)

---

### Step 9.4: Cart Feature
**Goal**: Implement shopping cart (add, update, remove, multi-vendor support) per write-up section 6.1 and backend `/api/v1/carts` endpoints.

**Backend API**: `/api/v1/carts/*` (GET `/`, POST `/`, GET `/:id`, PUT `/:id`, DELETE `/:id`, GET `/:id/items`, POST `/:id/items`, PUT `/:id/items/:productId`, DELETE `/:id/items/:productId`, POST `/:id/request-quote`)

**Write-up Reference**: `write-up/06-ordering-checkout-interaction.md` (section 4.1, 4.2)

**Feature Files**:
- `src/features/cart/cart.rules.js` - Quantity validation, stock checks, multi-vendor rules, batch/lot selection rules, cart-to-RFQ conversion rules, cart sharing rules
- `src/features/cart/cart.model.js` - Cart model, cart item model, normalize cart responses
- `src/features/cart/cart.api.js` - Call `/api/v1/carts/*` endpoints
- `src/features/cart/cart.usecase.js` - Add to cart, update quantity, remove item, clear cart, save for later, convert cart to RFQ, share cart
- `src/store/slices/cart.slice.js` - Cart state (items, totals, vendors, error codes)
- `src/hooks/useCart.js` - Expose `{ cart, addItem, updateItem, removeItem, clearCart, convertToRFQ, shareCart, totals, error }`

**Business Rules**:
- Quantity validation (min/max, stock availability)
- Multi-vendor cart rules
- Batch/lot number selection for medical consumables
- Price calculation rules (discounts, bulk pricing)
- Real-time inventory validation
- Cart-to-RFQ conversion rules (one-click conversion for large orders per write-up section 6.2)
- Cart sharing rules (save carts and share with colleagues for approval per write-up section 6.1)

**Tests (mandatory)**:
- `src/__tests__/features/cart/cart.rules.test.js` (100% coverage)
- `src/__tests__/features/cart/cart.model.test.js` (100% coverage)
- `src/__tests__/features/cart/cart.api.test.js` (mock apiClient)
- `src/__tests__/features/cart/cart.usecase.test.js` (error paths)
- `src/__tests__/store/slices/cart.slice.test.js` (state transitions)
- `src/__tests__/hooks/useCart.test.js` (selector/dispatch interactions)

---

### Step 9.5: Order Feature
**Goal**: Implement order management (create, list, detail, status tracking) per write-up section 6.4 and backend `/api/v1/orders` endpoints.

**Backend API**: `/api/v1/orders/*` (GET `/`, POST `/`, GET `/:id`, PUT `/:id`, DELETE `/:id`, GET `/:id/items`, GET `/:id/payments`, GET `/:id/shipments`, GET `/:id/returns`, POST `/:id/cancel`, GET `/:id/tracking`)

**Write-up Reference**: `write-up/06-ordering-checkout-interaction.md` (section 4.4)

**Feature Files**:
- `src/features/order/order.rules.js` - Order creation validation, status transition rules, cancellation rules
- `src/features/order/order.model.js` - Order model, order item model, status model
- `src/features/order/order.api.js` - Call `/api/v1/orders/*` endpoints and sub-resources
- `src/features/order/order.usecase.js` - Create order, list orders, get order details, get order items, get order payments, get order shipments, get order returns, update status, cancel, track order
- `src/store/slices/order.slice.js` - Order state (current order, order list, status, error codes)
- `src/hooks/useOrders.js` - Expose `{ orders, createOrder, getOrder, getOrderItems, getOrderPayments, getOrderShipments, getOrderReturns, updateStatus, cancelOrder, trackOrder, error }`

**Business Rules**:
- Order creation validation (cart must exist, items in stock)
- Status transition rules (PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED → IN_USE → COMPLETED, or CANCELLED/RETURNED per write-up section 6.4)
- Cancellation rules (only before shipping)
- Multi-vendor order splitting rules
- Shipping address validation

**Tests (mandatory)**:
- `src/__tests__/features/order/order.rules.test.js` (100% coverage)
- `src/__tests__/features/order/order.model.test.js` (100% coverage)
- `src/__tests__/features/order/order.api.test.js` (mock apiClient)
- `src/__tests__/features/order/order.usecase.test.js` (error paths)
- `src/__tests__/store/slices/order.slice.test.js` (state transitions)
- `src/__tests__/hooks/useOrders.test.js` (selector/dispatch interactions)

---

### Step 9.6: Payment Feature
**Goal**: Implement payment processing (intent, process, verify, refund) per write-up section 6.3 and backend `/api/v1/payments` endpoints.

**Backend API**: `/api/v1/payments/*` (GET `/`, POST `/`, GET `/:id`, PUT `/:id`, DELETE `/:id`, GET `/:id/refunds`, POST `/:id/refund`), `/api/v1/order-payment-methods/*`, `/api/v1/payment-method-requests/*`

**Write-up Reference**: `write-up/06-ordering-checkout-interaction.md` (section 4.3), `write-up/09-subscription-monetization.md` (section 7.4)

**Feature Files**:
- `src/features/payment/payment.rules.js` - Amount validation, currency rules, payment method validation, refund rules, payment method request rules
- `src/features/payment/payment.model.js` - Payment model, payment method model, transaction model, payment method request model
- `src/features/payment/payment.api.js` - Call `/api/v1/payments/*`, `/api/v1/order-payment-methods/*`, `/api/v1/payment-method-requests/*` endpoints
- `src/features/payment/payment.usecase.js` - Create payment, list payments, get payment, update payment, delete payment, get refunds, create refund, manage payment methods, request payment method
- `src/store/slices/payment.slice.js` - Payment state (current payment, payment history, payment methods, payment method requests, error codes)
- `src/hooks/usePayments.js` - Expose `{ payment, payments, processPayment, verifyPayment, refund, paymentMethods, requestPaymentMethod, error }`

**Business Rules**:
- Amount validation (min/max, currency conversion)
- Payment method validation (cards, digital wallets, local methods, PO, net terms, lease-to-own per write-up section 6.3)
- Payment status rules (AUTHORIZED → CAPTURED → FAILED/REFUNDED/VOIDED)
- Refund rules (only for completed payments, within time window)
- Multi-currency support rules
- Payment method request system (users can request new payment methods per write-up section 9.4)
- Payment method request validation (name, region, use case, provider contact)

**Tests (mandatory)**:
- `src/__tests__/features/payment/payment.rules.test.js` (100% coverage)
- `src/__tests__/features/payment/payment.model.test.js` (100% coverage)
- `src/__tests__/features/payment/payment.api.test.js` (mock apiClient)
- `src/__tests__/features/payment/payment.usecase.test.js` (error paths)
- `src/__tests__/store/slices/payment.slice.test.js` (state transitions)
- `src/__tests__/hooks/usePayments.test.js` (selector/dispatch interactions)

---

### Step 9.7: Shop Feature
**Goal**: Implement shop/vendor management (CRUD, products, orders) per write-up section 7 and backend `/api/v1/shops` endpoints.

**Backend API**: `/api/v1/shops/*` (GET `/`, POST `/`, GET `/:id`, PUT `/:id`, DELETE `/:id`, GET `/:id/products`, GET `/:id/media`, POST `/:id/media`, DELETE `/:id/media/:mediaId`, GET `/:id/quote-requests`, GET `/:id/orders`, GET `/:id/owner`)

**Write-up Reference**: `write-up/07-shop-vendor-management.md`

**Feature Files**:
- `src/features/shop/shop.rules.js` - Shop creation rules, ownership validation, vendor access rules, media management rules
- `src/features/shop/shop.model.js` - Shop model, vendor model, shop products model, shop media model
- `src/features/shop/shop.api.js` - Call `/api/v1/shops/*` endpoints and sub-resources
- `src/features/shop/shop.usecase.js` - Create shop, update shop, get shop, list shops, manage products, manage media, get quote requests, get orders, get owner
- `src/store/slices/shop.slice.js` - Shop state (current shop, shop list, products, media, error codes)
- `src/hooks/useShops.js` - Expose `{ shops, createShop, updateShop, getShop, shopProducts, shopMedia, shopQuoteRequests, shopOrders, error }`

**Business Rules**:
- Shop creation rules (vendor role required, business documents)
- Ownership validation (only owner/admin can modify)
- Shop status rules (Pending → Approved → Active)
- Product management rules (only shop owner can add products)
- Vendor analytics access rules
- Shop media management rules (logo, banner, gallery per write-up section 7.2)

**Tests (mandatory)**:
- `src/__tests__/features/shop/shop.rules.test.js` (100% coverage)
- `src/__tests__/features/shop/shop.model.test.js` (100% coverage)
- `src/__tests__/features/shop/shop.api.test.js` (mock apiClient)
- `src/__tests__/features/shop/shop.usecase.test.js` (error paths)
- `src/__tests__/store/slices/shop.slice.test.js` (state transitions)
- `src/__tests__/hooks/useShops.test.js` (selector/dispatch interactions)

---

### Step 9.8: Subscription Feature
**Goal**: Implement subscription management (plans, subscribe, cancel, upgrade) per write-up section 9 and backend `/api/v1/subscriptions` endpoints.

**Backend API**: `/api/v1/subscriptions/*`, `/api/v1/subscription-plans/*` (plans, subscribe, cancel, upgrade, usage)

**Write-up Reference**: `write-up/09-subscription-monetization.md`

**Feature Files**:
- `src/features/subscription/subscription.rules.js` - Plan validation, subscription rules, tier gating rules, upgrade/downgrade rules
- `src/features/subscription/subscription.model.js` - Subscription model, plan model, usage model
- `src/features/subscription/subscription.api.js` - Call `/api/v1/subscriptions/*` and `/api/v1/subscription-plans/*` endpoints
- `src/features/subscription/subscription.usecase.js` - Get plans, subscribe, cancel, upgrade, check usage, check feature access
- `src/store/slices/subscription.slice.js` - Subscription state (current plan, plans, usage, error codes)
- `src/hooks/useSubscriptions.js` - Expose `{ subscription, plans, subscribe, cancel, upgrade, hasFeature, error }`

**Business Rules**:
- Plan tier validation (Free, Professional, Enterprise, Vendor)
- Feature gating rules (AI features, advanced analytics, etc.)
- Subscription status rules (Active → Cancelled, Trial → Active)
- Upgrade/downgrade rules (proration, feature access changes)
- Usage tracking rules (API calls, uploads, etc.)

**Tests (mandatory)**:
- `src/__tests__/features/subscription/subscription.rules.test.js` (100% coverage)
- `src/__tests__/features/subscription/subscription.model.test.js` (100% coverage)
- `src/__tests__/features/subscription/subscription.api.test.js` (mock apiClient)
- `src/__tests__/features/subscription/subscription.usecase.test.js` (error paths)
- `src/__tests__/store/slices/subscription.slice.test.js` (state transitions)
- `src/__tests__/hooks/useSubscriptions.test.js` (selector/dispatch interactions)

---

### Step 9.9: Quote Request (RFQ) Feature
**Goal**: Implement quote request system (create, manage, negotiate) per write-up section 6.2 and backend `/api/v1/quote-requests` endpoints.

**Backend API**: `/api/v1/quote-requests/*` (create, list, get, update, respond, compare)

**Write-up Reference**: `write-up/06-ordering-checkout-interaction.md` (section 4.2)

**Feature Files**:
- `src/features/quoteRequest/quoteRequest.rules.js` - RFQ creation rules, vendor routing rules, negotiation rules, comparison rules
- `src/features/quoteRequest/quoteRequest.model.js` - Quote request model, quote response model, comparison model
- `src/features/quoteRequest/quoteRequest.api.js` - Call `/api/v1/quote-requests/*` endpoints
- `src/features/quoteRequest/quoteRequest.usecase.js` - Create RFQ, convert cart to RFQ, respond to RFQ, compare quotes, approve quote
- `src/store/slices/quoteRequest.slice.js` - Quote request state (requests, responses, comparisons, error codes)
- `src/hooks/useQuoteRequests.js` - Expose `{ quoteRequests, createRFQ, respondToRFQ, compareQuotes, error }`

**Business Rules**:
- RFQ creation validation (items, quantities, specifications)
- Multi-vendor routing rules
- Quote response validation
- Comparison matrix rules (Enterprise/Vendor tiers)
- Approval workflow rules
- Negotiation rules (counteroffers, document sharing)

**Tests (mandatory)**:
- `src/__tests__/features/quoteRequest/quoteRequest.rules.test.js` (100% coverage)
- `src/__tests__/features/quoteRequest/quoteRequest.model.test.js` (100% coverage)
- `src/__tests__/features/quoteRequest/quoteRequest.api.test.js` (mock apiClient)
- `src/__tests__/features/quoteRequest/quoteRequest.usecase.test.js` (error paths)
- `src/__tests__/store/slices/quoteRequest.slice.test.js` (state transitions)
- `src/__tests__/hooks/useQuoteRequests.test.js` (selector/dispatch interactions)

---

### Step 9.10: Review Feature
**Goal**: Implement product reviews and ratings per write-up section 8 and backend `/api/v1/product-reviews` endpoints.

**Backend API**: `/api/v1/product-reviews/*`, `/api/v1/vendor-review-responses/*`, `/api/v1/review-helpful-votes/*`, `/api/v1/review-media-assets/*` (create, list, get, update, vote, respond, manage media)

**Write-up Reference**: `write-up/08-reviews-ratings-approval.md` (section 6.1)

**Feature Files**:
- `src/features/review/review.rules.js` - Review validation, rating rules, verified purchaser rules, moderation rules, media asset rules
- `src/features/review/review.model.js` - Review model, rating model, vendor response model, review media asset model
- `src/features/review/review.api.js` - Call `/api/v1/product-reviews/*` and related endpoints including media assets
- `src/features/review/review.usecase.js` - Create review, list reviews, update review, vote helpful, vendor respond, manage review media (photos, videos per write-up section 6.1)
- `src/store/slices/review.slice.js` - Review state (reviews, ratings, responses, media, error codes)
- `src/hooks/useReviews.js` - Expose `{ reviews, createReview, updateReview, voteHelpful, respondToReview, manageReviewMedia, error }`

**Business Rules**:
- Verified purchaser validation (only purchasers can leave verified reviews)
- Multi-dimensional rating rules (quality, reliability, customer support, value, delivery)
- Review moderation rules (profanity, spam, PII detection)
- Vendor response rules
- Helpful vote rules
- Expert review rules (biomedical professionals)
- Review media asset rules (text, photo, and video reviews per write-up section 6.1)

**Tests (mandatory)**:
- `src/__tests__/features/review/review.rules.test.js` (100% coverage)
- `src/__tests__/features/review/review.model.test.js` (100% coverage)
- `src/__tests__/features/review/review.api.test.js` (mock apiClient)
- `src/__tests__/features/review/review.usecase.test.js` (error paths)
- `src/__tests__/store/slices/review.slice.test.js` (state transitions)
- `src/__tests__/hooks/useReviews.test.js` (selector/dispatch interactions)

---

### Step 9.11: Category Feature
**Goal**: Implement category management (hierarchical categories) per write-up section 5 and backend `/api/v1/categories` endpoints.

**Backend API**: `/api/v1/categories/*` (list, get, tree, products)

**Write-up Reference**: `write-up/05-product-catalog-search.md` (section 3.2)

**Feature Files**:
- `src/features/category/category.rules.js` - Category hierarchy rules, category validation, breadcrumb rules
- `src/features/category/category.model.js` - Category model, category tree model
- `src/features/category/category.api.js` - Call `/api/v1/categories/*` endpoints
- `src/features/category/category.usecase.js` - Get categories, get category tree, get category products, build breadcrumbs
- `src/store/slices/category.slice.js` - Category state (categories, tree, current category, error codes)
- `src/hooks/useCategories.js` - Expose `{ categories, categoryTree, getCategoryProducts, breadcrumbs, error }`

**Business Rules**:
- Category hierarchy validation (parent-child relationships)
- Category tree building rules
- Breadcrumb generation rules
- Category product filtering rules

**Tests (mandatory)**:
- `src/__tests__/features/category/category.rules.test.js` (100% coverage)
- `src/__tests__/features/category/category.model.test.js` (100% coverage)
- `src/__tests__/features/category/category.api.test.js` (mock apiClient)
- `src/__tests__/features/category/category.usecase.test.js` (error paths)
- `src/__tests__/store/slices/category.slice.test.js` (state transitions)
- `src/__tests__/hooks/useCategories.test.js` (selector/dispatch interactions)

---

### Step 9.12: Address Feature
**Goal**: Implement address management (shipping addresses) per write-up section 6.3 and backend `/api/v1/addresses` endpoints.

**Backend API**: `/api/v1/addresses/*` (create, list, get, update, delete, set-default)

**Write-up Reference**: `write-up/06-ordering-checkout-interaction.md` (section 4.3)

**Feature Files**:
- `src/features/address/address.rules.js` - Address validation, default address rules, shipping address rules
- `src/features/address/address.model.js` - Address model, normalize address responses
- `src/features/address/address.api.js` - Call `/api/v1/addresses/*` endpoints
- `src/features/address/address.usecase.js` - Create address, update address, delete address, set default, list addresses
- `src/store/slices/address.slice.js` - Address state (addresses, default address, error codes)
- `src/hooks/useAddresses.js` - Expose `{ addresses, defaultAddress, createAddress, updateAddress, deleteAddress, setDefault, error }`

**Business Rules**:
- Address format validation (country-specific rules)
- Default address rules (only one default per user)
- Shipping address validation (required fields, valid postal codes)
- Address deletion rules (cannot delete if used in active orders)

**Tests (mandatory)**:
- `src/__tests__/features/address/address.rules.test.js` (100% coverage)
- `src/__tests__/features/address/address.model.test.js` (100% coverage)
- `src/__tests__/features/address/address.api.test.js` (mock apiClient)
- `src/__tests__/features/address/address.usecase.test.js` (error paths)
- `src/__tests__/store/slices/address.slice.test.js` (state transitions)
- `src/__tests__/hooks/useAddresses.test.js` (selector/dispatch interactions)

---

### Step 9.13: Company Feature
**Goal**: Implement company management (company profiles, team management) per write-up section 4 and backend `/api/v1/companies` endpoints.

**Backend API**: `/api/v1/companies/*` (create, list, get, update, members, invitations)

**Write-up Reference**: `write-up/04-user-management-authentication.md` (section 3.4)

**Feature Files**:
- `src/features/company/company.rules.js` - Company creation rules, team management rules, invitation rules, access control rules
- `src/features/company/company.model.js` - Company model, company member model, invitation model
- `src/features/company/company.api.js` - Call `/api/v1/companies/*` endpoints
- `src/features/company/company.usecase.js` - Create company, update company, invite members, manage roles, list companies
- `src/store/slices/company.slice.js` - Company state (companies, current company, members, invitations, error codes)
- `src/hooks/useCompanies.js` - Expose `{ companies, createCompany, updateCompany, inviteMember, manageRoles, error }`

**Business Rules**:
- Company creation rules (COMPANY_ADMIN role required)
- Team invitation rules (email-based, role assignment)
- Access control rules (company admins manage users, shops, products)
- Company member role rules (admin, member, viewer)
- Consolidated analytics access rules

**Tests (mandatory)**:
- `src/__tests__/features/company/company.rules.test.js` (100% coverage)
- `src/__tests__/features/company/company.model.test.js` (100% coverage)
- `src/__tests__/features/company/company.api.test.js` (mock apiClient)
- `src/__tests__/features/company/company.usecase.test.js` (error paths)
- `src/__tests__/store/slices/company.slice.test.js` (state transitions)
- `src/__tests__/hooks/useCompanies.test.js` (selector/dispatch interactions)

---

### Step 9.14: Conversation/Message Feature
**Goal**: Implement buyer-seller messaging per write-up section 6.1 and backend `/api/v1/conversations` and `/api/v1/messages` endpoints.

**Backend API**: `/api/v1/conversations/*`, `/api/v1/messages/*` (create, list, get, send-message, mark-read)

**Write-up Reference**: `write-up/06-ordering-checkout-interaction.md` (section 4.1, 4.5)

**Feature Files**:
- `src/features/conversation/conversation.rules.js` - Conversation creation rules, message validation, read status rules
- `src/features/conversation/conversation.model.js` - Conversation model, message model, normalize messaging responses
- `src/features/conversation/conversation.api.js` - Call `/api/v1/conversations/*` and `/api/v1/messages/*` endpoints
- `src/features/conversation/conversation.usecase.js` - Create conversation, send message, list conversations, get messages, mark read
- `src/store/slices/conversation.slice.js` - Conversation state (conversations, messages, unread counts, error codes)
- `src/hooks/useConversations.js` - Expose `{ conversations, messages, createConversation, sendMessage, markRead, error }`

**Business Rules**:
- Conversation creation rules (buyer-seller pairs)
- Message validation (content, attachments)
- Read status rules (mark as read, unread counts)
- Real-time messaging rules (typing indicators, delivery status)
- Message moderation rules (profanity, spam detection)

**Tests (mandatory)**:
- `src/__tests__/features/conversation/conversation.rules.test.js` (100% coverage)
- `src/__tests__/features/conversation/conversation.model.test.js` (100% coverage)
- `src/__tests__/features/conversation/conversation.api.test.js` (mock apiClient)
- `src/__tests__/features/conversation/conversation.usecase.test.js` (error paths)
- `src/__tests__/store/slices/conversation.slice.test.js` (state transitions)
- `src/__tests__/hooks/useConversations.test.js` (selector/dispatch interactions)

---

### Step 9.15: Notification Feature
**Goal**: Implement notifications (real-time updates, alerts) per write-up section 6.5 and backend `/api/v1/notifications` endpoints.

**Backend API**: `/api/v1/notifications/*` (list, get, mark-read, mark-all-read, preferences)

**Write-up Reference**: `write-up/06-ordering-checkout-interaction.md` (section 4.5)

**Feature Files**:
- `src/features/notification/notification.rules.js` - Notification type rules, priority rules, preference rules
- `src/features/notification/notification.model.js` - Notification model, notification preference model
- `src/features/notification/notification.api.js` - Call `/api/v1/notifications/*` endpoints
- `src/features/notification/notification.usecase.js` - Get notifications, mark read, mark all read, update preferences, subscribe to real-time
- `src/store/slices/notification.slice.js` - Notification state (notifications, unread count, preferences, error codes)
- `src/hooks/useNotifications.js` - Expose `{ notifications, unreadCount, markRead, markAllRead, updatePreferences, error }`

**Business Rules**:
- Notification type rules (order updates, payment status, RFQ responses, messages, etc.)
- Priority rules (high, medium, low)
- Preference rules (email, SMS, push, in-app)
- Real-time notification rules (WebSocket integration)
- Notification grouping rules (group by type, time)

**Tests (mandatory)**:
- `src/__tests__/features/notification/notification.rules.test.js` (100% coverage)
- `src/__tests__/features/notification/notification.model.test.js` (100% coverage)
- `src/__tests__/features/notification/notification.api.test.js` (mock apiClient)
- `src/__tests__/features/notification/notification.usecase.test.js` (error paths)
- `src/__tests__/store/slices/notification.slice.test.js` (state transitions)
- `src/__tests__/hooks/useNotifications.test.js` (selector/dispatch interactions)

---

### Step 9.16: Shipment Feature
**Goal**: Implement shipment tracking per write-up section 6.4 and backend `/api/v1/shipments` endpoints.

**Backend API**: `/api/v1/shipments/*` (create, list, get, update-status, track)

**Write-up Reference**: `write-up/06-ordering-checkout-interaction.md` (section 4.4)

**Feature Files**:
- `src/features/shipment/shipment.rules.js` - Shipment creation rules, status transition rules, tracking rules
- `src/features/shipment/shipment.model.js` - Shipment model, tracking model, carrier model
- `src/features/shipment/shipment.api.js` - Call `/api/v1/shipments/*` endpoints
- `src/features/shipment/shipment.usecase.js` - Create shipment, update status, track shipment, get shipment history
- `src/store/slices/shipment.slice.js` - Shipment state (shipments, tracking, status, error codes)
- `src/hooks/useShipments.js` - Expose `{ shipments, createShipment, updateStatus, trackShipment, error }`

**Business Rules**:
- Shipment creation rules (order must exist, address validation)
- Status transition rules (Created → In Transit → Out for Delivery → Delivered)
- Tracking integration rules (carrier API integration)
- Real-time tracking updates
- Delivery confirmation rules

**Tests (mandatory)**:
- `src/__tests__/features/shipment/shipment.rules.test.js` (100% coverage)
- `src/__tests__/features/shipment/shipment.model.test.js` (100% coverage)
- `src/__tests__/features/shipment/shipment.api.test.js` (mock apiClient)
- `src/__tests__/features/shipment/shipment.usecase.test.js` (error paths)
- `src/__tests__/store/slices/shipment.slice.test.js` (state transitions)
- `src/__tests__/hooks/useShipments.test.js` (selector/dispatch interactions)

---

### Step 9.17: Return Feature
**Goal**: Implement return management per write-up section 6.4 and backend `/api/v1/returns` endpoints.

**Backend API**: `/api/v1/returns/*` (create, list, get, update-status, approve, reject)

**Write-up Reference**: `write-up/06-ordering-checkout-interaction.md` (section 4.4)

**Feature Files**:
- `src/features/return/return.rules.js` - Return creation rules, return reason validation, status transition rules, refund rules
- `src/features/return/return.model.js` - Return model, return item model, refund model
- `src/features/return/return.api.js` - Call `/api/v1/returns/*` endpoints
- `src/features/return/return.usecase.js` - Create return, approve return, reject return, update status, process refund
- `src/store/slices/return.slice.js` - Return state (returns, current return, status, error codes)
- `src/hooks/useReturns.js` - Expose `{ returns, createReturn, approveReturn, rejectReturn, updateStatus, error }`

**Business Rules**:
- Return creation rules (order must be delivered, within return window)
- Return reason validation (defect, wrong item, damaged, etc.)
- Status transition rules (Requested → Approved → Processing → Refunded/Rejected)
- Refund rules (full refund, partial refund, restocking fees)
- Return authorization rules (vendor approval required)

**Tests (mandatory)**:
- `src/__tests__/features/return/return.rules.test.js` (100% coverage)
- `src/__tests__/features/return/return.model.test.js` (100% coverage)
- `src/__tests__/features/return/return.api.test.js` (mock apiClient)
- `src/__tests__/features/return/return.usecase.test.js` (error paths)
- `src/__tests__/store/slices/return.slice.test.js` (state transitions)
- `src/__tests__/hooks/useReturns.test.js` (selector/dispatch interactions)

---

### Step 9.18: Wishlist Feature
**Goal**: Implement wishlist (saved products) per write-up and backend `/api/v1/wishlists` endpoints.

**Backend API**: `/api/v1/wishlists/*`, `/api/v1/wishlist-items/*` (create, list, get, add-item, remove-item)

**Write-up Reference**: `write-up/05-product-catalog-search.md` (favorites mentioned)

**Feature Files**:
- `src/features/wishlist/wishlist.rules.js` - Wishlist creation rules, item validation, sharing rules
- `src/features/wishlist/wishlist.model.js` - Wishlist model, wishlist item model
- `src/features/wishlist/wishlist.api.js` - Call `/api/v1/wishlists/*` and `/api/v1/wishlist-items/*` endpoints
- `src/features/wishlist/wishlist.usecase.js` - Create wishlist, add item, remove item, share wishlist, list wishlists
- `src/store/slices/wishlist.slice.js` - Wishlist state (wishlists, items, error codes)
- `src/hooks/useWishlists.js` - Expose `{ wishlists, createWishlist, addItem, removeItem, shareWishlist, error }`

**Business Rules**:
- Wishlist creation rules (user must be authenticated)
- Item validation (product must exist, not duplicate)
- Wishlist sharing rules (public, private, shared with specific users)
- Multiple wishlist support

**Tests (mandatory)**:
- `src/__tests__/features/wishlist/wishlist.rules.test.js` (100% coverage)
- `src/__tests__/features/wishlist/wishlist.model.test.js` (100% coverage)
- `src/__tests__/features/wishlist/wishlist.api.test.js` (mock apiClient)
- `src/__tests__/features/wishlist/wishlist.usecase.test.js` (error paths)
- `src/__tests__/store/slices/wishlist.slice.test.js` (state transitions)
- `src/__tests__/hooks/useWishlists.test.js` (selector/dispatch interactions)

---

### Step 9.19: Saved Search Feature
**Goal**: Implement saved searches per write-up section 5.2 and backend `/api/v1/saved-searches` endpoints.

**Backend API**: `/api/v1/saved-searches/*` (create, list, get, update, delete, execute)

**Write-up Reference**: `write-up/05-product-catalog-search.md` (section 3.2)

**Feature Files**:
- `src/features/savedSearch/savedSearch.rules.js` - Search validation, alert rules, filter persistence rules
- `src/features/savedSearch/savedSearch.model.js` - Saved search model, search alert model
- `src/features/savedSearch/savedSearch.api.js` - Call `/api/v1/saved-searches/*` endpoints
- `src/features/savedSearch/savedSearch.usecase.js` - Save search, list saved searches, execute search, delete search, set alerts
- `src/store/slices/savedSearch.slice.js` - Saved search state (searches, alerts, error codes)
- `src/hooks/useSavedSearches.js` - Expose `{ savedSearches, saveSearch, executeSearch, deleteSearch, setAlert, error }`

**Business Rules**:
- Search validation (query, filters must be valid)
- Alert rules (notify when new products match search)
- Filter persistence rules (save filters with search)
- Search history rules (track recent searches)

**Tests (mandatory)**:
- `src/__tests__/features/savedSearch/savedSearch.rules.test.js` (100% coverage)
- `src/__tests__/features/savedSearch/savedSearch.model.test.js` (100% coverage)
- `src/__tests__/features/savedSearch/savedSearch.api.test.js` (mock apiClient)
- `src/__tests__/features/savedSearch/savedSearch.usecase.test.js` (error paths)
- `src/__tests__/store/slices/savedSearch.slice.test.js` (state transitions)
- `src/__tests__/hooks/useSavedSearches.test.js` (selector/dispatch interactions)

---

### Step 9.20: User Favorite Feature
**Goal**: Implement user favorites (saved products) per write-up section 5 and backend `/api/v1/user-favorites` endpoints.

**Backend API**: `/api/v1/user-favorites/*` (GET `/`, POST `/`, DELETE `/:id`, GET `/user/:userId`, GET `/product/:productId`)

**Write-up Reference**: `write-up/05-product-catalog-search.md` (favorites mentioned)

**Feature Files**:
- `src/features/userFavorite/userFavorite.rules.js` - Favorite validation rules, duplicate prevention rules
- `src/features/userFavorite/userFavorite.model.js` - User favorite model, normalize favorite responses
- `src/features/userFavorite/userFavorite.api.js` - Call `/api/v1/user-favorites/*` endpoints
- `src/features/userFavorite/userFavorite.usecase.js` - Add favorite, remove favorite, list favorites, check if product is favorited
- `src/store/slices/userFavorite.slice.js` - User favorite state (favorites, error codes)
- `src/hooks/useUserFavorites.js` - Expose `{ favorites, addFavorite, removeFavorite, isFavorited, error }`

**Business Rules**:
- Favorite creation rules (user must be authenticated, product must exist)
- Duplicate prevention rules (cannot favorite same product twice)
- Favorite removal rules
- Product favorite status check rules

**Tests (mandatory)**:
- `src/__tests__/features/userFavorite/userFavorite.rules.test.js` (100% coverage)
- `src/__tests__/features/userFavorite/userFavorite.model.test.js` (100% coverage)
- `src/__tests__/features/userFavorite/userFavorite.api.test.js` (mock apiClient)
- `src/__tests__/features/userFavorite/userFavorite.usecase.test.js` (error paths)
- `src/__tests__/store/slices/userFavorite.slice.test.js` (state transitions)
- `src/__tests__/hooks/useUserFavorites.test.js` (selector/dispatch interactions)

---

### Step 9.21: Search History Feature
**Goal**: Implement search history tracking per write-up section 5.2 and backend `/api/v1/search-history` endpoints.

**Backend API**: `/api/v1/search-history/*` (GET `/`, GET `/:id`, DELETE `/:id`)

**Write-up Reference**: `write-up/05-product-catalog-search.md` (section 3.2)

**Feature Files**:
- `src/features/searchHistory/searchHistory.rules.js` - Search history validation rules, history retention rules
- `src/features/searchHistory/searchHistory.model.js` - Search history model, normalize history responses
- `src/features/searchHistory/searchHistory.api.js` - Call `/api/v1/search-history/*` endpoints
- `src/features/searchHistory/searchHistory.usecase.js` - Record search, list search history, delete search history entry, clear search history
- `src/store/slices/searchHistory.slice.js` - Search history state (history, error codes)
- `src/hooks/useSearchHistory.js` - Expose `{ searchHistory, recordSearch, clearHistory, deleteHistoryEntry, error }`

**Business Rules**:
- Search history recording rules (track query, filters, results count)
- History retention rules (limit number of stored searches)
- History deletion rules
- Privacy rules (user can only see their own history)

**Tests (mandatory)**:
- `src/__tests__/features/searchHistory/searchHistory.rules.test.js` (100% coverage)
- `src/__tests__/features/searchHistory/searchHistory.model.test.js` (100% coverage)
- `src/__tests__/features/searchHistory/searchHistory.api.test.js` (mock apiClient)
- `src/__tests__/features/searchHistory/searchHistory.usecase.test.js` (error paths)
- `src/__tests__/store/slices/searchHistory.slice.test.js` (state transitions)
- `src/__tests__/hooks/useSearchHistory.test.js` (selector/dispatch interactions)

---

## Completion Criteria
- ✅ All 21 core features implemented following template structure
- ✅ All features have 100% test coverage for rules/models
- ✅ All features have high test coverage for api/usecase/slice/hook
- ✅ All features expose hooks for UI access
- ✅ No UI imports in features/store/services
- ✅ All errors are normalized error codes
- ✅ All features integrate with backend API endpoints

**Next Phase**: `P010_screens-routes.md` (Screens, routes, and UI wiring)

