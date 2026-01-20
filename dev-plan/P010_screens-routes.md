# Phase 10: Marketplace Core (Screens, Routes & UI Wiring)

## Purpose
Implement **screens, routes, and UI wiring** for all features implemented in Phase 9. This phase creates the user-facing interface that connects to the feature layer via hooks, following Expo App Router conventions and platform UI standards.

## Rule References
- `.cursor/rules/app-router.mdc` (Route structure - **MANDATORY**)
- `.cursor/rules/platform-ui.mdc` (Screen structure - **MANDATORY**)
- `.cursor/rules/component-structure.mdc` (Component structure - **MANDATORY**)
- `.cursor/rules/features-domain.mdc` (Feature hooks usage)
- `.cursor/rules/security.mdc` (Route guards)
- `.cursor/rules/accessibility.mdc` (A11y requirements)
- `.cursor/rules/testing.mdc` (Testing requirements)
- `.cursor/rules/theme-design.mdc` (Theming)

## Prerequisites
- Phase 9 completed (all 21 features implemented with hooks)
- Phase 7 completed (app shell with providers and root layout)
- Reusable UI components exist (Phase 5)

## Implementation Guidelines

**IMPORTANT**: All screens and routes must follow the rules defined in the rule references above. This dev-plan does not redefine rules—only provides phase-specific implementation steps.

**Key Rule References** (see top of file for complete list):
- Screen structure: `.cursor/rules/component-structure.mdc` (file structure, grouping, platform separation)
- Route structure: `.cursor/rules/app-router.mdc` (route groups, naming, layouts, guards)
- Screen requirements: `.cursor/rules/platform-ui.mdc` (resilience, responsiveness, accessibility)
- Testing: `.cursor/rules/testing.mdc` (coverage requirements, test structure)
- i18n: `.cursor/rules/i18n.mdc` (100% internationalization requirement)

**Phase-Specific Notes**:
- Each screen implementation step below specifies which hooks to use (from Phase 9 features)
- Each route implementation step specifies guard requirements
- All screens must wire to feature hooks—never import features directly
- All user-facing text must use i18n—no hardcoded strings

## Route Structure Overview
This phase will implement the following route structure (following `.cursor/rules/app-router.mdc`):

```txt
src/app/
├── _layout.jsx                    # Root layout (from Phase 7)
├── index.jsx                      # Landing/home route (only root route allowed outside groups)
├── _error.jsx                     # Error handler (allowed outside groups)
├── +not-found.jsx                 # 404 handler (allowed outside groups)
│
├── (auth)/                        # MANDATORY: Auth route group - all auth-related routes
│   ├── _layout.jsx                # Auth layout (no auth guard)
│   ├── login.jsx
│   ├── register.jsx
│   ├── forgot-password.jsx
│   ├── reset-password.jsx
│   ├── verify-email.jsx
│   └── verify-phone.jsx
│
├── (main)/                        # MANDATORY: Main app route group - all authenticated user routes
│   ├── _layout.jsx                # Main layout (auth guard, navigation)
│   ├── home.jsx                   # Home/dashboard
│   ├── products/
│   │   ├── index.jsx              # Product list
│   │   └── [id].jsx               # Product detail
│   ├── cart.jsx
│   ├── checkout.jsx
│   ├── orders/
│   │   ├── index.jsx              # Order list
│   │   └── [id].jsx               # Order detail
│   ├── profile.jsx
│   ├── favorites.jsx              # User favorites
│   ├── search-history.jsx         # Search history
│   ├── wishlist.jsx               # Wishlist
│   ├── saved-searches.jsx         # Saved searches
│   └── ...
│
├── (vendor)/                      # MANDATORY: Vendor route group - all vendor-specific routes
│   ├── _layout.jsx                # Vendor layout (vendor guard)
│   ├── shop/
│   │   ├── index.jsx              # Shop dashboard
│   │   └── products/
│   └── ...
│
└── (admin)/                       # MANDATORY: Admin route group - all admin-specific routes (if needed)
    ├── _layout.jsx                # Admin layout (admin guard)
    └── ...
```

## Steps

### Step 10.1: Auth Route Group Layout
**Goal**: Create the auth route group layout (no auth guard, simple layout).

**Actions**:
- Create `src/app/(auth)/_layout.jsx` - Auth layout (no auth guard, simple layout)

**Requirements**:
- Simple layout without authentication guard
- Basic navigation structure for auth flows

**Tests (mandatory)**:
- `src/__tests__/app/(auth)/_layout.test.js` (layout renders, no guard blocking)

---

### Step 10.2: LoginScreen
**Goal**: Implement login screen with route.

**Screen**: `LoginScreen` - Login form (email/phone + password)

**Route**: `src/app/(auth)/login.jsx` → `LoginScreen`

**Hooks Used**:
- `useAuth` - Login functionality

**Screen Requirements**:
- Form validation (Zod schemas via feature rules)
- Error display (error codes from hooks)
- Loading states during login
- Social login buttons (OAuth - if implemented)
- Accessibility: labels, keyboard navigation, focus management

**Tests (mandatory)**:
- `src/__tests__/platform/screens/LoginScreen.test.js` (render, form submission, error states, loading/error/offline states)
- `src/__tests__/app/(auth)/login.test.js` (route renders, navigation)

---

### Step 10.3: RegisterScreen
**Goal**: Implement registration screen with route.

**Screen**: `RegisterScreen` - Registration form (email/phone, password, role selection)

**Route**: `src/app/(auth)/register.jsx` → `RegisterScreen`

**Hooks Used**:
- `useAuth` - Register functionality

**Screen Requirements**:
- Form validation (Zod schemas via feature rules)
- Error display (error codes from hooks)
- Loading states during registration
- Role selection UI
- Password strength indicator
- Accessibility: labels, keyboard navigation, focus management

