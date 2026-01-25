# Two-Column Gradient Login Form Transformation Plan

## Overview

Transform the existing single-column centered card login form into a modern two-column layout with gradient backgrounds, rounded input fields with icons, and a polished design while maintaining all existing functionality and respecting the theme system.

**Platform Coverage**: This plan applies to all devices and platforms:

- **Web**: Desktop, tablet, mobile browsers
- **Native**: iOS and Android mobile applications
- **Responsive**: Adapts to all screen sizes from 320px to 2560px+
- **Form Centering**: Form content is centered with reasonable padding/margins on all devices
- **Input Consistency**: All form inputs (identifier, password) have the same width and proper positioning

## Current Architecture

- **Layout**: Single-column centered card using `AuthFormLayout` component
- **Components**: `LoginScreen.web.jsx` with `TextField`, `PasswordField`, `Button`, `ErrorState`
- **Styling**: Theme-driven using styled-components with semantic tokens
- **Structure**: Card-based layout with header, body (form), and footer sections

## Target Design

- **Layout**: Two-column (50/50 split) with left welcome panel and right form panel
- **Background**: Gradient using `theme.colors.primary` and `theme.colors.secondary`
- **Input Style**: Rounded inputs (border-radius: 20px) with leading icons
- **Button**: Gradient button using theme colors
- **Responsive**: Stacks vertically on mobile

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                    Full Viewport                        │
│  ┌──────────────────┬────────────────── ┐               │
│  │  Left Panel      │  Right Panel      │               │
│  │  (Welcome)       │  (Login Form)     │               │
│  │  50% width       │  50% width        │               │
│  │                  │                   │               │
│  │  Gradient BG     │  White BG         │               │
│  │  (Primary →      │  (#FFFFFF)        │               │
│  │   Secondary)     │                   │               │
│  │                  │  ┌─────────────┐  │               │
│  │  Welcome Text    │  │ USER LOGIN   │ │               │
│  │  Description     │  └─────────────┘  │               │
│  │  Decorative      │  ┌─────────────┐  │               │
│  │  Shapes          │  │ 👤 Username │ │                │
│  │                  │  └─────────────┘ │                │
│  │                  │  ┌─────────────┐ │                │
│  │                  │  │ 🔒 Password │ │                │
│  │                  │  └─────────────┘ │                │
│  │                  │  [Remember] [FP] │                │
│  │                  │  ┌─────────────┐ │                │
│  │                  │  │   LOGIN     │ │                │
│  │                  │  └─────────────┘ │                │
│  └──────────────────┴──────────────────┘                │
└─────────────────────────────────────────────────────────┘
```

## Design Principles

1. **Theme-Driven**: All colors must use theme tokens (primary, secondary for gradients)
2. **Accessibility First**: Maintain WCAG AA compliance, keyboard navigation, screen reader support
3. **Responsive**: Mobile-first with breakpoint optimizations across all devices (native, mobile, web, desktop, tablets)
4. **Functionality Preserved**: All existing features (biometric, error handling, etc.) must work
5. **Form Centering**: Form content should be centered with reasonable padding/margins on all screen sizes
6. **Input Consistency**: All form inputs (identifier, password) must have the same width and proper positioning

## Implementation Plan

### 1. Layout Transformation

**File: `hms-frontend/src/platform/components/layout/AuthFormLayout/AuthFormLayout.web.jsx`**

- Replace single card layout with two-column container
- Remove or conditionally render Card wrapper (based on layout variant prop)
- Create left panel for welcome/branding content
- Create right panel for login form
- Add new optional prop: `layout` (default: 'centered' for backward compatibility, 'two-column' for new design)
- Maintain existing props structure for backward compatibility
- When layout is 'two-column':
  - Render `StyledTwoColumnContainer` with `StyledLeftPanel` and `StyledRightPanel`
  - Welcome content goes in left panel
  - Form content goes in right panel

**File: `hms-frontend/src/platform/components/layout/AuthFormLayout/AuthFormLayout.web.styles.jsx`**

- Replace `StyledAuthFormContainer` with page-level gradient background
- Create `StyledTwoColumnContainer`:
  - Flexbox layout (flex-direction: row on desktop)
  - Width: 80-85% of viewport
  - Height: 65-70% of viewport
  - Centered horizontally and vertically
  - Border-radius: ≤ 4px (very subtle) or none
  - Background: Transparent (panels define their own backgrounds)
- Create `StyledLeftPanel`:
  - Width: 50% on desktop
  - Gradient background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`
  - Padding: `theme.spacing.xl` to `theme.spacing.xxl` (32-48px)
- Create `StyledRightPanel`:
  - Width: 50% on desktop
  - Background: `theme.colors.background.primary` (white)
  - Padding: 
    - Desktop: `theme.spacing.xl + theme.spacing.md` (48px)
    - Large Desktop: `theme.spacing.xxl` (48px)
    - Tablet: `theme.spacing.lg` (24px)
    - Mobile: `theme.spacing.md` (16px)
  - Form content has additional side padding for proper centering
- Add responsive breakpoints:
  - Desktop (> 768px): Two columns side-by-side (flex-direction: row)
  - Tablet (≤ 768px): Stacked (flex-direction: column), left panel above form
  - Mobile (≤ 480px): Stacked, hide decorative elements, full-width panels

### 2. Welcome Panel (Left Column)

**File: `hms-frontend/src/platform/components/layout/AuthFormLayout/AuthFormLayout.web.jsx`**

- Add welcome panel content slot (new prop: `welcomeContent` or use `description` prop)
- Display welcome heading: "Welcome to website" (from i18n or prop)
- Display description text (lorem ipsum placeholder or from i18n)
- Use i18n for text content
- Optional: Add decorative elements (abstract shapes) using CSS pseudo-elements

**File: `hms-frontend/src/platform/components/layout/AuthFormLayout/AuthFormLayout.web.styles.jsx`**

- Style welcome panel with:
  - Gradient background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`
  - Padding: `theme.spacing.xl` (32px) to `theme.spacing.xxl` (48px)
  - Vertical centering of content (flexbox: align-items: center)
  - Horizontal alignment: Left
  - Text color: `theme.colors.text.inverse` (white)
  - Heading: Font size 28-32px, font weight 600-700, margin-bottom `theme.spacing.sm`
  - Description: Font size 14-15px, line-height 1.6, color `rgba(255,255,255,0.85)`, max-width 80%
  - Decorative shapes: CSS-based using ::before/::after or absolute positioned divs

### 3. Form Panel (Right Column)

**File: `hms-frontend/src/platform/components/layout/AuthFormLayout/AuthFormLayout.web.styles.jsx`**

- Style form panel with:
  - Background: `theme.colors.background.primary` (white)
  - Padding: `theme.spacing.xl` (32px)
  - Vertical centering of form content (flexbox: justify-content: center)
  - Display: Flex, column direction
  - Align items: Center
- Remove card wrapper when using two-column layout (form is directly in panel)

### 4. Input Field Styling

**File: `hms-frontend/src/platform/screens/auth/LoginScreen/LoginScreen.web.jsx`**

- Add icon prefixes to TextField and PasswordField using Icon component:
- Email field: User icon glyph (e.g., "👤" or appropriate Unicode/emoji)
- Password field: Lock icon glyph (e.g., "🔒" or appropriate Unicode/emoji)
- Icon color: `theme.colors.text.tertiary` (#B0B0C3)
- Icon size: Small or medium

**File: `hms-frontend/src/platform/screens/auth/LoginScreen/LoginScreen.web.styles.jsx`**

- Override input field styles for login form:
- **Width Consistency**: Ensure all inputs (identifier, password) have the same width:
  - `width: 100%` on both TextField and PasswordField containers
  - `width: 100%` on input elements with `box-sizing: border-box`
  - Same margin-bottom spacing between fields
- **Proper Positioning**: Ensure inputs are properly aligned and positioned
- Border radius: 20px (pill shape, using fixed value or calculate from theme)
- Background: `theme.colors.background.secondary` (#F2F2F7)
- Border: None
- Height: 40px (desktop), 44px (mobile for touch targets)
- Padding-left: 40px (for icon space)
- Font size: `theme.typography.fontSize.sm` (14px)
- Hide or style labels to be smaller/uppercase (optional)

**File: `hms-frontend/src/platform/components/forms/TextField/TextField.web.styles.jsx`**

- Ensure prefix icons are properly positioned
- Add support for custom border-radius via props or variant (if needed)

### 5. Remember Me & Forgot Password Row

**File: `hms-frontend/src/platform/screens/auth/LoginScreen/LoginScreen.web.jsx`**

- Add "Remember Me" checkbox between password field and login button
- Use Checkbox component from `@platform/components`
- Import and use Checkbox with:
- Label: "Remember" (from i18n or hardcoded)
- State management: Add to `useLoginScreen` hook
- Keep existing "Forgot Password" link (Button component with variant="text")

**File: `hms-frontend/src/platform/screens/auth/LoginScreen/LoginScreen.web.styles.jsx`**

- Style options row:
- Font size: `theme.typography.fontSize.xs` (12px)
- Color: `theme.colors.text.tertiary` (#9A9A9A) for checkbox label
- Spacing: `theme.spacing.sm` between elements (using `gap` property)
- **Forgot Password Link Styling**:
  - `background: transparent` (no background)
  - `color: ${theme.colors.primary}` (primary color for link)
  - `text-decoration: underline` (underlined link appearance)
  - `border: none`, `box-shadow: none` (no button-like styling)
  - Hover state: opacity change, no background change

### 6. Login Button Styling

**File: `hms-frontend/src/platform/components/forms/Button/Button.web.styles.jsx`**

- Add gradient variant or allow gradient prop
- Gradient button style:
- Background: `linear-gradient(90deg, ${theme.colors.secondary}, ${theme.colors.primary})`
- Border radius: 20px (pill shape)
- Width: 140px (fixed)
- Height: 38px (fixed)
- Text: Uppercase, letter-spacing: 0.5px
- Font size: `theme.typography.fontSize.sm` (13px)

**Alternative**: Create custom styled button in LoginScreen styles if Button component doesn't support gradients

### 7. Form Title Styling

**File: `hms-frontend/src/platform/components/layout/AuthFormLayout/AuthFormLayout.web.jsx`**

- Update title styling for form panel:
- Font size: `theme.typography.fontSize.sm` (14px)
- Font weight: 600
- Letter spacing: 1px
- Text transform: Uppercase
- Color: `theme.colors.text.secondary` (#7B7B7B)
- Margin-bottom: `theme.spacing.lg` (24px)

### 8. Background Gradient

**File: `hms-frontend/src/platform/components/layout/AuthFormLayout/AuthFormLayout.web.styles.jsx`**

- Add page-level gradient background:
- Direction: Top-left to bottom-right (135deg)
- Colors: `theme.colors.primary` → `theme.colors.secondary`
- Full viewport coverage

### 9. Responsive Behavior

**File: `hms-frontend/src/platform/components/layout/AuthFormLayout/AuthFormLayout.web.styles.jsx`**

- Desktop (> 768px):
- Two columns side-by-side
- Full height layout
- Card width: 80-85% of viewport
- Card height: 65-70% of viewport

- Tablet (≤ 768px):
- Stack layout (left panel above form)
- Reduce padding to `theme.spacing.lg` (32px)
- Slightly reduce heading size

- Mobile (≤ 480px):
- Stack layout
- Hide decorative elements in left panel
- Reduce padding to `theme.spacing.md` (16px)
- Full-width form panel

### 10. Icon Integration

**File: `hms-frontend/src/platform/screens/auth/LoginScreen/LoginScreen.web.jsx`**

- Import Icon component
- Add user icon to email field prefix
- Add lock icon to password field prefix
- Icon color: `theme.colors.text.tertiary` (#B0B0C3)
- Icon size: Small/medium

**Note**: If Icon component uses glyphs, use appropriate glyph characters or create icon variants

## Files to Modify

1. **`hms-frontend/src/platform/components/layout/AuthFormLayout/AuthFormLayout.web.jsx`**

- Restructure to two-column layout
- Add welcome panel content
- Maintain existing props for backward compatibility

2. **`hms-frontend/src/platform/components/layout/AuthFormLayout/AuthFormLayout.web.styles.jsx`**

- Create two-column container styles
- Add gradient backgrounds
- Implement responsive breakpoints
- Style welcome and form panels

3. **`hms-frontend/src/platform/screens/auth/LoginScreen/LoginScreen.web.jsx`**

- Add icon prefixes to input fields
- Add "Remember Me" checkbox
- Update form structure
- Import Checkbox and Icon components

4. **`hms-frontend/src/platform/screens/auth/LoginScreen/useLoginScreen.js`**

- Add `rememberMe` state (useState)
- Add `handleRememberMeChange` handler
- Optionally: Persist rememberMe to localStorage
- Optionally: Load saved identifier if rememberMe was true

5. **`hms-frontend/src/platform/screens/auth/LoginScreen/LoginScreen.web.styles.jsx`**

- Override input field styles for rounded/pill shape
- **Ensure all inputs have same width**: 
  - `width: 100%` on both TextField and PasswordField containers
  - `box-sizing: border-box` for consistent sizing
  - Same margin-bottom spacing between fields
- **Password Field Alignment**:
  - PasswordField DOM structure: `div[data-testid*="password"] `(View/div) > `div` (TextField StyledContainer) > `div` (StyledInputContainer) > `input`
  - Target input container: `div[data-testid*="password"] > div > div`
  - Ensure `display: flex`, `flex-direction: row`, `align-items: center` on input container for proper alignment
  - Input element: `flex: 1` to fill available space, `width: 100%`, `box-sizing: border-box`
  - Prefix icon: Absolutely positioned with `left: ${theme.spacing.md}px`, `z-index: 1`
  - Suffix icon: Absolutely positioned with `right: ${theme.spacing.sm}px`, `z-index: 1`
  - Input padding: `padding-left: ${theme.spacing.xl + theme.spacing.xs}px` to accommodate prefix icon
- Style options row (Remember Me + Forgot Password)
- **Forgot Password Link**: Style as plain link (transparent background, underlined, primary color)
- Custom button styling if needed
- **Sign-in Button Spacing**: 
  - Reduced `margin-top` on `StyledActions` from `theme.spacing.md` to `theme.spacing.sm`
  - Button positioned close to form elements (not far away at bottom)
- **Proper positioning**: Ensure identifier and password inputs are aligned and positioned correctly

6. **`hms-frontend/src/platform/components/forms/TextField/TextField.web.styles.jsx`** (if needed)

- Add support for pill/rounded variant
- Ensure prefix icon positioning works correctly

7. **`hms-frontend/src/platform/components/forms/Button/Button.web.styles.jsx`** (if needed)

- Add gradient variant support
- Or create custom button in LoginScreen styles

## Theme Token Usage

**Colors**:

- `theme.colors.primary` - Gradient start color
- `theme.colors.secondary` - Gradient end color
- `theme.colors.background.primary` - Form panel background (white)
- `theme.colors.background.secondary` - Input field background (#F2F2F7)
- `theme.colors.text.inverse` - Welcome panel text (white)
- `theme.colors.text.secondary` - Form title color
- `theme.colors.text.tertiary` - Helper text, icons, links

**Spacing**:

- `theme.spacing.xl` (32px) - Panel padding
- `theme.spacing.lg` (24px) - Title margin, options row margin
- `theme.spacing.md` (16px) - Mobile padding
- `theme.spacing.sm` (8px) - Field spacing, options row spacing
- `theme.spacing.xs` (4px) - Tight spacing

**Typography**:

- `theme.typography.fontSize.sm` (14px) - Form title, input text
- `theme.typography.fontSize.xs` (12px) - Options row text
- `theme.typography.fontWeight.semibold` (600) - Title, button text

**Radius**:

- 20px (fixed) - Input fields, button (pill shape)
- Note: `theme.radius.full` (9999) is too large, use fixed 20px for pill shape
- `theme.radius.md` - Card corners (if needed)

## Accessibility Considerations

1. **Color Contrast**: Ensure gradient text meets WCAG AA (4.5:1 ratio)
2. **Keyboard Navigation**: Maintain proper tab order
3. **Screen Readers**: All icons must have proper aria-labels
4. **Focus States**: Visible focus indicators on all interactive elements
5. **Responsive**: Ensure mobile layout is fully accessible

## Responsive Breakpoints

- **Desktop**: > 768px - Two columns side-by-side
- **Tablet**: ≤ 768px - Stacked layout, reduced padding
- **Mobile**: ≤ 480px - Stacked layout, minimal padding, hide decorations

## Testing Checklist

- [ ] Two-column layout displays correctly on desktop
- [ ] Gradient backgrounds use theme colors correctly
- [ ] Input fields have rounded/pill shape with icons
- [ ] **Input width consistency**: Identifier and password inputs have the same width
- [ ] **Input positioning**: All inputs are properly aligned and positioned
- [ ] **Password input alignment**: Password field renders correctly with proper flex alignment
- [ ] **Form centering**: Form content is centered with reasonable padding on all devices
- [ ] **Form scrollability**: Form content scrolls properly when it exceeds viewport height
- [ ] **Components not hidden**: All form components are accessible via scrolling
- [ ] Remember Me checkbox works and saves state
- [ ] **Forgot password link**: Appears as plain underlined link (no background, primary color)
- [ ] Login button has gradient background
- [ ] **Sign-in button spacing**: Button is positioned close to form elements (not far away)
- [ ] Responsive breakpoints work correctly on all devices (native, mobile, web, desktop, tablets)
- [ ] Mobile layout stacks properly
- [ ] All existing functionality preserved (biometric, errors, etc.)
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Dark mode compatibility (if applicable)
- [ ] Cross-browser compatibility
- [ ] Form validation works
- [ ] Error states display correctly
- [ ] Touch targets meet minimum 44px on mobile devices

## Success Criteria

1. **Visual Design**: Matches two-column gradient design specification
2. **Form Centering**: Form content is centered with reasonable padding/margins on all screen sizes and devices
3. **Input Width Consistency**: All form inputs (identifier, password) have the same width (100% with `box-sizing: border-box`)
4. **Input Positioning**: All inputs are properly aligned and positioned on the login form
5. **Password Input Alignment**: Password field renders correctly with proper flex alignment (`display: flex`, `flex-direction: row`, `align-items: center`)
6. **Forgot Password Link**: Appears as plain underlined link with primary color, no background, transparent styling
7. **Sign-in Button Spacing**: Button positioned close to form elements (reduced margin-top on actions container)
8. **Form Scrollability**: Form content scrolls properly when it exceeds viewport height, preventing components from being hidden
9. **Theme Compliance**: All colors use theme tokens
10. **Functionality**: All existing features work correctly
11. **Responsive**: Works perfectly on all devices (native, mobile, web, desktop, tablets)
12. **Accessibility**: Full WCAG AA compliance maintained
13. **Performance**: No performance degradation
14. **Code Quality**: Follows project structure and rules

## Implementation Strategy

### Option A: Layout Variant Prop (Recommended)

- Add `layout` prop to `AuthFormLayout` with values: `'centered'` (default) or `'two-column'`
- Maintains backward compatibility
- Other auth screens can continue using centered layout

### Option B: Direct Transformation

- Transform `AuthFormLayout` directly to two-column
- Simpler but breaks backward compatibility
- Requires updating all auth screens

**Recommendation**: Use Option A for backward compatibility

### Welcome Content Strategy

- Add optional `welcomeTitle` and `welcomeDescription` props to `AuthFormLayout`
- Or use existing `description` prop for welcome content
- Default welcome text can be from i18n keys: `auth.login.welcome.title` and `auth.login.welcome.description`

## Notes

- Gradient colors will use `theme.colors.primary` (#007AFF) and `theme.colors.secondary` (#5856D6)
- All spacing and typography must use theme tokens
- Maintain backward compatibility with existing AuthFormLayout usage (use layout variant prop)
- Decorative elements in left panel are optional and can be CSS-based (abstract shapes)
- "Remember Me" functionality: Store in localStorage for now (backend support can be added later)
- Icon glyphs: Use emoji or Unicode characters (👤 for user, 🔒 for lock) via Icon component
- Border radius: Use fixed 20px for pill shapes (not theme.radius.full which is 9999)
- Card wrapper: Remove or make transparent for two-column layout
- Form title: "USER LOGIN" in uppercase, small font, gray color
- Input labels: Can be hidden or styled as smaller/uppercase to match design
- Button width: Fixed 140px as per design spec