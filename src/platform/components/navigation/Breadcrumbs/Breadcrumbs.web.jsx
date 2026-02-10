/**
 * Breadcrumbs Component - Web
 * Navigation path indicator with responsive truncation
 * File: Breadcrumbs.web.jsx
 */
import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import Text from '@platform/components/display/Text';
import Icon from '@platform/components/display/Icon';
import { useI18n } from '@hooks';
import breakpoints from '@theme/breakpoints';
import {
  StyledBreadcrumbs,
  StyledBreadcrumbsList,
  StyledBreadcrumbsActions,
  StyledBackButton,
  StyledBackLabel,
  StyledBreadcrumbItem,
  StyledSeparator,
  StyledBreadcrumbLink,
  StyledBreadcrumbButton,
  StyledBreadcrumbIcon,
  StyledBreadcrumbEllipsis,
} from './Breadcrumbs.web.styles';

/**
 * Breadcrumb item structure
 * @typedef {Object} BreadcrumbItem
 * @property {string} label - Breadcrumb label
 * @property {string} [href] - Link URL (optional for current item)
 * @property {string|React.ReactNode} [icon] - Icon for breadcrumb item
 * @property {Function} [onPress] - Press handler (alternative to href)
 */

/**
 * Breadcrumbs component for Web
 * @param {Object} props - Breadcrumbs props
 * @param {Array<BreadcrumbItem>} props.items - Array of breadcrumb items
 * @param {string} props.separator - Separator character (default: '/')
 * @param {Function} props.onItemPress - Item press handler
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 * @param {boolean} props.showBackButton - Whether to show back button
 * @param {Function} props.onBack - Optional back handler
 */
const BreadcrumbsWeb = ({
  items = [],
  separator = '/',
  onItemPress,
  accessibilityLabel,
  testID,
  className,
  style,
  maxItems = 5, // Maximum items to show before truncation
  showBackButton = true,
  onBack,
  ...rest
}) => {
  const { t } = useI18n();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < breakpoints.tablet;

  if (!items || items.length === 0) return null;

  // Truncate breadcrumbs on mobile or when too many items
  const displayItems = useMemo(() => {
    if (items.length <= maxItems && !isMobile) {
      return items;
    }

    // On mobile or when too many items, show: first, ellipsis, last 2 items
    if (items.length <= 2) {
      return items;
    }

    // Show first item, ellipsis, and last 2 items
    const first = items[0];
    const lastTwo = items.slice(-2);
    return [
      first,
      { label: '...', isEllipsis: true },
      ...lastTwo,
    ];
  }, [items, maxItems, isMobile]);

  const handleItemPress = (item, index) => {
    if (onItemPress) {
      onItemPress(item, index);
    } else if (item.href) {
      router.push(item.href);
    } else if (item.onPress) {
      item.onPress(item);
    }
  };

  const handleItemKeyDown = (event, item, index) => {
    // Handle Enter and Space keys for keyboard navigation
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const isLast = index === displayItems.length - 1;
      if (!isLast && !item.isEllipsis) {
        handleItemPress(item, index);
      }
    }
  };

  const canGoBack = useMemo(() => {
    if (onBack) return true;
    if (typeof router?.canGoBack === 'function') {
      return router.canGoBack();
    }
    if (typeof window !== 'undefined' && window.history) {
      return window.history.length > 1;
    }
    return true;
  }, [onBack, router]);

  const handleBack = useCallback(() => {
    if (!canGoBack) return;
    if (onBack) {
      onBack();
      return;
    }
    if (router?.back) {
      router.back();
      return;
    }
    if (router?.push) {
      router.push('/');
    }
  }, [canGoBack, onBack, router]);

  return (
    <StyledBreadcrumbs
      role="navigation"
      aria-label={accessibilityLabel || t('navigation.breadcrumbs.title')}
      testID={testID}
      data-testid={testID}
      className={className}
      style={style}
      {...rest}
    >
      <StyledBreadcrumbsList>
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.isEllipsis;
          const hasLink = !isLast && !isEllipsis && (item.href || item.onPress || onItemPress);
          const isAnchor = hasLink && item.href;

          const handleClick = (e) => {
            e.preventDefault();
            handleItemPress(item, index);
          };

          return (
            <React.Fragment key={index}>
              {index > 0 && <StyledSeparator>{separator}</StyledSeparator>}
              {isEllipsis ? (
                <StyledBreadcrumbEllipsis aria-hidden="true">
                  {item.label}
                </StyledBreadcrumbEllipsis>
              ) : hasLink ? isAnchor ? (
                <StyledBreadcrumbLink
                  href={item.href}
                  onClick={handleClick}
                  onKeyDown={(event) => handleItemKeyDown(event, item, index)}
                  aria-label={item.label}
                  testID={testID ? `${testID}-item-${index}` : undefined}
                  data-testid={testID ? `${testID}-item-${index}` : undefined}
                >
                  {item.icon && (
                    <StyledBreadcrumbIcon>
                      <Icon glyph={item.icon} size="xs" decorative />
                    </StyledBreadcrumbIcon>
                  )}
                  <Text numberOfLines={1} ellipsizeMode="tail">
                    {item.label}
                  </Text>
                </StyledBreadcrumbLink>
              ) : (
                <StyledBreadcrumbButton
                  type="button"
                  onClick={handleClick}
                  onKeyDown={(event) => handleItemKeyDown(event, item, index)}
                  aria-label={item.label}
                  testID={testID ? `${testID}-item-${index}` : undefined}
                  data-testid={testID ? `${testID}-item-${index}` : undefined}
                >
                  {item.icon && (
                    <StyledBreadcrumbIcon>
                      <Icon glyph={item.icon} size="xs" decorative />
                    </StyledBreadcrumbIcon>
                  )}
                  <Text numberOfLines={1} ellipsizeMode="tail">
                    {item.label}
                  </Text>
                </StyledBreadcrumbButton>
              ) : (
                <StyledBreadcrumbItem
                  $isLast={isLast}
                  role="text"
                  aria-label={item.label}
                >
                  {item.icon && (
                    <StyledBreadcrumbIcon>
                      <Icon glyph={item.icon} size="xs" decorative />
                    </StyledBreadcrumbIcon>
                  )}
                  <Text numberOfLines={1} ellipsizeMode="tail">
                    {item.label}
                  </Text>
                </StyledBreadcrumbItem>
              )}
            </React.Fragment>
          );
        })}
      </StyledBreadcrumbsList>
      {showBackButton ? (
        <StyledBreadcrumbsActions>
          <StyledBackButton
            type="button"
            onClick={canGoBack ? handleBack : undefined}
            disabled={!canGoBack}
            aria-label={t('common.back')}
            data-testid={testID ? `${testID}-back` : undefined}
            testID={testID ? `${testID}-back` : undefined}
          >
            <Icon glyph="←" size="xs" decorative />
            <StyledBackLabel>{t('common.back')}</StyledBackLabel>
          </StyledBackButton>
        </StyledBreadcrumbsActions>
      ) : null}
    </StyledBreadcrumbs>
  );
};

export default BreadcrumbsWeb;