**Tests (mandatory)**:
- `src/__tests__/platform/screens/RegisterScreen.test.js` (render, form submission, role selection, loading/error/offline states)
- `src/__tests__/app/(auth)/register.test.js` (route renders, navigation)

---

### Step 10.4: ForgotPasswordScreen
**Goal**: Implement forgot password screen with route.

**Screen**: `ForgotPasswordScreen` - Password reset request

**Route**: `src/app/(auth)/forgot-password.jsx` → `ForgotPasswordScreen`

**Hooks Used**:
- `useAuth` - Password reset request

**Screen Requirements**:
- Form validation (Zod schemas via feature rules)
- Error display (error codes from hooks)
- Loading states during request
- Success confirmation message
- Accessibility: labels, keyboard navigation, focus management

**Tests (mandatory)**:
- `src/__tests__/platform/screens/ForgotPasswordScreen.test.js` (render, form submission, error states, loading/error/offline states)
- `src/__tests__/app/(auth)/forgot-password.test.js` (route renders, navigation)

---

### Step 10.5: ResetPasswordScreen
**Goal**: Implement reset password screen with route.

**Screen**: `ResetPasswordScreen` - Password reset form

**Route**: `src/app/(auth)/reset-password.jsx` → `ResetPasswordScreen`

**Hooks Used**:
- `useAuth` - Password reset

**Screen Requirements**:
- Form validation (Zod schemas via feature rules)
- Error display (error codes from hooks)
- Loading states during reset
- Password strength indicator
- Token validation (from URL params)
- Accessibility: labels, keyboard navigation, focus management

**Tests (mandatory)**:
- `src/__tests__/platform/screens/ResetPasswordScreen.test.js` (render, form submission, error states, loading/error/offline states)
- `src/__tests__/app/(auth)/reset-password.test.js` (route renders, navigation)

---

### Step 10.6: VerifyEmailScreen
**Goal**: Implement email verification screen with route.

**Screen**: `VerifyEmailScreen` - Email verification

**Route**: `src/app/(auth)/verify-email.jsx` → `VerifyEmailScreen`

**Hooks Used**:
- `useAuth` - Email verification

**Screen Requirements**:
- OTP/verification code input
- Error display (error codes from hooks)
- Loading states during verification
- Resend verification code functionality
- Success confirmation
- Accessibility: labels, keyboard navigation, focus management

**Tests (mandatory)**:
- `src/__tests__/platform/screens/VerifyEmailScreen.test.js` (render, verification flow, error states, loading/error/offline states)
- `src/__tests__/app/(auth)/verify-email.test.js` (route renders, navigation)

---

### Step 10.7: VerifyPhoneScreen
**Goal**: Implement phone verification screen with route.

**Screen**: `VerifyPhoneScreen` - Phone verification

**Route**: `src/app/(auth)/verify-phone.jsx` → `VerifyPhoneScreen`

**Hooks Used**:
- `useAuth` - Phone verification

**Screen Requirements**:
- OTP/verification code input
- Error display (error codes from hooks)
- Loading states during verification
- Resend verification code functionality
- Success confirmation
- Accessibility: labels, keyboard navigation, focus management

**Tests (mandatory)**:
- `src/__tests__/platform/screens/VerifyPhoneScreen.test.js` (render, verification flow, error states, loading/error/offline states)
- `src/__tests__/app/(auth)/verify-phone.test.js` (route renders, navigation)

---

### Step 10.8: ProductListScreen
**Goal**: Implement product listing screen with route.

**Screen**: `ProductListScreen` - Product listing with filters and search

**Route**: `src/app/(main)/products/index.jsx` → `ProductListScreen`

**Hooks Used**:
- `useProducts` - Product listing
- `useCategories` - Category tree, breadcrumbs
- `useCart` - Add to cart
- `useUserFavorites` - Add/remove favorites, check favorite status
- `useSearchHistory` - Record search history

**Screen Requirements**:
- Virtualized lists (`FlatList`/`SectionList`) for large product lists
- Search bar with autocomplete (with search history integration)
- Filter sidebar/drawer (price, category, certifications, etc.)
- Product cards with images, price, stock status, favorite button
- Responsive grid/list view toggle
- Loading skeletons
- Empty states (no products found)
- Error states with retry
- Offline state handling
- Favorite button on product cards

**Tests (mandatory)**:
- `src/__tests__/platform/screens/ProductListScreen.test.js` (render, filtering, pagination, loading/error/empty/offline states)
- `src/__tests__/app/(main)/products/index.test.js` (route renders, navigation)

---

### Step 10.9: ProductDetailScreen
**Goal**: Implement product detail screen with route.

**Screen**: `ProductDetailScreen` - Product details, images, reviews, add to cart

**Route**: `src/app/(main)/products/[id].jsx` → `ProductDetailScreen`

**Hooks Used**:
- `useProducts` - Product details
- `useCart` - Add to cart
- `useUserFavorites` - Add/remove favorites, check favorite status
- `useReviews` - Product reviews

**Screen Requirements**:
- Image gallery with zoom
- Product information display
- Stock status and availability
- Add to cart functionality
- Favorite button
- Reviews section (link to review list)
- Loading states
- Error states with retry
- Offline state handling

**Tests (mandatory)**:
- `src/__tests__/platform/screens/ProductDetailScreen.test.js` (render, add to cart, image gallery, favorite, loading/error/offline states)
- `src/__tests__/app/(main)/products/[id].test.js` (route renders, navigation)

---

### Step 10.10: ProductSearchScreen
**Goal**: Implement product search screen with route.

**Screen**: `ProductSearchScreen` - Advanced search with filters

**Route**: `src/app/(main)/search.jsx` → `ProductSearchScreen`

