/**
 * ListItem Shared Component Factory
 * Shared logic for platform-specific list item renderers.
 * File: ListItem.shared.jsx
 */
import React from 'react';
import { useWindowDimensions } from 'react-native';

import { useI18n } from '@hooks';
import { humanizeDisplayText } from '@utils';

import Avatar from '@platform/components/display/Avatar';
import Badge from '@platform/components/display/Badge';
import Icon from '@platform/components/display/Icon';

const ACTION_ICON_GLYPHS = {
  view: '\u25C9',
  edit: '\u270E',
  delete: '\u2715',
  more: '\u22EE',
};

const ACTION_ICON_TONES = {
  view: 'primary',
  edit: 'muted',
  delete: 'muted',
  more: 'muted',
};

const VARIANT_TO_TONE = {
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'primary',
  primary: 'primary',
};

const DEFAULT_LEADING_GLYPH = '\u{1F4C1}';

const normalizeTone = (tone) => {
  if (!tone) return undefined;
  const normalized = String(tone).toLowerCase();
  if (normalized === 'danger') return 'error';
  return normalized;
};

const mapVariantToTone = (variant) => {
  const normalized = normalizeTone(variant);
  if (!normalized) return undefined;
  return VARIANT_TO_TONE[normalized] || normalized;
};

const resolveMetadataText = (item) => {
  if (typeof item === 'string') return humanizeDisplayText(item);

  const text = humanizeDisplayText(item?.text);
  if (text) return text;

  const label = humanizeDisplayText(item?.label);
  const value = humanizeDisplayText(item?.value);
  if (label && value) return `${label}: ${value}`;
  return label || value || '';
};

const normalizeMetadata = (metadata) => {
  if (!Array.isArray(metadata)) return [];

  return metadata
    .map((item, index) => {
      if (!item) return null;

      if (typeof item === 'string') {
        const text = humanizeDisplayText(item);
        if (!text) return null;
        return {
          key: `meta-${index}-${text}`,
          text,
          iconGlyph: null,
          iconTone: undefined,
          tone: undefined,
          testID: undefined,
        };
      }

      const text = resolveMetadataText(item);
      if (!text) return null;

      return {
        key: item.key || `meta-${index}-${text}`,
        text,
        iconGlyph: humanizeDisplayText(item.iconGlyph || item.icon),
        iconTone: normalizeTone(item.iconTone),
        tone: mapVariantToTone(item.tone || item.variant),
        testID: item.testID,
      };
    })
    .filter(Boolean);
};

const normalizeStatus = (status) => {
  if (!status) return null;
  if (typeof status === 'string') {
    const label = humanizeDisplayText(status);
    if (!label) return null;
    return {
      label,
      tone: 'success',
      showDot: true,
      testID: undefined,
      accessibilityLabel: undefined,
    };
  }

  const label = humanizeDisplayText(status.label || status.text);
  if (!label) return null;

  return {
    label,
    tone: mapVariantToTone(status.tone || status.variant) || 'success',
    showDot: status.showDot !== false,
    testID: status.testID,
    accessibilityLabel: status.accessibilityLabel,
  };
};

const normalizeLeading = (leading) => {
  if (!leading) return null;
  if (React.isValidElement(leading)) return { element: leading };
  if (leading === true) return {};
  if (typeof leading === 'string') return { glyph: leading };
  if (typeof leading === 'object') return leading;
  return null;
};

