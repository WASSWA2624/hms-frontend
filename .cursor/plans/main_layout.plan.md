# Main Layout - Enhanced Features Plan

## Overview

This plan documents improvements and enhancements for the MainRouteLayout component, which serves as the primary authenticated application shell. The layout provides navigation, header controls, sidebar (web), tab bar (mobile), and content area for all authenticated routes.

**Platform Coverage**: This plan applies to all devices and platforms:

- **Web**: Desktop, tablet, mobile browsers
- **Native**: iOS and Android mobile applications
- **Responsive**: Adapts to all screen sizes from 320px to 2560px+

## Current Implementation

**Component**: `MainRouteLayout`

**Location**: `hms-frontend/src/platform/layouts/route-layouts/MainRouteLayout/`

**Platform Files**:

- `MainRouteLayout.web.jsx` - Web platform with sidebar
- `MainRouteLayout.ios.jsx` - iOS platform with tab bar
- `MainRouteLayout.android.jsx` - Android platform with tab bar
- `MainRouteLayout.web.styles.jsx` - Web-specific styled components

## Current Features

### Web Platform

1. **Sidebar Navigation**:

- Resizable sidebar (200-360px, default 260px, collapsed 64px)
- Collapsible sidebar with keyboard shortcuts
- Mobile overlay sidebar with backdrop
- Language and theme controls in footer

2. **Global Header**:

- Brand logo and name (responsive)
- Hamburger menu toggle
- Authentication actions (login/logout/register)
- Notifications dropdown with unread count
- Network indicator
- Fullscreen toggle
- Header customization menu (show/hide actions)
- Header hide/show functionality
- Overflow menu for mobile/compact views

3. **Layout Features**:

- AppFrame wrapper with sidebar, header, footer, overlay, notices
- Loading overlay
- Notice surface for system messages
- GlobalFooter component

### Mobile Platforms (iOS/Android)

1. **Global Header**:

- Brand title
- Authentication actions
- Language and theme controls in utility slot

2. **Tab Bar Navigation**:

- Bottom tab bar in footer
- Quick navigation between main sections

3. **Layout Features**:

- AppFrame wrapper
- Loading overlay
- Notice surface

## Proposed Enhancements

### 1. Performance Optimizations

**Goal**: Improve rendering performance and reduce unnecessary re-renders

**Implementation**:

- **Memoization**:
- Memoize header actions, navigation items, and notification items
- Use `React.memo` for styled components where appropriate
- Memoize expensive calculations (filtered items, counts)

- **Lazy Loading**:
- Lazy load notification menu content
- Lazy load overflow menu items
- Code-split heavy components (notifications, customization menu)

- **Virtual Scrolling**:
- Implement virtual scrolling for long notification lists
- Optimize sidebar item rendering for large navigation trees

- **State Management**:
- Use Redux selectors with memoization
- Debounce resize handlers
- Throttle scroll handlers

**Files to Modify**:

- `MainRouteLayout.web.jsx` - Add memoization hooks
- Create `useMainLayoutMemo.js` hook for memoized values

### 2. Enhanced Responsive Design

**Goal**: Better adaptation to different screen sizes and orientations

**Implementation**:

- **Breakpoint Refinements**:
- Add intermediate breakpoints (e.g., 1200px for large tablets)
- Better tablet-specific layouts (768px - 1024px)
- Improved mobile landscape handling

- **Adaptive Sidebar**:
- Auto-collapse sidebar on tablet portrait
- Auto-expand on tablet landscape
- Remember user preference per breakpoint

- **Header Adaptations**:
- Progressive disclosure of header actions
- Better mobile header layout (stack actions vertically if needed)
- Improved compact header for small screens

- **Content Area**:
- Better padding/margins across breakpoints
- Improved max-width constraints for content
- Better handling of overflow content

**Files to Modify**:

- `MainRouteLayout.web.styles.jsx` - Enhanced media queries
- `MainRouteLayout.web.jsx` - Responsive logic improvements

### 3. Accessibility Enhancements

**Goal**: WCAG AAA compliance and improved screen reader support

**Implementation**:

- **Keyboard Navigation**:
- Full keyboard navigation for all interactive elements
- Keyboard shortcuts (documented in help menu):
- `Ctrl/Cmd + B` - Toggle sidebar
- `Ctrl/Cmd + H` - Toggle header
- `Ctrl/Cmd + K` - Open command palette
- `Ctrl/Cmd + /` - Show keyboard shortcuts
- `Esc` - Close open menus/overlays