**Hooks Used**:
- `useProducts` - Product search
- `useSavedSearches` - Save search, alerts
- `useSearchHistory` - Record search history, view recent searches
- `useUserFavorites` - Add/remove favorites, check favorite status

**Screen Requirements**:
- Advanced search form with multiple filters
- Search history integration (recent searches)
- Save search functionality
- Search alerts toggle
- Virtualized results list
- Loading states
- Empty states (no results found)
- Error states with retry
- Offline state handling

**Tests (mandatory)**:
- `src/__tests__/platform/screens/ProductSearchScreen.test.js` (search, filters, saved searches, search history, loading/error/empty/offline states)
- `src/__tests__/app/(main)/search.test.js` (route renders, navigation)

---

### Step 10.11: CategoryScreen
**Goal**: Implement category browsing screen with route.

**Screen**: `CategoryScreen` - Category browsing with hierarchy

**Route**: `src/app/(main)/categories/[slug].jsx` → `CategoryScreen`

**Hooks Used**:
- `useCategories` - Category tree, breadcrumbs
- `useProducts` - Products by category
- `useUserFavorites` - Add/remove favorites, check favorite status

**Screen Requirements**:
- Category hierarchy display
- Breadcrumb navigation
- Products filtered by category
- Category description and metadata
- Loading states
- Empty states (no products in category)
- Error states with retry
- Offline state handling

**Tests (mandatory)**:
- `src/__tests__/platform/screens/CategoryScreen.test.js` (render, category hierarchy, products, loading/error/empty/offline states)
- `src/__tests__/app/(main)/categories/[slug].test.js` (route renders, navigation)

---

### Step 10.12: CartScreen
**Goal**: Implement shopping cart screen with route.

**Screen**: `CartScreen` - Cart items, quantities, totals, multi-vendor grouping

**Route**: `src/app/(main)/cart.jsx` → `CartScreen`

**Hooks Used**:
- `useCart` - Cart items, totals, update quantities, convert to RFQ, share cart

**Screen Requirements**:
- Cart item list with quantity controls
- Multi-vendor cart grouping
- Real-time price calculations
- Batch/lot number selection for medical consumables
- Convert cart to RFQ button (for large orders per write-up section 6.2)
- Cart sharing functionality (save and share with colleagues per write-up section 6.1)
- Remove items functionality
- Loading states
- Error states
- Optimistic updates for cart operations
- Empty state (cart is empty)

**Tests (mandatory)**:
- `src/__tests__/platform/screens/CartScreen.test.js` (render, update quantities, remove items, totals, convert to RFQ, share cart, loading/error/empty/offline states)
- `src/__tests__/app/(main)/cart.test.js` (route renders, navigation)

---

### Step 10.13: CheckoutScreen
**Goal**: Implement checkout screen with route.

**Screen**: `CheckoutScreen` - Address selection, payment method, order summary

**Route**: `src/app/(main)/checkout.jsx` → `CheckoutScreen`

**Hooks Used**:
- `useCart` - Cart items, totals
- `useAddresses` - Shipping addresses
- `usePayments` - Payment methods, process payment, payment method requests
- `useOrders` - Create order

**Screen Requirements**:
- Address selection/creation
- Payment method selection
- Order summary with breakdown
- Form validation
- Loading states during checkout
- Error handling (payment failures, stock issues)
- Multi-vendor order grouping

**Tests (mandatory)**:
- `src/__tests__/platform/screens/CheckoutScreen.test.js` (address selection, payment, order creation, loading/error/offline states)
- `src/__tests__/app/(main)/checkout.test.js` (route renders, navigation)

---

### Step 10.14: CheckoutSuccessScreen
**Goal**: Implement checkout success screen with route.

**Screen**: `CheckoutSuccessScreen` - Order confirmation

**Route**: `src/app/(main)/checkout/success.jsx` → `CheckoutSuccessScreen`

**Hooks Used**:
- `useOrders` - Order details (from route params)

**Screen Requirements**:
- Order confirmation message
- Order summary display
- Order number and tracking information
- Navigation to order detail
- Continue shopping button
- Loading states
- Error states (if order not found)

**Tests (mandatory)**:
- `src/__tests__/platform/screens/CheckoutSuccessScreen.test.js` (render, order display, navigation, loading/error states)
- `src/__tests__/app/(main)/checkout/success.test.js` (route renders, navigation)

---

### Step 10.15: OrderListScreen
**Goal**: Implement order list screen with route.

**Screen**: `OrderListScreen` - User's order history

**Route**: `src/app/(main)/orders/index.jsx` → `OrderListScreen`

**Hooks Used**:
- `useOrders` - Order list, status updates

**Screen Requirements**:
- Order list with status badges
- Filtering by status
- Sorting options
- Virtualized list for large order lists
- Loading states
- Empty states (no orders)
- Error states with retry
- Offline state handling

**Tests (mandatory)**:
- `src/__tests__/platform/screens/OrderListScreen.test.js` (render, filtering, status display, loading/error/empty/offline states)
- `src/__tests__/app/(main)/orders/index.test.js` (route renders, navigation)

---

### Step 10.16: OrderDetailScreen
**Goal**: Implement order detail screen with route.

**Screen**: `OrderDetailScreen` - Order details, status, items, tracking

**Route**: `src/app/(main)/orders/[id].jsx` → `OrderDetailScreen`

**Hooks Used**:
- `useOrders` - Order details, status updates
- `useReturns` - Return requests

**Screen Requirements**:
- Order detail with timeline
- Real-time status updates (WebSocket integration)
- Order items display
- Return request functionality
- Invoice download
- Loading states
- Error states with retry
- Offline state handling