const buildGeneratedActions = ({
  onView,
  onEdit,
  onDelete,
  onMore,
  canView,
  canEdit,
  canDelete,
  canMore,
  resolvedViewLabel,
  resolvedEditLabel,
  resolvedDeleteLabel,
  resolvedMoreLabel,
  resolvedViewHint,
  resolvedEditHint,
  resolvedDeleteHint,
  resolvedMoreHint,
  viewTestID,
  editTestID,
  deleteTestID,
  moreTestID,
  testID,
}) => ([
  (Boolean(onView) && canView) ? {
    key: 'view',
    type: 'view',
    label: resolvedViewLabel,
    hint: resolvedViewHint,
    onPress: onView,
    testID: viewTestID || (testID ? `${testID}-view` : undefined),
    hideOnWide: true,
  } : null,
  (Boolean(onEdit) && canEdit) ? {
    key: 'edit',
    type: 'edit',
    label: resolvedEditLabel,
    hint: resolvedEditHint,
    onPress: onEdit,
    testID: editTestID || (testID ? `${testID}-edit` : undefined),
  } : null,
  (Boolean(onDelete) && canDelete) ? {
    key: 'delete',
    type: 'delete',
    label: resolvedDeleteLabel,
    hint: resolvedDeleteHint,
    onPress: onDelete,
    testID: deleteTestID || (testID ? `${testID}-delete` : undefined),
  } : null,
  (Boolean(onMore) && canMore) ? {
    key: 'more',
    type: 'more',
    label: resolvedMoreLabel,
    hint: resolvedMoreHint,
    onPress: onMore,
    testID: moreTestID || (testID ? `${testID}-more` : undefined),
    separatorBefore: true,
  } : null,
].filter(Boolean));

