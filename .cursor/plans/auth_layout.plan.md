# Auth Layout - Two-Column Responsive Design Plan

## Overview

This plan documents the two-column authentication layout implementation for the HMS frontend application. The layout provides a full-screen responsive design with a gradient welcome panel and a centered form panel, utilizing the entire viewport while maintaining content readability.

**Platform Coverage**: This plan applies to all devices and platforms:

- **Web**: Desktop, tablet, mobile browsers
- **Native**: iOS and Android mobile applications
- **Responsive**: Adapts to all screen sizes from 320px to 2560px+

## Current Implementation

**Component**: `AuthFormLayout`

**Location**: `hms-frontend/src/platform/components/layout/AuthFormLayout/`

**Layout Variant**: `two-column` (default: `centered` for backward compatibility)

## Architecture

### Component Structure

Following `component-structure.mdc` rules:

- **Platform Files**: `AuthFormLayout.web.jsx`, `AuthFormLayout.ios.jsx`, `AuthFormLayout.android.jsx`
- **Style Files**: `AuthFormLayout.web.styles.jsx`, `AuthFormLayout.ios.styles.jsx`, `AuthFormLayout.android.styles.jsx`
- **Hook**: `useAuthFormLayout.js`
- **Types**: `types.js` (defines `SIZES` and `LAYOUTS` constants)

### Layout Structure

```
Screen (full viewport)
└── StyledAuthFormContainer ($isTwoColumn=true)
    └── StyledTwoColumnContainer
        ├── StyledLeftPanel (Welcome/Branding)
        │   └── StyledWelcomeContent
        └── StyledRightPanel (Form Content)
            └── StyledFormContent
```

## Design Principles

Following `theme-design.mdc` rules:

1. **Theme-Driven**: All colors, spacing, typography, and radius use theme tokens
2. **Styled-Components Only**: No inline styles, CSS-in-JS alternatives, or StyleSheet API
3. **Platform Separation**: Platform-specific style files, no `Platform.OS` checks
4. **Semantic Tokens**: Use semantic color names (primary, secondary, background.primary), not visual hacks
5. **Responsive**: Uses theme breakpoints from `src/theme/breakpoints.js`

## Layout Specifications

### Full Screen Horizontal Span with Reasonable Form Padding

The two-column layout **spans the entire screen horizontally** while maintaining **reasonable padding/margins for form content** to ensure proper centering and spacing:

- **Screen Component** (`Screen`):
  - When used with two-column layout: `padding="none"` prop must be passed
  - No default padding that would create side gaps
  - `width: 100%` (full viewport width)
- **Parent Container** (`StyledAuthFormContainer`): 
  - When `$isTwoColumn` is true: 
    - `padding: 0` (no padding on container)
    - `justify-content: flex-start` (no centering)
    - `align-items: stretch` (no centering)
    - `width: 100%` (full viewport width)
    - `margin: 0` (no margins)
  - No horizontal margins or constraints
- **Two-Column Container** (`StyledTwoColumnContainer`):
  - `width: 100%` (full viewport width)
  - `overflow-x: hidden` (prevents horizontal scrolling)
  - No padding or margins
  - `margin: 0` (no margins)
- **Panels** (`StyledLeftPanel`, `StyledRightPanel`):
  - Combined width: 100% (50% + 50% on desktop)
  - No horizontal gaps between panels
  - **Internal padding for content centering**:
    - Desktop: `theme.spacing.xl + theme.spacing.md` (48px)
    - Large Desktop: `theme.spacing.xxl` (48px)
    - Tablet: `theme.spacing.lg` (24px)
    - Mobile: `theme.spacing.md` (16px)
- **Form Content** (`StyledFormContent`):
  - **Centered with reasonable padding**:
    - Large Desktop: `padding: 0 ${theme.spacing.md}px` (16px sides)
    - Desktop: `padding: 0 ${theme.spacing.sm}px` (8px sides)
    - Tablet: `padding: 0 ${theme.spacing.md}px` (16px sides)
    - Mobile: `padding: 0 ${theme.spacing.sm}px` (8px sides)
  - `margin: 0 auto` (centers content horizontally)
  - Max-width constraints prevent form from being too wide on large screens

### Two-Column Container

**File**: `AuthFormLayout.web.styles.jsx`

**Component**: `StyledTwoColumnContainer`