- **Screen Reader Improvements**:
- Better ARIA labels and descriptions
- Live regions for dynamic content (notifications)
- Proper focus management for modals/overlays
- Skip links for main content

- **Focus Management**:
- Focus trap in mobile sidebar overlay
- Return focus to trigger after closing menus
- Visible focus indicators (enhanced)
- Focus order optimization

- **Reduced Motion**:
- Respect `prefers-reduced-motion` media query
- Disable animations when motion is reduced
- Provide static alternatives

**Files to Modify**:

- `MainRouteLayout.web.jsx` - Keyboard handlers, ARIA attributes
- `MainRouteLayout.web.styles.jsx` - Focus indicators, reduced motion

### 4. Breadcrumb Navigation

**Goal**: Provide context-aware navigation breadcrumbs

**Implementation**:

- **Breadcrumb Component**:
- Display current route hierarchy
- Clickable breadcrumb items
- Responsive truncation on mobile
- Integration with AppFrame breadcrumbs slot

- **Route Context**:
- Extract route hierarchy from expo-router
- Support nested routes
- Custom breadcrumb labels from route metadata

- **Styling**:
- Theme-compliant styling
- Responsive design (hide on mobile, show on tablet+)
- Proper spacing and typography

**Files to Create/Modify**:

- Create `BreadcrumbNavigation` component
- `MainRouteLayout.web.jsx` - Add breadcrumb slot
- `MainRouteLayout.web.styles.jsx` - Breadcrumb styles

### 5. Search Functionality

**Goal**: Global search with quick access

**Implementation**:

- **Search Input**:
- Search icon in header (desktop)
- Search in overflow menu (mobile)
- Keyboard shortcut: `Ctrl/Cmd + K`
- Focus management

- **Search Results**:
- Dropdown with search results
- Categories: Routes, Actions, Content
- Keyboard navigation (arrow keys, enter)
- Highlight matching text

- **Search Integration**:
- Integrate with navigation items
- Search across app content (if applicable)
- Recent searches (localStorage)
- Search history

**Files to Create/Modify**:

- Create `GlobalSearch` component
- `MainRouteLayout.web.jsx` - Add search to header
- Create `useGlobalSearch.js` hook

### 6. Command Palette / Quick Actions

**Goal**: Power-user feature for quick navigation and actions

**Implementation**:

- **Command Palette**:
- Modal overlay with search input
- Keyboard shortcut: `Ctrl/Cmd + K`
- Command categories:
- Navigation (routes)
- Actions (logout, settings, etc.)
- Theme/Language switching
- Layout toggles (sidebar, header)

- **Command Execution**:
- Execute commands on selection
- Keyboard navigation (arrow keys, enter)
- Command descriptions/tooltips

- **Styling**:
- Centered modal overlay
- Search input at top
- Scrollable command list
- Keyboard shortcut hints

**Files to Create/Modify**:

- Create `CommandPalette` component
- `MainRouteLayout.web.jsx` - Add command palette
- Create `useCommandPalette.js` hook

### 7. Enhanced Notifications

**Goal**: Improved notification system with better UX

**Implementation**:

- **Notification Features**:
- Real-time updates (WebSocket integration)
- Notification categories/filtering
- Mark as read/unread
- Dismiss notifications
- Notification actions (quick actions from notification)

- **Notification UI**:
- Better notification item design
- Timestamp display
- Avatar/icon per notification type
- Grouped notifications
- "Mark all as read" action

- **Notification Settings**:
- Notification preferences
- Sound/vibration settings (mobile)
- Desktop notifications (if supported)

**Files to Modify**:

- `MainRouteLayout.web.jsx` - Enhanced notification logic
- `MainRouteLayout.web.styles.jsx` - Notification styles
- Create `NotificationItem` component

### 8. Improved Mobile Experience

**Goal**: Better mobile-specific features and optimizations

**Implementation**:

- **Mobile Gestures**:
- Swipe to open/close sidebar
- Pull to refresh (if applicable)
- Swipe gestures for notifications

- **Mobile Optimizations**:
- Bottom sheet for notifications (mobile)
- Better touch targets (minimum 44px)
- Improved mobile header (sticky)
- Better mobile footer (TabBar enhancements)