**Tests (mandatory)**:
- `src/__tests__/platform/screens/OrderDetailScreen.test.js` (render, status timeline, tracking, return request, loading/error/offline states)
- `src/__tests__/app/(main)/orders/[id].test.js` (route renders, navigation)

---

### Step 10.17: OrderTrackingScreen
**Goal**: Implement order tracking screen with route.

**Screen**: `OrderTrackingScreen` - Real-time shipment tracking

**Route**: `src/app/(main)/orders/[id]/tracking.jsx` → `OrderTrackingScreen`

**Hooks Used**:
- `useShipments` - Shipment tracking
- `useOrders` - Order context

**Screen Requirements**:
- Shipment tracking map/status
- Real-time tracking updates
- Delivery timeline
- Loading states
- Error states with retry
- Offline state handling

**Tests (mandatory)**:
- `src/__tests__/platform/screens/OrderTrackingScreen.test.js` (render, tracking display, loading/error/offline states)
- `src/__tests__/app/(main)/orders/[id]/tracking.test.js` (route renders, navigation)

---

### Step 10.18: ProfileScreen
**Goal**: Implement user profile screen with route.

**Screen**: `ProfileScreen` - User profile view/edit

**Route**: `src/app/(main)/profile.jsx` → `ProfileScreen`

**Hooks Used**:
- `useUser` - Profile, roles, company

**Screen Requirements**:
- Profile view/edit mode
- Role-specific sections (show/hide based on role)
- Form validation
- Image upload for profile picture
- Loading states
- Error states

**Tests (mandatory)**:
- `src/__tests__/platform/screens/ProfileScreen.test.js` (render, edit, role-specific sections, loading/error states)
- `src/__tests__/app/(main)/profile.test.js` (route renders, navigation)

---

### Step 10.19: SettingsScreen
**Goal**: Implement settings screen with route.

**Screen**: `SettingsScreen` - App settings, preferences

**Route**: `src/app/(main)/settings.jsx` → `SettingsScreen`

**Hooks Used**:
- `useUser` - User preferences
- `useNotifications` - Notification preferences

**Screen Requirements**:
- App preferences (theme, language, etc.)
- Notification preferences
- Privacy controls
- Loading states
- Error states

**Tests (mandatory)**:
- `src/__tests__/platform/screens/SettingsScreen.test.js` (render, preference updates, loading/error states)
- `src/__tests__/app/(main)/settings.test.js` (route renders, navigation)

---

### Step 10.20: AddressBookScreen
**Goal**: Implement address book screen with route.

**Screen**: `AddressBookScreen` - Address management

**Route**: `src/app/(main)/addresses.jsx` → `AddressBookScreen`

**Hooks Used**:
- `useAddresses` - Address management

**Screen Requirements**:
- Address list display
- Add/edit/delete addresses
- Set default address
- Form validation
- Loading states
- Error states
- Empty state (no addresses)

**Tests (mandatory)**:
- `src/__tests__/platform/screens/AddressBookScreen.test.js` (render, add/edit/delete addresses, loading/error/empty states)
- `src/__tests__/app/(main)/addresses.test.js` (route renders, navigation)

---

### Step 10.21: CompanyManagementScreen
**Goal**: Implement company management screen with route.

**Screen**: `CompanyManagementScreen` - Company profile and team (if COMPANY_ADMIN)

**Route**: `src/app/(main)/company.jsx` → `CompanyManagementScreen` (guarded)

**Hooks Used**:
- `useCompanies` - Company management
- `useUser` - User roles

**Screen Requirements**:
- Company profile view/edit
- Team member list
- Team invitation UI (company admin)
- Role-based access (COMPANY_ADMIN only)
- Loading states
- Error states

**Tests (mandatory)**:
- `src/__tests__/platform/screens/CompanyManagementScreen.test.js` (render, company management, team invitations, role guard, loading/error states)
- `src/__tests__/app/(main)/company.test.js` (route renders, guard verification)

---

### Step 10.22: SecurityScreen
**Goal**: Implement security settings screen with route.

**Screen**: `SecurityScreen` - Security settings, MFA, login history

**Route**: `src/app/(main)/security.jsx` → `SecurityScreen`

**Hooks Used**:
- `useAuth` - Security settings, MFA

**Screen Requirements**:
- MFA setup/management
- Password change
- Login history display
- Active sessions management
- Loading states
- Error states

**Tests (mandatory)**:
- `src/__tests__/platform/screens/SecurityScreen.test.js` (render, MFA setup, password change, loading/error states)
- `src/__tests__/app/(main)/security.test.js` (route renders, navigation)

---

### Step 10.23: ShopDashboardScreen
**Goal**: Implement shop dashboard screen with route.

**Screen**: `ShopDashboardScreen` - Vendor dashboard (orders, analytics, products)

**Route**: `src/app/(vendor)/shop/index.jsx` → `ShopDashboardScreen` (vendor guard)

**Hooks Used**:
- `useShops` - Shop data, analytics
- `useOrders` - Order metrics
- `useProducts` - Product metrics

**Screen Requirements**:
- Vendor dashboard with metrics
- Analytics display (if subscription tier allows)
- Quick actions (orders, products)
- Loading states
- Error states

**Tests (mandatory)**:
- `src/__tests__/platform/screens/ShopDashboardScreen.test.js` (render, metrics, navigation, loading/error states)
- `src/__tests__/app/(vendor)/shop/index.test.js` (route renders, vendor guard verification)

---

### Step 10.24: ShopProfileScreen
**Goal**: Implement public shop profile screen with route.

**Screen**: `ShopProfileScreen` - Public shop profile view

**Route**: `src/app/(main)/shops/[id].jsx` → `ShopProfileScreen` (public)

**Hooks Used**:
- `useShops` - Shop profile data