const createListItemComponent = ({
  styles,
  isWeb = false,
}) => {
  const {
    StyledListItem,
    StyledLeadingSlot,
    StyledLeadingSurface,
    StyledListItemContent,
    StyledTopRow,
    StyledHeaderContent,
    StyledTitleRow,
    StyledBadgeSlot,
    StyledListItemActions,
    StyledActionSlot,
    StyledActionButton,
    StyledActionButtonLabel,
    StyledTitle,
    StyledSubtitle,
    StyledMetaRow,
    StyledMetaItem,
    StyledMetaIconSlot,
    StyledMetaText,
    StyledStatusSlot,
    StyledStatusDot,
    StyledStatusLabel,
  } = styles;

  const ListItemShared = ({
    theme,
    children,
    avatar,
    leading,
    title,
    subtitle,
    metadata,
    status,
    actions,
    actionItems,
    actionLabelMode = 'auto',
    layoutMode = 'auto',
    showMetaDivider = true,
    density = 'default',
    badge,
    onView,
    onEdit,
    onDelete,
    onMore,
    canView = true,
    canEdit = true,
    canDelete = true,
    canMore = true,
    viewLabel,
    editLabel,
    deleteLabel,
    moreLabel,
    viewHint,
    editHint,
    deleteHint,
    moreHint,
    viewTestID,
    editTestID,
    deleteTestID,
    moreTestID,
    onPress,
    accessibilityLabel,
    testID,
    className,
    style,
    ...rest
  }) => {
    const { width } = useWindowDimensions();
    const { t } = useI18n();

    const tabletBreakpoint = Number(theme?.breakpoints?.tablet ?? 768);
    const measuredWidth = Number(width || 0);
    const runtimeWindowWidth = (typeof window !== 'undefined' && Number(window.innerWidth) > 0)
      ? Number(window.innerWidth)
      : 0;
    const effectiveWidth = measuredWidth > 0 ? measuredWidth : runtimeWindowWidth;
    const isWideFromWidth = effectiveWidth >= tabletBreakpoint;
    const isWide = layoutMode === 'wide'
      ? true
      : layoutMode === 'mobile'
        ? false
        : isWideFromWidth;
    const automaticLabelMode = false;
    const showActionLabels = actionLabelMode === 'always'
      ? true
      : actionLabelMode === 'never'
        ? false
        : automaticLabelMode;

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
    const resolvedMoreLabel = moreLabel || translateWithFallback('common.more', 'More');
    const resolvedViewHint = viewHint || translateWithFallback('common.viewHint', 'Open item details');
    const resolvedEditHint = editHint || translateWithFallback('common.editHint', 'Edit this item');
    const resolvedDeleteHint = deleteHint || translateWithFallback('common.deleteHint', 'Remove this item');
    const resolvedMoreHint = moreHint || translateWithFallback('common.moreHint', 'Open more actions');

    const badgeLabel = humanizeDisplayText(
      typeof badge === 'string' ? badge : badge?.label
    );
    const badgeVariant = typeof badge === 'object' ? badge.variant : 'primary';
    const badgeSize = typeof badge === 'object' ? badge.size || 'small' : 'small';
    const badgeAccessibilityLabel = typeof badge === 'object'
      ? (badge.accessibilityLabel || badgeLabel)
      : badgeLabel;

    const resolvedLeading = normalizeLeading(leading);
    const resolvedMetadata = normalizeMetadata(metadata);
    const resolvedStatus = normalizeStatus(status);

    const configuredActions = Array.isArray(actionItems)
      ? actionItems.filter(Boolean)
      : buildGeneratedActions({
        onView,
        onEdit,
        onDelete,
        onMore,
        canView,
        canEdit,
        canDelete,
        canMore,
        resolvedViewLabel,
        resolvedEditLabel,
        resolvedDeleteLabel,
        resolvedMoreLabel,
        resolvedViewHint,
        resolvedEditHint,
        resolvedDeleteHint,
        resolvedMoreHint,
        viewTestID,
        editTestID,
        deleteTestID,
        moreTestID,
        testID,
      });

    const builtActions = configuredActions
      .map((action, index) => {
        if (!action || action.visible === false) return null;
        if (isWide && action.hideOnWide) return null;
        const actionType = action.type || action.key || `action-${index}`;
        const tone = mapVariantToTone(action.tone || action.variant)
          || ACTION_ICON_TONES[actionType]
          || 'primary';
        const label = humanizeDisplayText(action.label)
          || translateWithFallback('common.action', 'Action');
        const hint = humanizeDisplayText(action.hint || action.accessibilityHint);
        const glyph = humanizeDisplayText(action.iconGlyph || action.glyph)
          || ACTION_ICON_GLYPHS[actionType]
          || ACTION_ICON_GLYPHS.more;
        const showLabelForAction = action.showLabel === true
          || (action.showLabel !== false && showActionLabels);
        const disabled = Boolean(action.disabled);
        const actionTestID = action.testID || (testID ? `${testID}-${actionType}` : undefined);

        if (!action.onPress && !disabled && !action.passive) return null;

        return (
          <StyledActionSlot
            key={action.key || `${actionType}-${index}`}
            $separatorBefore={Boolean(action.separatorBefore)}
            $isWide={isWide}
          >
            <StyledActionButton
              $actionType={actionType}
              $showLabel={showLabelForAction}
              $tone={tone}
              $isWide={isWide}
              onPress={(event) => {
                if (disabled) return;
                handleActionPress(action.onPress, event);
              }}
              disabled={disabled}
              accessibilityRole="button"
              accessibilityLabel={label}
              accessibilityHint={hint}
              testID={actionTestID}
            >
              <Icon
                glyph={glyph}
                tone={tone}
                size={isWide ? 'sm' : 'xs'}
                decorative
              />
              {showLabelForAction ? (
                <StyledActionButtonLabel variant="caption" $actionType={actionType} $tone={tone}>
                  {label}
                </StyledActionButtonLabel>
              ) : null}
            </StyledActionButton>
          </StyledActionSlot>
        );
      })
      .filter(Boolean);

    const hasCustomActions = Boolean(actions);
    const hasResolvedActions = hasCustomActions || builtActions.length > 0;
    const renderActions = (placement) => {
      if (!hasResolvedActions) return null;
      return (
        <StyledListItemActions $isWide={isWide} $placement={placement}>
          {hasCustomActions ? actions : builtActions}
        </StyledListItemActions>
      );
    };

    const renderLeading = () => {
      if (avatar) {
        return (
          <Avatar
            source={typeof avatar === 'string' ? avatar : avatar.source}
            name={typeof avatar === 'object' ? avatar.name : undefined}
            size="medium"
          />
        );
      }

      if (!resolvedLeading) return null;
      if (resolvedLeading.element) return resolvedLeading.element;
      if (React.isValidElement(resolvedLeading.content)) return resolvedLeading.content;

      const leadingTone = mapVariantToTone(
        resolvedLeading.tone || resolvedLeading.iconTone || 'primary'
      ) || 'primary';
      const glyph = humanizeDisplayText(resolvedLeading.glyph) || DEFAULT_LEADING_GLYPH;
      const iconSize = resolvedLeading.size || 'md';

      return (
        <StyledLeadingSurface
          $tone={leadingTone}
          $backgroundTone={resolvedLeading.backgroundTone || leadingTone}
          $backgroundColor={resolvedLeading.backgroundColor}
          $density={density}
          $isWide={isWide}
          testID={resolvedLeading.testID || (testID ? `${testID}-leading` : undefined)}
        >
          <Icon
            glyph={glyph}
            tone={leadingTone}
            size={iconSize}
            decorative={!resolvedLeading.accessibilityLabel}
            accessibilityLabel={resolvedLeading.accessibilityLabel}
          />
        </StyledLeadingSurface>
      );
    };

    const leadingNode = renderLeading();
    const showMetaRow = resolvedMetadata.length > 0 || Boolean(resolvedStatus) || (isWide && Boolean(resolvedSubtitle));

    const content = children || (
      <>
        {leadingNode ? <StyledLeadingSlot $isWide={isWide}>{leadingNode}</StyledLeadingSlot> : null}
        <StyledListItemContent $hasAvatar={Boolean(avatar)} $density={density} $isWide={isWide}>
          <StyledTopRow $isWide={isWide}>
            <StyledHeaderContent $isWide={isWide}>
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
              {resolvedSubtitle && !isWide ? (
                <StyledSubtitle variant="caption">{resolvedSubtitle}</StyledSubtitle>
              ) : null}
            </StyledHeaderContent>
            {isWide ? renderActions('top') : null}
          </StyledTopRow>
          {!isWide ? renderActions('mobile') : null}

          {showMetaRow ? (
            <StyledMetaRow $withDivider={showMetaDivider && !isWide} $isWide={isWide}>
              {isWide && resolvedSubtitle ? (
                <StyledMetaItem key="subtitle-inline" $isWide={isWide} $isSubtitle>
                  <StyledSubtitle variant="caption" $isInline>{resolvedSubtitle}</StyledSubtitle>
                </StyledMetaItem>
              ) : null}
              {resolvedMetadata.map((metaItem, index) => (
                <StyledMetaItem
                  key={metaItem.key}
                  $isWide={isWide}
                  $isFirst={!isWide && index === 0}
                  testID={metaItem.testID}
                >
                  {metaItem.iconGlyph ? (
                    <StyledMetaIconSlot>
                      <Icon
                        glyph={metaItem.iconGlyph}
                        tone={metaItem.iconTone || metaItem.tone || 'muted'}
                        size="xs"
                        decorative
                      />
                    </StyledMetaIconSlot>
                  ) : null}
                  <StyledMetaText variant="caption" $tone={metaItem.tone}>
                    {metaItem.text}
                  </StyledMetaText>
                </StyledMetaItem>
              ))}
              {resolvedStatus ? (
                <StyledStatusSlot
                  $isWide={isWide}
                  testID={resolvedStatus.testID || (testID ? `${testID}-status` : undefined)}
                  accessibilityLabel={resolvedStatus.accessibilityLabel}
                >
                  {resolvedStatus.showDot ? (
                    <StyledStatusDot $tone={resolvedStatus.tone} />
                  ) : null}
                  <StyledStatusLabel variant="caption" $tone={resolvedStatus.tone}>
                    {resolvedStatus.label}
                  </StyledStatusLabel>
                </StyledStatusSlot>
              ) : null}
            </StyledMetaRow>
          ) : null}
        </StyledListItemContent>
      </>
    );

    return (
      <StyledListItem
        onPress={onPress}
        disabled={!onPress}
        $density={density}
        $isWide={isWide}
        accessibilityRole={onPress ? 'button' : 'listitem'}
        accessibilityLabel={resolvedAccessibilityLabel}
        testID={testID}
        style={style}
        {...(isWeb ? { className } : {})}
        {...rest}
      >
        {content}
      </StyledListItem>
    );
  };

  return ListItemShared;
};

export default createListItemComponent;