- **Mobile-Specific Features**:
- Haptic feedback (native)
- Better status bar handling
- Safe area insets support
- Bottom navigation improvements

**Files to Modify**:

- `MainRouteLayout.ios.jsx` - Mobile enhancements
- `MainRouteLayout.android.jsx` - Mobile enhancements
- `MainRouteLayout.web.jsx` - Mobile web improvements

### 9. Animation and Transitions

**Goal**: Smooth, performant animations that enhance UX

**Implementation**:

- **Sidebar Animations**:
- Smooth collapse/expand transitions
- Resize animation (optional, debounced)
- Mobile sidebar slide-in/out

- **Menu Animations**:
- Dropdown menu fade-in/out
- Notification menu slide-in
- Command palette modal animation

- **Layout Transitions**:
- Header show/hide animation
- Content area transitions
- Loading state transitions

- **Performance**:
- Use CSS transforms for animations
- GPU-accelerated properties
- Respect `prefers-reduced-motion`
- Debounce/throttle animations

**Files to Modify**:

- `MainRouteLayout.web.styles.jsx` - Animation styles
- `MainRouteLayout.web.jsx` - Animation state management

### 10. State Persistence

**Goal**: Remember user preferences across sessions

**Implementation**:

- **Persisted State**:
- Sidebar width (already implemented)
- Sidebar collapsed state (already implemented)
- Header hidden state (already implemented)
- Header action visibility (already implemented)
- Selected theme (via ThemeControls)
- Selected language (via LanguageControls)

- **Local Storage**:
- Use Redux persist middleware
- Store in localStorage (web) or AsyncStorage (native)
- Migration strategy for state changes

- **User Preferences**:
- Layout preferences per device type
- Notification preferences
- Search history
- Recent commands

**Files to Modify**:

- Redux store configuration (if needed)
- `MainRouteLayout.web.jsx` - State persistence logic

### 11. Error Boundaries and Resilience

**Goal**: Graceful error handling and recovery

**Implementation**:

- **Error Boundaries**:
- Wrap layout sections in error boundaries
- Fallback UI for errors
- Error reporting/logging

- **Offline Support**:
- Offline indicator (already via NetworkIndicator)
- Cached navigation items
- Offline-friendly UI

- **Loading States**:
- Skeleton screens for content
- Progressive loading
- Better loading indicators

**Files to Create/Modify**:

- Create `LayoutErrorBoundary` component
- `MainRouteLayout.web.jsx` - Error boundary integration

### 12. Progressive Enhancement Features

**Goal**: Enhanced features that work when available

**Implementation**:

- **Service Worker Integration**:
- Offline support
- Background sync
- Push notifications (if applicable)

- **PWA Features**:
- Install prompt
- App shortcuts
- Share target API

- **Browser APIs**:
- Fullscreen API (already implemented)
- Clipboard API for quick actions
- File System Access API (if applicable)

**Files to Modify**:

- `MainRouteLayout.web.jsx` - Progressive enhancement checks
- Create utility hooks for feature detection

## Implementation Priority

### Phase 1: Core Improvements (High Priority)

1. Performance optimizations (memoization, lazy loading)
2. Enhanced responsive design
3. Accessibility enhancements (keyboard navigation, ARIA)
4. State persistence improvements

### Phase 2: User Experience (Medium Priority)

5. Breadcrumb navigation
6. Search functionality
7. Enhanced notifications
8. Improved mobile experience

### Phase 3: Advanced Features (Lower Priority)

9. Command palette
10. Animation improvements
11. Error boundaries
12. Progressive enhancement features

## Design Principles

Following `theme-design.mdc` and `component-structure.mdc` rules:

1. **Theme-Driven**: All colors, spacing, typography use theme tokens
2. **Styled-Components Only**: No inline styles, CSS-in-JS alternatives
3. **Platform Separation**: Platform-specific files, no `Platform.OS` checks
4. **Semantic Tokens**: Use semantic color names, not visual hacks
5. **Responsive**: Uses theme breakpoints from `src/theme/breakpoints.js`
6. **Accessibility First**: WCAG AA/AAA compliance, keyboard navigation
7. **Performance**: Optimized rendering, lazy loading, memoization

## Success Criteria