**Screen Requirements**:
- Shop profile display (logo, banner, description)
- Shop ratings and reviews
- Featured products
- Follow/contact shop functionality
- Loading states
- Error states
- Offline state handling

**Tests (mandatory)**:
- `src/__tests__/platform/screens/ShopProfileScreen.test.js` (render, shop display, loading/error/offline states)
- `src/__tests__/app/(main)/shops/[id].test.js` (route renders, navigation)

---

### Step 10.25: ShopProductsScreen
**Goal**: Implement shop products management screen with route.

**Screen**: `ShopProductsScreen` - Shop product listing (vendor view)

**Route**: `src/app/(vendor)/shop/products.jsx` → `ShopProductsScreen` (vendor guard)

**Hooks Used**:
- `useProducts` - Product management
- `useShops` - Shop context

**Screen Requirements**:
- Product management (add, edit, delete products)
- Product list with status indicators
- Bulk actions
- Loading states
- Error states
- Empty state (no products)

**Tests (mandatory)**:
- `src/__tests__/platform/screens/ShopProductsScreen.test.js` (product management, add/edit/delete, loading/error/empty states)
- `src/__tests__/app/(vendor)/shop/products.test.js` (route renders, vendor guard verification)

---

### Step 10.26: ShopOrdersScreen
**Goal**: Implement shop order management screen with route.

**Screen**: `ShopOrdersScreen` - Shop order management

**Route**: `src/app/(vendor)/shop/orders.jsx` → `ShopOrdersScreen` (vendor guard)

**Hooks Used**:
- `useOrders` - Order fulfillment
- `useShops` - Shop context

**Screen Requirements**:
- Order fulfillment workflow
- Order list with status filters
- Order actions (fulfill, cancel, etc.)
- Loading states
- Error states
- Empty state (no orders)

**Tests (mandatory)**:
- `src/__tests__/platform/screens/ShopOrdersScreen.test.js` (order management, fulfillment workflow, loading/error/empty states)
- `src/__tests__/app/(vendor)/shop/orders.test.js` (route renders, vendor guard verification)

---

### Step 10.27: CreateShopScreen
**Goal**: Implement shop creation screen with route.

**Screen**: `CreateShopScreen` - Shop creation wizard

**Route**: `src/app/(vendor)/shop/create.jsx` → `CreateShopScreen` (vendor guard)

**Hooks Used**:
- `useShops` - Shop creation

**Screen Requirements**:
- Shop creation form (name, description, logo, banner)
- Multi-step wizard (if needed)
- Form validation
- Shop customization options
- Loading states
- Error states

**Tests (mandatory)**:
- `src/__tests__/platform/screens/CreateShopScreen.test.js` (render, form submission, validation, loading/error states)
- `src/__tests__/app/(vendor)/shop/create.test.js` (route renders, vendor guard verification)

---

### Step 10.28: RFQListScreen
**Goal**: Implement RFQ list screen with route.

**Screen**: `RFQListScreen` - User's RFQ list (buyer/vendor views)

**Route**: `src/app/(main)/quote-requests/index.jsx` → `RFQListScreen`

**Hooks Used**:
- `useQuoteRequests` - RFQ list, filtering

**Screen Requirements**:
- RFQ list with status indicators
- Filtering by status, date, etc.
- Buyer and vendor views (different data)
- Loading states
- Error states
- Empty state (no RFQs)

**Tests (mandatory)**:
- `src/__tests__/platform/screens/RFQListScreen.test.js` (render, filtering, status, buyer/vendor views, loading/error/empty states)
- `src/__tests__/app/(main)/quote-requests/index.test.js` (route renders, navigation)

---

### Step 10.29: RFQDetailScreen
**Goal**: Implement RFQ detail screen with route.

**Screen**: `RFQDetailScreen` - RFQ details, responses, negotiation

**Route**: `src/app/(main)/quote-requests/[id].jsx` → `RFQDetailScreen`

**Hooks Used**:
- `useQuoteRequests` - RFQ details, responses
- `useConversations` - RFQ negotiation messaging

**Screen Requirements**:
- RFQ details display
- Vendor response display
- Negotiation chat integration
- Document attachment display
- Loading states
- Error states
- Offline state handling

**Tests (mandatory)**:
- `src/__tests__/platform/screens/RFQDetailScreen.test.js` (render, responses, negotiation, loading/error/offline states)
- `src/__tests__/app/(main)/quote-requests/[id].test.js` (route renders, navigation)

---

### Step 10.30: CreateRFQScreen
**Goal**: Implement RFQ creation screen with route.

**Screen**: `CreateRFQScreen` - RFQ creation (convert cart or new)

**Route**: `src/app/(main)/quote-requests/create.jsx` → `CreateRFQScreen`

**Hooks Used**:
- `useQuoteRequests` - RFQ creation
- `useCart` - Convert cart to RFQ

**Screen Requirements**:
- RFQ creation form (items, specifications, documents)
- Convert cart to RFQ option
- Document attachment
- Form validation
- Loading states
- Error states

**Tests (mandatory)**:
- `src/__tests__/platform/screens/CreateRFQScreen.test.js` (render, form submission, convert cart, validation, loading/error states)
- `src/__tests__/app/(main)/quote-requests/create.test.js` (route renders, navigation)

---

### Step 10.31: RFQComparisonScreen
**Goal**: Implement RFQ comparison screen with route.

**Screen**: `RFQComparisonScreen` - Quote comparison matrix (Enterprise/Vendor tiers)

**Route**: `src/app/(main)/quote-requests/[id]/compare.jsx` → `RFQComparisonScreen` (guarded by subscription)

**Hooks Used**:
- `useQuoteRequests` - RFQ comparison data

**Screen Requirements**:
- Quote comparison table (if tier allows)
- Side-by-side vendor comparison
- Feature gating (subscription tier check)
- Loading states
- Error states

