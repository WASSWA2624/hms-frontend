/**
 * Breadcrumbs Component - iOS
 * Navigation path indicator
 * File: Breadcrumbs.ios.jsx
 */
import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import Button from '@platform/components/forms/Button';
import Icon from '@platform/components/display/Icon';
import { useI18n } from '@hooks';
import breakpoints from '@theme/breakpoints';
import {
  StyledBreadcrumbs,
  StyledBreadcrumbsList,
  StyledBreadcrumbsActions,
  StyledBreadcrumbItem,
  StyledSeparator,
  StyledLink,
  StyledBreadcrumbText,
  StyledBreadcrumbIcon,
} from './Breadcrumbs.ios.styles';

const BACK_ICON_GLYPH = '\u2190';

/**
 * Breadcrumbs component for iOS
 * @param {Object} props - Breadcrumbs props
 * @param {Array<BreadcrumbItem>} props.items - Array of breadcrumb items
 * @param {string} props.separator - Separator character (default: '/')
 * @param {Function} props.onItemPress - Item press handler
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 * @param {boolean} props.showBackButton - Whether to show back button
 * @param {Function} props.onBack - Optional back handler
 * @param {React.ReactNode} props.actionsBeforeBack - Optional actions rendered before back button
 */
const BreadcrumbsIOS = ({
  items = [],
  separator = '/',
  onItemPress,
  accessibilityLabel,
  testID,
  style,
  showBackButton = true,
  onBack,
  actionsBeforeBack,
  ...rest
}) => {
  const { t } = useI18n();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isCompact = width < breakpoints.tablet;

  if (!items || items.length === 0) return null;

  const handleItemPress = (item, index) => {
    if (onItemPress) {
      onItemPress(item, index);
    } else if (item.href) {
      router.push(item.href);
    } else if (item.onPress) {
      item.onPress(item);
    }
  };

  const fallbackItem = useMemo(() => {
    if (!items?.length) return null;
    for (let i = items.length - 2; i >= 0; i -= 1) {
      const candidate = items[i];
      if (candidate?.href || candidate?.onPress) {
        return candidate;
      }
    }
    return null;
  }, [items]);

  const canGoBack = useMemo(() => {
    if (onBack) return true;
    if (fallbackItem) return true;
    if (typeof router?.canGoBack === 'function') {
      return router.canGoBack();
    }
    return false;
  }, [onBack, fallbackItem, router]);

  const handleBack = useCallback(() => {
    if (!canGoBack) return;
    if (onBack) {
      onBack();
      return;
    }
    if (typeof router?.canGoBack === 'function' && router.canGoBack() && router?.back) {
      router.back();
      return;
    }
    if (fallbackItem) {
      handleItemPress(fallbackItem, -1);
      return;
    }
    if (router?.push) {
      router.push('/');
    }
  }, [canGoBack, onBack, router, fallbackItem]);

  return (
    <StyledBreadcrumbs
      accessibilityRole="list"
      accessibilityLabel={accessibilityLabel || t('navigation.breadcrumbs.title')}
      testID={testID}
      style={style}
      {...rest}
    >
      <StyledBreadcrumbsList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const hasLink = !isLast && (item.href || item.onPress || onItemPress);

          return (
            <React.Fragment key={index}>
              {index > 0 && <StyledSeparator>{separator}</StyledSeparator>}
              {hasLink ? (
                <StyledLink
                  onPress={() => handleItemPress(item, index)}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                  testID={testID ? `${testID}-item-${index}` : undefined}
                >
                  {item.icon && (
                    <StyledBreadcrumbIcon>
                      <Icon glyph={item.icon} size="xs" decorative />
                    </StyledBreadcrumbIcon>
                  )}
                  <StyledBreadcrumbText isLink>{item.label}</StyledBreadcrumbText>
                </StyledLink>
              ) : (
                <StyledBreadcrumbItem
                  accessibilityRole="text"
                  accessibilityLabel={item.label}
                >
                  {item.icon && (
                    <StyledBreadcrumbIcon>
                      <Icon glyph={item.icon} size="xs" decorative />
                    </StyledBreadcrumbIcon>
                  )}
                  <StyledBreadcrumbText isLast={isLast}>{item.label}</StyledBreadcrumbText>
                </StyledBreadcrumbItem>
              )}
            </React.Fragment>
          );
        })}
      </StyledBreadcrumbsList>
      {showBackButton || actionsBeforeBack ? (
        <StyledBreadcrumbsActions>
          {actionsBeforeBack || null}
          {showBackButton ? (
            <Button
              variant="surface"
              size="medium"
              onPress={canGoBack ? handleBack : undefined}
              disabled={!canGoBack}
              accessibilityRole="button"
              accessibilityLabel={t('common.back')}
              testID={testID ? `${testID}-back` : undefined}
              icon={<Icon glyph={BACK_ICON_GLYPH} size="xs" decorative />}
            >
              {!isCompact ? t('common.back') : null}
            </Button>
          ) : null}
        </StyledBreadcrumbsActions>
      ) : null}
    </StyledBreadcrumbs>
  );
};

export default BreadcrumbsIOS;