1. **Performance**: Layout renders in < 100ms, no unnecessary re-renders
2. **Responsive**: Works perfectly on all devices (320px - 2560px+)
3. **Accessibility**: Full WCAG AAA compliance, keyboard navigation
4. **User Experience**: Intuitive, fast, responsive interactions
5. **Mobile**: Excellent mobile experience with gestures and optimizations
6. **Theme Compliance**: All styling uses theme tokens
7. **Code Quality**: Follows project structure and rules
8. **Maintainability**: Clean, documented, testable code

## Testing Checklist

### Functional Testing

- [ ] All navigation items work correctly
- [ ] Sidebar resize works smoothly
- [ ] Sidebar collapse/expand works
- [ ] Header actions work (notifications, fullscreen, etc.)
- [ ] Mobile sidebar overlay works
- [ ] Keyboard shortcuts work
- [ ] Search functionality works
- [ ] Command palette works
- [ ] Notifications display correctly
- [ ] State persists across sessions

### Responsive Testing

- [ ] Desktop (1024px+): Full layout with sidebar
- [ ] Tablet (768px - 1023px): Adaptive layout
- [ ] Mobile (320px - 767px): Mobile-optimized layout
- [ ] Landscape orientation: Proper adaptation
- [ ] All breakpoints: No layout breaks

### Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Focus indicators visible
- [ ] ARIA labels correct
- [ ] Reduced motion respected
- [ ] Color contrast meets WCAG AAA

### Performance Testing

- [ ] Initial render < 100ms
- [ ] No unnecessary re-renders
- [ ] Smooth animations (60fps)
- [ ] Lazy loading works
- [ ] Memory usage acceptable

### Cross-Browser Testing

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS and iOS)
- [ ] Mobile browsers

## Files to Modify

1. **`hms-frontend/src/platform/layouts/route-layouts/MainRouteLayout/MainRouteLayout.web.jsx`**

- Add memoization hooks
- Add keyboard shortcuts
- Add breadcrumb integration
- Add search functionality
- Add command palette
- Enhanced notification logic
- Improved responsive logic

2. **`hms-frontend/src/platform/layouts/route-layouts/MainRouteLayout/MainRouteLayout.web.styles.jsx`**

- Enhanced responsive styles
- Animation styles
- Breadcrumb styles
- Search styles
- Command palette styles

3. **`hms-frontend/src/platform/layouts/route-layouts/MainRouteLayout/MainRouteLayout.ios.jsx`**

- Mobile enhancements
- Gesture support
- Better mobile optimizations

4. **`hms-frontend/src/platform/layouts/route-layouts/MainRouteLayout/MainRouteLayout.android.jsx`**

- Mobile enhancements
- Gesture support
- Better mobile optimizations

## New Files to Create

1. **`hms-frontend/src/platform/layouts/route-layouts/MainRouteLayout/useMainLayoutMemo.js`**

- Memoization hooks for layout values

2. **`hms-frontend/src/platform/layouts/route-layouts/MainRouteLayout/useKeyboardShortcuts.js`**

- Keyboard shortcut handlers

3. **`hms-frontend/src/platform/components/navigation/BreadcrumbNavigation/BreadcrumbNavigation.web.jsx`**

- Breadcrumb component

4. **`hms-frontend/src/platform/components/navigation/BreadcrumbNavigation/BreadcrumbNavigation.web.styles.jsx`**

- Breadcrumb styles

5. **`hms-frontend/src/platform/components/search/GlobalSearch/GlobalSearch.web.jsx`**

- Global search component

6. **`hms-frontend/src/platform/components/search/GlobalSearch/GlobalSearch.web.styles.jsx`**

- Global search styles

7. **`hms-frontend/src/platform/components/commands/CommandPalette/CommandPalette.web.jsx`**

- Command palette component

8. **`hms-frontend/src/platform/components/commands/CommandPalette/CommandPalette.web.styles.jsx`**

- Command palette styles

9. **`hms-frontend/src/platform/components/notifications/NotificationItem/NotificationItem.web.jsx`**

- Enhanced notification item component

10. **`hms-frontend/src/platform/components/layout/LayoutErrorBoundary/LayoutErrorBoundary.jsx`**

- Error boundary for layout

## Notes

- All enhancements must maintain backward compatibility
- Follow existing code patterns and project structure
- Use theme tokens for all styling
- Ensure accessibility compliance
- Test on all target platforms
- Document keyboard shortcuts in help/accessibility menu
- Consider performance impact of each feature
- Progressive enhancement: features should degrade gracefully