**Tests (mandatory)**:
- `src/__tests__/platform/screens/RFQComparisonScreen.test.js` (render, comparison table, subscription guard, loading/error states)
- `src/__tests__/app/(main)/quote-requests/[id]/compare.test.js` (route renders, subscription guard verification)

---

### Step 10.32: ReviewListScreen
**Goal**: Implement review list screen with route.

**Screen**: `ReviewListScreen` - Product reviews list

**Route**: `src/app/(main)/products/[id]/reviews.jsx` → `ReviewListScreen`

**Hooks Used**:
- `useReviews` - Review list, ratings
- `useProducts` - Product context

**Screen Requirements**:
- Review list with ratings
- Filtering and sorting options
- Review media asset display (photos, videos)
- Verified purchaser badge display
- Helpful vote functionality
- Loading states
- Error states
- Empty state (no reviews)

**Tests (mandatory)**:
- `src/__tests__/platform/screens/ReviewListScreen.test.js` (render, filtering, ratings, media display, loading/error/empty states)
- `src/__tests__/app/(main)/products/[id]/reviews.test.js` (route renders, navigation)

---

### Step 10.33: CreateReviewScreen
**Goal**: Implement create review screen with route.

**Screen**: `CreateReviewScreen` - Create/edit review

**Route**: `src/app/(main)/products/[id]/reviews/create.jsx` → `CreateReviewScreen`

**Hooks Used**:
- `useReviews` - Review creation
- `useProducts` - Product context

**Screen Requirements**:
- Multi-dimensional rating input
- Review form with media upload (photos, videos per write-up section 6.1)
- Form validation
- Loading states
- Error states

**Tests (mandatory)**:
- `src/__tests__/platform/screens/CreateReviewScreen.test.js` (render, form submission, validation, media upload, loading/error states)
- `src/__tests__/app/(main)/products/[id]/reviews/create.test.js` (route renders, navigation)

---

### Step 10.34: ReviewDetailScreen
**Goal**: Implement review detail screen with route.

**Screen**: `ReviewDetailScreen` - Review detail with responses

**Route**: `src/app/(main)/reviews/[id].jsx` → `ReviewDetailScreen`

**Hooks Used**:
- `useReviews` - Review details, vendor responses

**Screen Requirements**:
- Review detail display
- Review media asset display (photos, videos)
- Verified purchaser badge display
- Vendor response display
- Helpful vote functionality
- Moderation indicators
- Loading states
- Error states

**Tests (mandatory)**:
- `src/__tests__/platform/screens/ReviewDetailScreen.test.js` (render, review display, vendor response, loading/error states)
- `src/__tests__/app/(main)/reviews/[id].test.js` (route renders, navigation)

---

### Step 10.35: ConversationListScreen
**Goal**: Implement conversation list screen with route.

**Screen**: `ConversationListScreen` - User's conversations

**Route**: `src/app/(main)/messages/index.jsx` → `ConversationListScreen`

**Hooks Used**:
- `useConversations` - Conversations list

**Screen Requirements**:
- Conversation list with last message preview
- Unread message indicators
- Search conversations
- Loading states
- Error states
- Empty state (no conversations)
- Offline state handling

**Tests (mandatory)**:
- `src/__tests__/platform/screens/ConversationListScreen.test.js` (render, conversation list, unread indicators, loading/error/empty/offline states)
- `src/__tests__/app/(main)/messages/index.test.js` (route renders, navigation)

---

### Step 10.36: ConversationScreen
**Goal**: Implement conversation/chat screen with route.

**Screen**: `ConversationScreen` - Chat interface with seller/buyer

**Route**: `src/app/(main)/messages/[id].jsx` → `ConversationScreen`

**Hooks Used**:
- `useConversations` - Messages, send message

**Screen Requirements**:
- Real-time messaging (WebSocket integration)
- Typing indicators
- Message delivery status
- Message list with timestamps
- Send message functionality
- Loading states
- Error states
- Offline message queuing

**Tests (mandatory)**:
- `src/__tests__/platform/screens/ConversationScreen.test.js` (render, send message, real-time updates, typing indicators, loading/error/offline states)
- `src/__tests__/app/(main)/messages/[id].test.js` (route renders, navigation)

---

### Step 10.37: NotificationsScreen
**Goal**: Implement notifications screen with route.

**Screen**: `NotificationsScreen` - Notification center

**Route**: `src/app/(main)/notifications.jsx` → `NotificationsScreen`

**Hooks Used**:
- `useNotifications` - Notifications, preferences

**Screen Requirements**:
- Notification list with grouping
- Mark as read functionality
- Notification preferences
- Filter by type
- Loading states
- Error states
- Empty state (no notifications)
- Offline state handling

**Tests (mandatory)**:
- `src/__tests__/platform/screens/NotificationsScreen.test.js` (render, mark read, preferences, loading/error/empty/offline states)
- `src/__tests__/app/(main)/notifications.test.js` (route renders, navigation)

---

### Step 10.38: SubscriptionScreen
**Goal**: Implement subscription screen with route.

**Screen**: `SubscriptionScreen` - Subscription plans, current plan, upgrade/downgrade

**Route**: `src/app/(main)/subscription.jsx` → `SubscriptionScreen`

**Hooks Used**:
- `useSubscriptions` - Plans, subscribe, cancel, upgrade

**Screen Requirements**:
- Plan comparison table
- Feature gating display (what features are available)
- Current plan display
- Upgrade/downgrade functionality
- Loading states
- Error states

**Tests (mandatory)**:
- `src/__tests__/platform/screens/SubscriptionScreen.test.js` (render, plan selection, upgrade/downgrade, loading/error states)
- `src/__tests__/app/(main)/subscription.test.js` (route renders, navigation)