- **Width**: 100% (full viewport width, spans entire screen horizontally)
- **Height**: 100vh (full viewport height)
- **Display**: Flexbox (row direction on desktop)
- **Background**: Gradient applied to parent container (`StyledAuthFormContainer`)
- **Padding**: None (0px) - ensures full horizontal span
- **Margin**: None (0px) - ensures full horizontal span
- **Overflow**: `overflow-x: hidden` to prevent horizontal scrolling
- **Responsive**: Stacks vertically on mobile/tablet
- **Full Screen Span**: The layout must span the entire screen width with no horizontal constraints

### Left Panel (Welcome Panel)

**File**: `AuthFormLayout.web.styles.jsx`

**Component**: `StyledLeftPanel`

- **Width**: 50% on desktop
- **Height**: 100% (full viewport height)
- **Background**: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`
- **Padding**: `theme.spacing.xxl` (48px) on desktop
- **Alignment**: Content centered both horizontally and vertically
- **Text Color**: `theme.colors.text.inverse` (white)
- **Decorative Elements**: CSS pseudo-elements (::before, ::after) for abstract shapes

**Welcome Content** (`StyledWelcomeContent`):

- **Max-width**: 
  - Desktop: `theme.spacing.xxl * 12.5` (600px)
  - Tablet/Mobile: 100% (full width for better readability)
- **Text Alignment**: Center
- **Position**: Relative with z-index for layering
- **Responsive Typography**: Font sizes scale down on smaller screens

### Right Panel (Form Panel)

**File**: `AuthFormLayout.web.styles.jsx`

**Component**: `StyledRightPanel`

- **Width**: 50% on desktop
- **Height**: `calc(100vh - ${theme.spacing.lg * 2}px)` on desktop (accounts for container padding)
- **Max-height**: `calc(100vh - ${theme.spacing.lg * 2}px)` on desktop to enable scrolling
- **Background**: `theme.colors.background.primary` (white)
- **Padding**: 
  - Desktop: `theme.spacing.xl + theme.spacing.md` (48px)
  - Large Desktop: `theme.spacing.xxl` (48px)
  - Tablet: `theme.spacing.lg` (24px)
  - Mobile: `theme.spacing.md` (16px)
- **Explicit padding-top and padding-bottom**: Ensures content has space at top and bottom for scrolling
- **Alignment**: Content aligned to flex-start (top) to enable proper scrolling
- **Overflow**: `overflow-y: auto` on desktop, `overflow-y: auto` on tablet/mobile to allow scrolling when content exceeds viewport
- **Visual Enhancement**: 
  - `border-radius: ${theme.radius.lg}px` for rounded corners
  - Subtle `box-shadow` for depth and visual distinction
- **Form Content Padding**: Additional side padding on `StyledFormContent` for proper spacing and centering

**Form Content** (`StyledFormContent`):

- **Max-width**: 
  - Desktop: `theme.spacing.xxl * 10 + theme.spacing.md` (500px)
  - Large Desktop (≥1440px): `theme.spacing.xxl * 12.5` (600px)
  - Tablet/Mobile: 100% (no max-width constraint)
- **Width**: 100% (stretches to max-width on desktop, full width on mobile/tablet)
- **Display**: Flex column with `align-items: stretch` (inputs fill width)
- **Centering**: `margin: 0 auto` (centers content horizontally)
- **Padding**: Reasonable side padding for proper spacing:
  - Large Desktop: `padding: 0 ${theme.spacing.md}px` (16px sides)
  - Desktop: `padding: 0 ${theme.spacing.sm}px` (8px sides)
  - Tablet: `padding: 0 ${theme.spacing.md}px` (16px sides)
  - Mobile: `padding: 0 ${theme.spacing.sm}px` (8px sides)
- **Responsive**: Adapts padding and spacing based on screen size
- **Input Width Consistency**: All form inputs (identifier, password) must have the same width (100% with `box-sizing: border-box`)

## Theme Token Usage

### Colors

All colors must use theme tokens from `src/theme/tokens/colors.js`:

- `theme.colors.primary` - Gradient start color
- `theme.colors.secondary` - Gradient end color
- `theme.colors.background.primary` - Form panel background
- `theme.colors.background.secondary` - Input field backgrounds
- `theme.colors.text.inverse` - Welcome panel text (white)
- `theme.colors.text.secondary` - Form title color
- `theme.colors.text.tertiary` - Helper text, icons

**Forbidden**: Hardcoded hex values, color names like `blue500`, `lightGray`

### Spacing

All spacing must use theme tokens from `src/theme/tokens/spacing.js`:

- `theme.spacing.xxl` (48px) - Large panel padding
- `theme.spacing.xl` (32px) - Panel padding, form content max-width breakpoint
- `theme.spacing.lg` (24px) - Tablet padding, title margin
- `theme.spacing.md` (16px) - Mobile padding
- `theme.spacing.sm` (8px) - Field spacing
- `theme.spacing.xs` (4px) - Tight spacing

**Forbidden**: Arbitrary spacing values (e.g., `padding: 20px`)

### Typography

All typography must use theme tokens from `src/theme/tokens/typography.js`:

- `theme.typography.fontSize.sm` (14px) - Form title, input text
- `theme.typography.fontSize.xs` (12px) - Helper text
- `theme.typography.fontWeight.semibold` (600) - Titles, button text
- `theme.typography.lineHeight.*` - Line heights

### Radius

All border-radius must use theme tokens from `src/theme/tokens/radius.js`:

- `theme.radius.md` (8px) - Subtle container rounding (if needed)
- Fixed 20px for pill-shaped inputs (as per design spec, not using `theme.radius.full` which is 9999)

**Forbidden**: Inline border-radius values

### Breakpoints

Responsive breakpoints from `src/theme/breakpoints.js`:

- **Mobile**: 320px - 767px - Stacked layout, minimal padding, optimized for small screens
- **Tablet**: 768px - 1023px - Stacked layout, moderate padding, optimized for medium screens
- **Desktop**: 1024px - 1439px - Two columns side-by-side, generous padding
- **Large Desktop**: ≥ 1440px - Two columns side-by-side, maximum content width constraints

**Breakpoint Values**:

- `theme.breakpoints.mobile` (320px) - Small mobile devices
- `theme.breakpoints.tablet` (768px) - Tablets and small laptops
- `theme.breakpoints.desktop` (1024px) - Desktop screens
- `theme.breakpoints.large` (1440px) - Large desktop screens

## Responsive Behavior

### Large Desktop (≥ 1440px)

- Two columns side-by-side (50/50 split)
- Container padding: `theme.spacing.lg` (24px) on all sides for visual distinction
- Panel height: `calc(100vh - ${theme.spacing.lg * 2}px)` (accounts for container padding)
- Panel max-height: `calc(100vh - ${theme.spacing.lg * 2}px)` to enable scrolling
- **Full viewport width (100%) - spans entire screen horizontally**
- Maximum content width: Form content max-width increases to `theme.spacing.xxl * 12.5` (600px)
- Welcome content max-width: `theme.spacing.xxl * 12.5` (600px)
- Panel padding: `theme.spacing.xxl` (48px) on both panels
- Panel margins: `theme.spacing.lg` (24px) top and bottom for visual separation
- Form content side padding: `padding: 0 ${theme.spacing.md}px` (16px sides) for proper centering
- Form content vertical padding: `padding-top` and `padding-bottom` for scrollability
- Right panel: `justify-content: flex-start` (content starts at top, scrollable)
- Right panel: `overflow-y: auto` (enables scrolling when content exceeds viewport)
- Visual enhancements: Rounded corners (`border-radius: ${theme.radius.lg}px`), subtle shadows
- Decorative shapes: Full size and visibility
- **Input fields**: Same width (100% with `box-sizing: border-box`), properly aligned

### Desktop (1024px - 1439px)

- Two columns side-by-side (50/50 split)
- Full viewport height (100vh)
- **Full viewport width (100%) - spans entire screen horizontally**
- **No container padding or margins** - layout edge-to-edge
- Form content max-width: `theme.spacing.xxl * 10 + theme.spacing.md` (500px)
- Welcome content max-width: `theme.spacing.xxl * 12.5` (600px)
- Panel padding: `theme.spacing.xl + theme.spacing.md` (48px) on left, `theme.spacing.xl + theme.spacing.md` (48px) on right
- Form content side padding: `padding: 0 ${theme.spacing.sm}px` (8px sides) for proper centering
- Decorative shapes: Full size and visibility
- **Input fields**: Same width (100% with `box-sizing: border-box`), properly aligned

### Tablet (768px - 1023px)

- Stacked layout (left panel above form panel)
- **Full viewport width (100%) - spans entire screen horizontally**
- **No container padding or margins** - layout edge-to-edge
- Left panel:
  - `min-height: ${theme.spacing.xxl * 4 + theme.spacing.md}px` (200px)
  - Padding: `theme.spacing.lg` (24px) (internal padding only)
  - Welcome content: Full width (max-width removed)
- Right panel:
  - `min-height: calc(100vh - ${theme.spacing.xxl * 4 + theme.spacing.md}px)`
  - Padding: `theme.spacing.lg` (24px) (internal padding only)
  - Form content: Full width (max-width removed)
- Decorative shapes: Reduced size or hidden for better content focus
- Typography: Slightly reduced font sizes for better fit

### Mobile (320px - 767px)

- Stacked layout (left panel above form panel)
- Full viewport width (100%)
- Left panel:
  - `min-height: ${theme.spacing.xxl * 3 + theme.spacing.sm}px` (150px)
  - Padding: `theme.spacing.md` (16px)
  - Welcome content: Full width, reduced font sizes
  - Decorative shapes: Hidden or minimal
- Right panel:
  - `min-height: calc(100vh - ${theme.spacing.xxl * 3 + theme.spacing.sm}px)`
  - Padding: `theme.spacing.md` (16px)
  - Form content: Full width, optimized for touch targets
- Typography: Smaller font sizes for mobile readability
- Touch targets: Minimum 44px height for all interactive elements

### Small Mobile (320px - 480px)

- Same as Mobile but with additional optimizations:
  - **Full viewport width (100%) - spans entire screen horizontally**
  - **No container padding or margins** - layout edge-to-edge
  - Reduced padding: `theme.spacing.sm` (8px) where possible (internal padding only)
  - Compact spacing between form elements
  - Left panel: `min-height: ${theme.spacing.xxl * 2 + theme.spacing.md}px` (112px)
  - Welcome text: Single line or abbreviated if possible
  - Decorative shapes: Completely hidden
  - Form content side padding: `padding: 0 ${theme.spacing.sm}px` (8px sides) for proper centering
  - **Input fields**: Same width (100% with `box-sizing: border-box`), properly aligned, minimum 44px height

### Landscape Orientation (Mobile/Tablet)

- Maintain stacked layout
- Optimize for horizontal space:
  - Left panel: Reduced height, content more compact
  - Right panel: Increased height, better form visibility
  - Consider hiding welcome panel on very small landscape screens (< 600px height)

### Viewport Considerations

- Use `100vh` for full viewport height (handles mobile browser chrome)
- Use `100%` for full viewport width (spans entire screen horizontally)
- **No padding or margins on container** when in two-column mode - ensures edge-to-edge layout
- Consider `100dvh` (dynamic viewport height) for better mobile support where supported
- Prevent horizontal scrolling: `overflow-x: hidden` on containers
- Ensure content doesn't get cut off on small screens
- **Full horizontal span**: The layout must touch both left and right edges of the viewport with no gaps
- **Screen Component**: Must use `padding="none"` prop to prevent default padding that creates side gaps
- **No Global Styles Interference**: Ensure no body/html margin or padding styles interfere with full-width layout

## Styled Components Rules

Following `component-structure.mdc` and `theme-design.mdc`:

1. **Module-Level Constants**: All styled components defined as `const` at module level
2. **withConfig Required**: All styled components must use `.withConfig({ displayName, componentId })`
3. **Semantic HTML**: Web styles use semantic HTML elements (`styled.div`, `styled.main`)
4. **No Imports in Styles**: Style files only import `styled`, theme data, and primitives
5. **No Circular Dependencies**: Styles don't import other style files

### Example Structure

```javascript
const StyledTwoColumnContainer = styled.div.withConfig({
  displayName: 'StyledTwoColumnContainer',
  componentId: 'StyledTwoColumnContainer',
})`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  
  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }
`;
```

## Files Modified

1. **`hms-frontend/src/platform/components/layout/AuthFormLayout/AuthFormLayout.web.jsx`**

   - Added `layout` prop support (`'centered'` | `'two-column'`)
   - Added `welcomeTitle` and `welcomeDescription` props
   - Conditional rendering based on layout variant
   - **Full-width fix**: Added `padding="none"` prop to `Screen` component when in two-column mode to prevent default padding

2. **`hms-frontend/src/platform/components/layout/AuthFormLayout/AuthFormLayout.web.styles.jsx`**

   - `StyledTwoColumnContainer` - Full viewport container:
     - Desktop: `padding: ${theme.spacing.lg}px` (24px) on all sides for visual distinction
     - Tablet: `padding: ${theme.spacing.md}px` (16px) on all sides for visual distinction
     - Mobile: `padding: 0` (full width)
     - `box-sizing: border-box` to include padding in width calculations
   - `StyledLeftPanel` - Gradient welcome panel:
     - Responsive padding and margins for visual separation
     - Visual enhancements: `border-radius: ${theme.radius.lg}px`, subtle `box-shadow`
   - `StyledRightPanel` - White form panel:
     - Responsive padding and margins for visual separation
     - Height: `calc(100vh - ${theme.spacing.lg * 2}px)` on desktop (accounts for container padding)
     - Max-height: `calc(100vh - ${theme.spacing.lg * 2}px)` on desktop to enable scrolling
     - `justify-content: flex-start` (content starts at top, enables scrolling)
     - `overflow-y: auto` (enables scrolling when content exceeds viewport)
     - Explicit `padding-top` and `padding-bottom` for proper scrollability
     - Visual enhancements: `border-radius: ${theme.radius.lg}px`, subtle `box-shadow`
   - `StyledWelcomeContent` - Welcome text container
   - `StyledFormContent` - Form content wrapper:
     - Max-width and side padding for centering (varies by breakpoint)
     - `gap: ${theme.spacing.sm}px` for consistent spacing between form elements
     - `padding-top` and `padding-bottom` for proper scrollability
   - **Full-width fix**: `StyledAuthFormContainer` when `$isTwoColumn` is true:
     - `padding: 0`, `margin: 0`
     - `align-items: stretch` (removes vertical centering)
     - `justify-content: flex-start` (removes horizontal centering)
     - `width: 100%`, `max-width: 100%`

3. **`hms-frontend/src/platform/components/layout/AuthFormLayout/types.js`**

   - Added `LAYOUTS` constant with `CENTERED` and `TWO_COLUMN` values

4. **`hms-frontend/src/platform/layouts/AuthFrame/AuthFrame.web.jsx`**

   - Added `fullWidth` prop support
   - When `fullWidth={true}`: Renders children directly without card wrapper, hides header/footer
   - When `fullWidth={false}`: Default card-based layout with header/footer

5. **`hms-frontend/src/platform/layouts/AuthFrame/AuthFrame.web.styles.jsx`**

   - `StyledContainer`: When `$fullWidth` is true:
     - `padding: 0`, `margin: 0`
     - `justify-content: flex-start`, `align-items: stretch`
     - `width: 100%`, `max-width: 100%`
   - `StyledCard`: When `$fullWidth` is true:
     - `max-width: 100%`, `width: 100%`
     - `padding: 0`, `margin: 0`
     - `border-radius: 0`, `box-shadow: none`
     - `background-color: transparent`
   - `StyledContent`: When `$fullWidth` is true:
     - `width: 100%`, `max-width: 100%`
     - `margin: 0`, `padding: 0`

6. **`hms-frontend/src/app/(auth)/_layout.jsx`**

   - Detects login route (`pathname === '/login'`)
   - Passes `fullWidth={isLoginRoute}` prop to `AuthFrame` to enable full-width layout

7. **`hms-frontend/src/platform/layouts/common/ThemeProviderWrapper/ThemeProviderWrapper.jsx`**

   - Added global style reset using `createGlobalStyle` from styled-components
   - Ensures `html`, `body`, `#root` have `margin: 0`, `padding: 0`, `width: 100%`, `max-width: 100%`
   - Prevents browser default margins from interfering with full-width layouts

