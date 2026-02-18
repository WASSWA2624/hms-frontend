/**
 * ListItem Component - Web
 * List item with actions, avatar, metadata
 * File: ListItem.web.jsx
 */
// 1. External dependencies
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { useTheme } from 'styled-components';

// 3. Hooks and utilities (absolute imports via aliases)
import { useI18n } from '@hooks';
import { humanizeDisplayText } from '@utils';

// 2. Platform components (direct import to avoid require cycle)
import Avatar from '@platform/components/display/Avatar';
import Badge from '@platform/components/display/Badge';
import Icon from '@platform/components/display/Icon';

// 4. Styles (relative import - platform-specific)
import {
  StyledListItem,
  StyledListItemContent,
  StyledTitleRow,
  StyledBadgeSlot,
  StyledListItemActions,
  StyledActionSlot,
  StyledActionButton,
  StyledActionButtonLabel,
  StyledTitle,
  StyledSubtitle,
} from './ListItem.web.styles';

const ACTION_ICON_GLYPHS = {
  view: '👁',
  edit: '✎',
  delete: '🗑',
};

const ACTION_ICON_TONES = {
  view: 'primary',
  edit: 'warning',
  delete: 'error',
};

/**
 * ListItem component for Web
 * @param {Object} props - ListItem props
 * @param {React.ReactNode} props.children - List item content
 * @param {string|Object} props.avatar - Avatar source or props
 * @param {string} props.title - List item title
 * @param {string} props.subtitle - List item subtitle
 * @param {React.ReactNode} props.actions - Action buttons/components
 * @param {'default'|'compact'} props.density - Visual density
 * @param {string|Object} props.badge - Optional badge label or config { label, variant, size, accessibilityLabel }
 * @param {Function} props.onView - View action handler
 * @param {Function} props.onEdit - Edit action handler
 * @param {Function} props.onDelete - Delete action handler
 * @param {boolean} props.canView - Whether view action is allowed
 * @param {boolean} props.canEdit - Whether edit action is allowed
 * @param {boolean} props.canDelete - Whether delete action is allowed
 * @param {string} props.viewLabel - View action label
 * @param {string} props.editLabel - Edit action label
 * @param {string} props.deleteLabel - Delete action label
 * @param {string} props.viewHint - View action hint
 * @param {string} props.editHint - Edit action hint
 * @param {string} props.deleteHint - Delete action hint
 * @param {string} props.viewTestID - View action test identifier
 * @param {string} props.editTestID - Edit action test identifier
 * @param {string} props.deleteTestID - Delete action test identifier
 * @param {Function} props.onPress - Press handler
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 */
const ListItemWeb = ({
  children,
  avatar,
  title,
  subtitle,
  actions,
  density = 'default',
  badge,
  onView,
  onEdit,
  onDelete,
  canView = true,
  canEdit = true,
  canDelete = true,
  viewLabel,
  editLabel,
  deleteLabel,
  viewHint,
  editHint,
  deleteHint,
  viewTestID,
  editTestID,
  deleteTestID,
  onPress,
  accessibilityLabel,
  testID,
  className,
  style,
  ...rest
}) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const { t } = useI18n();
  const tabletBreakpoint = Number(theme?.breakpoints?.tablet ?? 768);
  const showActionLabels = Number(width || 0) >= tabletBreakpoint;
  const translateWithFallback = (key, fallback) => {
    const resolved = t(key);
    return resolved === key ? fallback : resolved;
  };
  const handleActionPress = (handler, event) => {
    if (event?.stopPropagation) event.stopPropagation();
    if (event?.preventDefault) event.preventDefault();
    if (handler) handler(event);
  };
  const resolvedTitle = humanizeDisplayText(title) || (title ? t('common.notAvailable') : '');
  const resolvedSubtitle = humanizeDisplayText(subtitle);
  const resolvedAccessibilityLabel = humanizeDisplayText(accessibilityLabel) || resolvedTitle;
  const resolvedViewLabel = viewLabel || translateWithFallback('common.view', 'View');
  const resolvedEditLabel = editLabel || translateWithFallback('common.edit', 'Edit');
  const resolvedDeleteLabel = deleteLabel || translateWithFallback('common.remove', 'Remove');
  const resolvedViewHint = viewHint || translateWithFallback('common.viewHint', 'Open item details');
  const resolvedEditHint = editHint || translateWithFallback('common.editHint', 'Edit this item');
  const resolvedDeleteHint = deleteHint || translateWithFallback('common.deleteHint', 'Remove this item');
  const badgeLabel = humanizeDisplayText(
    typeof badge === 'string' ? badge : badge?.label
  );
  const badgeVariant = typeof badge === 'object' ? badge.variant : 'primary';
  const badgeSize = typeof badge === 'object' ? badge.size || 'small' : 'small';
  const badgeAccessibilityLabel = typeof badge === 'object'
    ? (badge.accessibilityLabel || badgeLabel)
    : badgeLabel;
  const showViewAction = Boolean(onView) && canView;
  const showEditAction = Boolean(onEdit) && canEdit;
  const showDeleteAction = Boolean(onDelete) && canDelete;
  const buildAction = (actionType, handler, label, hint, generatedTestID) => (
    <StyledActionSlot key={actionType}>
      <StyledActionButton
        $actionType={actionType}
        $showLabel={showActionLabels}
        onPress={(event) => handleActionPress(handler, event)}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={hint}
        testID={generatedTestID}
      >
        <Icon
          glyph={ACTION_ICON_GLYPHS[actionType]}
          tone={ACTION_ICON_TONES[actionType]}
          size="xs"
          decorative
        />
        {showActionLabels ? (
          <StyledActionButtonLabel variant="caption" $actionType={actionType}>
            {label}
          </StyledActionButtonLabel>
        ) : null}
      </StyledActionButton>
    </StyledActionSlot>
  );
  const generatedActions = (showViewAction || showEditAction || showDeleteAction) ? (
    <StyledListItemActions>
      {showViewAction && buildAction(
        'view',
        onView,
        resolvedViewLabel,
        resolvedViewHint,
        viewTestID || (testID ? `${testID}-view` : undefined)
      )}
      {showEditAction && buildAction(
        'edit',
        onEdit,
        resolvedEditLabel,
        resolvedEditHint,
        editTestID || (testID ? `${testID}-edit` : undefined)
      )}
      {showDeleteAction && buildAction(
        'delete',
        onDelete,
        resolvedDeleteLabel,
        resolvedDeleteHint,
        deleteTestID || (testID ? `${testID}-delete` : undefined)
      )}
    </StyledListItemActions>
  ) : null;
  const resolvedActions = actions || generatedActions;

  const content = children || (
    <>
      {avatar && (
        <Avatar
          source={typeof avatar === 'string' ? avatar : avatar.source}
          name={typeof avatar === 'object' ? avatar.name : undefined}
          size="medium"
        />
      )}
      <StyledListItemContent $hasAvatar={Boolean(avatar)} $density={density}>
        {(resolvedTitle || badgeLabel) && (
          <StyledTitleRow>
            {resolvedTitle ? <StyledTitle variant="body">{resolvedTitle}</StyledTitle> : null}
            {badgeLabel ? (
              <StyledBadgeSlot>
                <Badge
                  variant={badgeVariant}
                  size={badgeSize}
                  accessibilityLabel={badgeAccessibilityLabel}
                >
                  {badgeLabel}
                </Badge>
              </StyledBadgeSlot>
            ) : null}
          </StyledTitleRow>
        )}
        {resolvedSubtitle && <StyledSubtitle variant="caption">{resolvedSubtitle}</StyledSubtitle>}
      </StyledListItemContent>
      {resolvedActions}
    </>
  );

  return (
    <StyledListItem
      onPress={onPress}
      disabled={!onPress}
      $density={density}
      accessibilityRole={onPress ? 'button' : 'listitem'}
      accessibilityLabel={resolvedAccessibilityLabel}
      testID={testID}
      className={className}
      style={style}
      {...rest}
    >
      {content}
    </StyledListItem>
  );
};

export default ListItemWeb;