---

### Step 10.39: PaymentMethodsScreen
**Goal**: Implement payment methods screen with route.

**Screen**: `PaymentMethodsScreen` - Payment method management

**Route**: `src/app/(main)/payment-methods.jsx` → `PaymentMethodsScreen`

**Hooks Used**:
- `usePayments` - Payment methods, payment method requests

**Screen Requirements**:
- Payment method list
- Add/edit/delete payment methods
- Payment method form (cards, digital wallets, local methods, PO, net terms, lease-to-own)
- Payment method request functionality (request new payment methods per write-up section 9.4)
- Set default payment method
- Loading states
- Error states
- Empty state (no payment methods)

**Tests (mandatory)**:
- `src/__tests__/platform/screens/PaymentMethodsScreen.test.js` (render, add/remove payment methods, payment method requests, loading/error/empty states)
- `src/__tests__/app/(main)/payment-methods.test.js` (route renders, navigation)

---

### Step 10.40: PaymentHistoryScreen
**Goal**: Implement payment history screen with route.

**Screen**: `PaymentHistoryScreen` - Transaction history

**Route**: `src/app/(main)/payments.jsx` → `PaymentHistoryScreen`

**Hooks Used**:
- `usePayments` - Transaction history

**Screen Requirements**:
- Transaction list with filtering
- Invoice download
- Transaction details
- Loading states
- Error states
- Empty state (no transactions)

**Tests (mandatory)**:
- `src/__tests__/platform/screens/PaymentHistoryScreen.test.js` (render, transaction list, filtering, invoice download, loading/error/empty states)
- `src/__tests__/app/(main)/payments.test.js` (route renders, navigation)

---

### Step 10.41: WishlistScreen
**Goal**: Implement wishlist screen with route.

**Screen**: `WishlistScreen` - Wishlist management

**Route**: `src/app/(main)/wishlist.jsx` → `WishlistScreen`

**Hooks Used**:
- `useWishlists` - Wishlist management

**Screen Requirements**:
- Wishlist with add/remove items
- Product cards with quick actions
- Share wishlist functionality
- Loading states
- Error states
- Empty state (wishlist is empty)

**Tests (mandatory)**:
- `src/__tests__/platform/screens/WishlistScreen.test.js` (render, add/remove items, share wishlist, loading/error/empty states)
- `src/__tests__/app/(main)/wishlist.test.js` (route renders, navigation)

---

### Step 10.42: SavedSearchesScreen
**Goal**: Implement saved searches screen with route.

**Screen**: `SavedSearchesScreen` - Saved searches with alerts

**Route**: `src/app/(main)/saved-searches.jsx` → `SavedSearchesScreen`

**Hooks Used**:
- `useSavedSearches` - Saved searches, alerts

**Screen Requirements**:
- Saved search list with alert toggles
- Execute saved search
- Edit/delete saved searches
- Loading states
- Error states
- Empty state (no saved searches)

**Tests (mandatory)**:
- `src/__tests__/platform/screens/SavedSearchesScreen.test.js` (render, alerts, execute search, edit/delete, loading/error/empty states)
- `src/__tests__/app/(main)/saved-searches.test.js` (route renders, navigation)

---

### Step 10.43: UserFavoritesScreen
**Goal**: Implement user favorites screen with route.

**Screen**: `UserFavoritesScreen` - User favorite products list

**Route**: `src/app/(main)/favorites.jsx` → `UserFavoritesScreen`

**Hooks Used**:
- `useUserFavorites` - Favorite products management

**Screen Requirements**:
- User favorites list with add/remove functionality
- Product cards with favorite toggle
- Filtering and sorting
- Loading states
- Error states
- Empty state (no favorites)

**Tests (mandatory)**:
- `src/__tests__/platform/screens/UserFavoritesScreen.test.js` (render, add/remove favorites, filtering, loading/error/empty states)
- `src/__tests__/app/(main)/favorites.test.js` (route renders, navigation)

---

### Step 10.44: SearchHistoryScreen
**Goal**: Implement search history screen with route.

**Screen**: `SearchHistoryScreen` - Search history with recent searches

**Route**: `src/app/(main)/search-history.jsx` → `SearchHistoryScreen`

**Hooks Used**:
- `useSearchHistory` - Search history tracking and display

**Screen Requirements**:
- Search history list with recent searches
- Clear history functionality
- Delete individual entries
- Execute search from history
- Loading states
- Error states
- Empty state (no search history)

**Tests (mandatory)**:
- `src/__tests__/platform/screens/SearchHistoryScreen.test.js` (render, clear history, delete entries, execute search, loading/error/empty states)
- `src/__tests__/app/(main)/search-history.test.js` (route renders, navigation)

---

### Step 10.45: ReturnRequestScreen
**Goal**: Implement return request screen with route.

**Screen**: `ReturnRequestScreen` - Return request creation

**Route**: `src/app/(main)/orders/[id]/return.jsx` → `ReturnRequestScreen`

**Hooks Used**:
- `useReturns` - Return requests
- `useOrders` - Order context

**Screen Requirements**:
- Return request form with reason selection
- Order items selection for return
- Form validation
- Loading states
- Error states

**Tests (mandatory)**:
- `src/__tests__/platform/screens/ReturnRequestScreen.test.js` (render, form submission, validation, loading/error states)
- `src/__tests__/app/(main)/orders/[id]/return.test.js` (route renders, navigation)

---

### Step 10.46: ShipmentTrackingScreen
**Goal**: Implement shipment tracking screen with route.

**Screen**: `ShipmentTrackingScreen` - Shipment tracking (standalone)

**Route**: `src/app/(main)/shipments/[id].jsx` → `ShipmentTrackingScreen`

**Hooks Used**:
- `useShipments` - Shipment tracking