## Usage

```jsx
<AuthFormLayout
  layout="two-column"
  title="Login"
  welcomeTitle="Welcome to HMS"
  welcomeDescription="Sign in to access your healthcare management system..."
  status={statusSlot}
  actions={actionSlot}
  footer={footerSlot}
>
  {/* Form content */}
</AuthFormLayout>
```

## Accessibility

Following `accessibility.mdc` rules:

1. **Color Contrast**: Gradient text meets WCAG AA (4.5:1 ratio)
2. **Keyboard Navigation**: Proper tab order maintained
3. **Screen Readers**: All content properly labeled
4. **Focus States**: Visible focus indicators on all interactive elements
5. **Responsive**: Mobile layout fully accessible

## Multi-Device Responsive Testing

### Device Categories

1. **Small Mobile** (320px - 480px)

   - iPhone SE, small Android phones
   - Portrait and landscape orientations
   - Touch-optimized interactions

2. **Mobile** (481px - 767px)

   - Standard smartphones
   - Portrait and landscape orientations
   - Touch targets ≥ 44px

3. **Tablet** (768px - 1023px)

   - iPad, Android tablets
   - Portrait and landscape orientations
   - Hybrid touch/mouse interactions

4. **Desktop** (1024px - 1439px)

   - Laptops, small desktops
   - Mouse/keyboard interactions
   - Two-column layout