**Screen Requirements**:
- Shipment tracking with map (if available)
- Delivery timeline
- Real-time tracking updates
- Loading states
- Error states
- Offline state handling

**Tests (mandatory)**:
- `src/__tests__/platform/screens/ShipmentTrackingScreen.test.js` (render, tracking display, map, loading/error/offline states)
- `src/__tests__/app/(main)/shipments/[id].test.js` (route renders, navigation)

---

### Step 10.47: Navigation & Route Guards
**Goal**: Implement navigation structure and route guards.

**Actions**:
- Create route group layouts with guards:
  - `(main)/_layout.jsx` - Auth guard (requires authentication)
  - `(vendor)/_layout.jsx` - Vendor guard (requires VENDOR role)
  - `(admin)/_layout.jsx` - Admin guard (requires APP_ADMIN role)
- Implement navigation components:
  - Bottom tab bar (mobile)
  - Sidebar navigation (web/tablet)
  - Header navigation
- Implement guards in `src/navigation/guards/`:
  - `auth.guard.js` - Authentication check
  - `role.guard.js` - Role-based access control
  - `subscription.guard.js` - Feature gating by subscription tier

**Route Guards**:
- Auth guard: Redirect to `/login` if not authenticated
- Role guard: Redirect to `/unauthorized` if role insufficient
- Subscription guard: Show upgrade prompt if feature requires higher tier

**Tests (mandatory)**:
- `src/__tests__/navigation/guards/auth.guard.test.js` (redirect logic, token validation)
- `src/__tests__/navigation/guards/role.guard.test.js` (role checking, redirects)
- `src/__tests__/navigation/guards/subscription.guard.test.js` (subscription checking, upgrade prompts)
- `src/__tests__/app/(main)/_layout.test.js` (guard integration)
- Route guard integration tests

---

### Step 10.48: LandingScreen
**Goal**: Implement landing page screen with route.

**Screen**: `LandingScreen` - Public landing page (value proposition, CTA)

**Route**: `src/app/index.jsx` → `LandingScreen` (public)

**Hooks Used**:
- `useAuth` - Check authentication status (for conditional rendering)

**Screen Requirements**:
- Hero section
- Features showcase
- CTA buttons (login, register)
- Responsive design
- Loading states
- Error states

**Tests (mandatory)**:
- `src/__tests__/platform/screens/LandingScreen.test.js` (render, navigation to auth, loading/error states)
- `src/__tests__/app/index.test.js` (route renders, navigation)

---

### Step 10.49: HomeScreen
**Goal**: Implement authenticated home screen with route.

**Screen**: `HomeScreen` - Authenticated home (dashboard, recommendations, recent activity)

**Route**: `src/app/(main)/home.jsx` → `HomeScreen` (authenticated)

**Hooks Used**:
- `useProducts` - Featured products, recommendations
- `useOrders` - Recent orders
- `useNotifications` - Recent notifications
- `useUserFavorites` - Favorite products display
- `useSearchHistory` - Recent searches display

**Screen Requirements**:
- Personalized dashboard
- Quick actions
- Recommendations
- Recent favorites
- Recent searches
- Recent orders
- Responsive design
- Loading states
- Error states

**Tests (mandatory)**:
- `src/__tests__/platform/screens/HomeScreen.test.js` (render, personalized content, loading/error states)
- `src/__tests__/app/(main)/home.test.js` (route renders, navigation)

---

### Step 10.50: NotFoundScreen
**Goal**: Implement 404 not found screen with route.

**Screen**: `NotFoundScreen` - 404 page

**Route**: `src/app/+not-found.jsx` → `NotFoundScreen`

**Screen Requirements**:
- User-friendly 404 message
- Navigation back to safe routes
- No technical details exposed
- Responsive design

**Tests (mandatory)**:
- `src/__tests__/platform/screens/NotFoundScreen.test.js` (render, navigation)
- `src/__tests__/app/+not-found.test.js` (route renders)

---

### Step 10.51: ErrorScreen
**Goal**: Implement generic error screen with route.

**Screen**: `ErrorScreen` - Generic error page

**Route**: `src/app/+error.jsx` → `ErrorScreen`

**Screen Requirements**:
- User-friendly error message
- Retry actions where applicable
- Navigation back to safe routes
- No technical details exposed
- Responsive design

**Tests (mandatory)**:
- `src/__tests__/platform/screens/ErrorScreen.test.js` (render, retry, navigation)
- `src/__tests__/app/+error.test.js` (route renders)

---

### Step 10.52: UnauthorizedScreen
**Goal**: Implement unauthorized (403) screen with route.

**Screen**: `UnauthorizedScreen` - 403 page

**Route**: `src/app/unauthorized.jsx` → `UnauthorizedScreen`

**Screen Requirements**:
- User-friendly unauthorized message
- Navigation back to safe routes
- No technical details exposed
- Responsive design

**Tests (mandatory)**:
- `src/__tests__/platform/screens/UnauthorizedScreen.test.js` (render, navigation)
- `src/__tests__/app/unauthorized.test.js` (route renders)

---

## Completion Criteria
- ✅ All screens implemented following component structure
- ✅ All routes created with proper guards and layouts
- ✅ All screens wire to feature hooks (no direct feature imports)
- ✅ All screens handle loading/empty/error/offline states
- ✅ All screens are responsive (mobile, tablet, desktop)
- ✅ All screens are accessible (a11y labels, keyboard navigation)
- ✅ All screens use theme tokens (no hardcoded values)
- ✅ All screens have high test coverage (loading/error/empty states)
- ✅ Route guards implemented and tested
- ✅ Navigation structure complete
- ✅ Error handling complete

**Next Phase**: `P011_advanced-features.md` (Advanced features: biomed-specific, compliance, and enterprise)