5. **Large Desktop** (≥ 1440px)

   - Large monitors, ultrawide screens
   - Maximum content width constraints
   - Optimized spacing and typography

### Responsive Features

1. **Fluid Typography**

   - Font sizes scale appropriately across breakpoints
   - Line heights adjust for readability
   - Welcome title: Scales from 32px (desktop) to 24px (mobile)
   - Form title: Scales from 14px (desktop) to 12px (mobile)

2. **Adaptive Spacing**

   - Padding reduces on smaller screens
   - Margins adjust for content density
   - Form field spacing optimized per breakpoint

3. **Content Optimization**

   - Welcome panel: Shorter on mobile, full on desktop
   - Decorative elements: Hidden on small screens
   - Form width: Constrained on desktop, full-width on mobile

4. **Touch Optimization**

   - Minimum touch target: 44px × 44px
   - Adequate spacing between interactive elements
   - Larger hit areas on mobile devices

5. **Orientation Handling**

   - Landscape mode optimizations
   - Content reflow for horizontal screens
   - Viewport height handling (100vh vs 100dvh)

## Testing Checklist

### Responsive Testing

- [ ] **Small Mobile (320px)**: Layout stacks, minimal padding, content readable, scrollable
- [ ] **Mobile (375px, 414px)**: Layout stacks, touch targets adequate, no horizontal scroll, scrollable
- [ ] **Tablet Portrait (768px)**: Stacked layout, moderate padding, content centered, scrollable
- [ ] **Tablet Landscape (1024px)**: Stacked or two-column based on height, scrollable
- [ ] **Desktop (1024px, 1280px)**: Two-column layout, proper spacing, visual distinction with padding, scrollable
- [ ] **Large Desktop (1440px, 1920px)**: Two-column layout, max-width constraints work, visual distinction with padding, scrollable
- [ ] **Ultrawide (2560px+)**: Content doesn't stretch too wide, maintains readability, visual distinction with padding

### Orientation Testing

- [ ] **Mobile Portrait**: Content fits, no overflow
- [ ] **Mobile Landscape**: Content adapts, welcome panel optimized
- [ ] **Tablet Portrait**: Proper stacking and spacing
- [ ] **Tablet Landscape**: Content layout adapts appropriately

### Cross-Browser Testing

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS and iOS)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

### Functional Testing

- [ ] Two-column layout displays correctly on desktop
- [ ] Gradient backgrounds use theme colors correctly
- [ ] Responsive breakpoints work correctly
- [ ] Mobile layout stacks properly
- [ ] Content is centered within panels
- [ ] Horizontal space is well utilized
- [ ] All theme tokens are used (no hardcoded values)
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Dark mode compatibility (if applicable)
- [ ] Touch interactions work on mobile devices
- [ ] Form inputs are easily tappable on mobile
- [ ] No horizontal scrolling on any device
- [ ] Content doesn't get cut off on small screens

## Success Criteria

1. **Full Screen Horizontal Span with Visual Distinction**: Layout spans 100% width with padding on desktop/tablet for visual distinction, full width on mobile
2. **Reasonable Form Padding**: Form content has appropriate side padding for proper centering and spacing on all devices
3. **Input Width Consistency**: All form inputs (identifier, password) have the same width (100% with `box-sizing: border-box`) and are properly positioned
4. **Password Input Alignment**: Password field renders correctly with proper flex alignment, matching identifier input width and styling
5. **Form Scrollability**: Form content scrolls properly when it exceeds viewport height, preventing components from being hidden
6. **Full Viewport Utilization**: Layout uses 100% width and 100vh height across all devices
7. **Theme Compliance**: All styling uses theme tokens (no hardcoded values)
8. **Content Alignment**: Content starts at top with `justify-content: flex-start` to enable proper scrolling
9. **Visual Enhancement**: Panels have rounded corners and subtle shadows for card-like appearance
10. **Multi-Device Responsive**:

   - Works perfectly on small mobile (320px) to large desktop (2560px+)
   - Handles portrait and landscape orientations
   - Optimizes content for each breakpoint
   - No horizontal scrolling on any device

5. **Touch Optimization**: All interactive elements meet minimum 44px touch target on mobile
6. **Accessibility**: Full WCAG AA compliance maintained across all devices
7. **Performance**: Smooth rendering and interactions on all devices
8. **Code Quality**: Follows project structure and rules

## Responsive Implementation Details

### Breakpoint Strategy

Use theme breakpoints with media queries:

```css
/* Desktop and above */
@media (min-width: ${({ theme }) => theme.breakpoints.desktop}px) {
  /* Two-column layout */
}

/* Tablet */
@media (min-width: ${({ theme }) => theme.breakpoints.tablet}px) and (max-width: ${({ theme }) => theme.breakpoints.desktop - 1}px) {
  /* Stacked layout with tablet spacing */
}

/* Mobile */
@media (max-width: ${({ theme }) => theme.breakpoints.tablet - 1}px) {
  /* Stacked layout with mobile spacing */
}

/* Small mobile */
@media (max-width: ${({ theme }) => theme.breakpoints.mobile * 1.5}px) {
  /* Compact mobile layout */
}
```

### Typography Scaling

- Welcome title: `theme.typography.fontSize.xxl + theme.spacing.sm` (32px) on desktop
- Welcome description: `theme.typography.fontSize.md - 1` (15px) on desktop
- Form title: `theme.typography.fontSize.sm` (14px) on desktop
- Scale down proportionally on smaller screens using theme tokens

### Spacing Strategy

- Desktop: `theme.spacing.xxl` (48px) for panels
- Tablet: `theme.spacing.lg` (24px) for panels
- Mobile: `theme.spacing.md` (16px) for panels
- Small mobile: `theme.spacing.sm` (8px) where appropriate

### Touch Target Optimization

- All buttons: Minimum 44px height on mobile
- Input fields: Minimum 44px height on mobile
- Links: Adequate spacing for easy tapping
- Checkboxes: Minimum 44px × 44px touch area

### Viewport Handling

- Use `100vh` for full viewport height
- Use `100%` for full viewport width (spans entire screen horizontally)
- **Container padding**: Desktop/Tablet have `theme.spacing.lg`/`theme.spacing.md` padding for visual distinction, Mobile has no padding
- Consider `100dvh` (dynamic viewport height) for better mobile browser support where supported
- Prevent horizontal overflow: `overflow-x: hidden` on containers
- **Enable vertical scrolling**: `overflow-y: auto` on right panel to prevent content from being hidden
- **Content alignment**: `justify-content: flex-start` on right panel to enable proper scrolling
- **Max-height constraints**: Panels have `max-height` set to enable scrolling when content exceeds viewport
- Handle mobile browser chrome (address bar) with proper viewport units
- **Full horizontal span**: The layout spans entire screen with padding for visual distinction on desktop/tablet

## Notes

- Layout variant prop maintains backward compatibility with existing `AuthFormLayout` usage
- Decorative elements in left panel use CSS pseudo-elements (no additional components)
- Form content max-width prevents text from being too wide on large screens
- All spacing and typography must use theme tokens
- No hardcoded colors, spacing, or typography values
- Responsive breakpoints must use `theme.breakpoints.*` values
- Touch targets must meet minimum 44px on mobile devices
- Layout must work in both portrait and landscape orientations
- Content must never overflow horizontally on any device
- Typography and spacing should scale smoothly across breakpoints
- **Layout spans entire screen horizontally** - with padding on desktop/tablet for visual distinction, full width on mobile
- **Visual distinction** - panels have rounded corners and subtle shadows for card-like appearance on desktop/tablet
- **Form content centering** - form content has reasonable side padding for proper centering on all devices
- **Form scrollability** - form content scrolls properly when it exceeds viewport height (`overflow-y: auto`, `justify-content: flex-start`)
- **Input width consistency** - all form inputs (identifier, password) must have the same width (100% with `box-sizing: border-box`)
- **Input positioning** - all inputs must be properly aligned and positioned on the login form
- **Password input alignment** - password field uses proper flex alignment to match identifier input
- **Forgot password link** - styled as plain underlined link (transparent background, primary color)
- **Sign-in button spacing** - positioned close to form elements (reduced margin-top)
- **Cross-platform compatibility** - applies to all devices: native, mobile, web, desktop, tablets