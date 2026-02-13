import React from 'react';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  ErrorStateSizes,
  Icon,
  ListItem,
  LoadingSpinner,
  OfflineState,
  OfflineStateSizes,
  Snackbar,
} from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledAddButton,
  StyledAddLabel,
  StyledContainer,
  StyledContent,
  StyledList,
  StyledListBody,
  StyledStateStack,
  StyledToolbar,
  StyledToolbarActions,
} from './PatientResourceListScreen.web.styles';
import usePatientResourceListScreen from './usePatientResourceListScreen';

const PatientResourceListScreenWeb = ({ resourceId }) => {
  const { t } = useI18n();
  const {
    config,
    items,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    noticeMessage,
    onDismissNotice,
    onRetry,
    onItemPress,
    onDelete,
    onAdd,
    canCreate,
    canDelete,
    createBlockedReason,
    deleteBlockedReason,
  } = usePatientResourceListScreen(resourceId);

  if (!config) return null;

  const titleKey = `${config.i18nKey}.list.title`;
  const addLabelKey = `${config.i18nKey}.list.addLabel`;

  const showError = !isLoading && hasError && !isOffline;
  const showOffline = !isLoading && isOffline;
  const showEmpty = !isLoading && !showError && !showOffline && items.length === 0;

  return (
    <StyledContainer role="main" aria-label={t(titleKey)}>
      {noticeMessage ? (
        <Snackbar
          visible={Boolean(noticeMessage)}
          message={noticeMessage}
          variant="success"
          position="bottom"
          onDismiss={onDismissNotice}
          testID="patient-resource-list-notice"
        />
      ) : null}
      <StyledContent>
        <StyledToolbar data-testid="patient-resource-list-toolbar">
          <StyledToolbarActions>
            <StyledAddButton
              type="button"
              onClick={onAdd}
              disabled={!canCreate}
              aria-disabled={!canCreate}
              title={!canCreate ? createBlockedReason : undefined}
              accessibilityLabel={t(addLabelKey)}
              accessibilityHint={t(`${config.i18nKey}.list.addHint`)}
              testID="patient-resource-list-add"
            >
              <Icon glyph="+" size="xs" decorative />
              <StyledAddLabel>{t(addLabelKey)}</StyledAddLabel>
            </StyledAddButton>
          </StyledToolbarActions>
        </StyledToolbar>

        <Card
          variant="outlined"
          accessibilityLabel={t(`${config.i18nKey}.list.accessibilityLabel`)}
          testID="patient-resource-list-card"
        >
          <StyledListBody role="region" aria-label={t(`${config.i18nKey}.list.accessibilityLabel`)}>
            <StyledStateStack>
              {showError ? (
                <ErrorState
                  size={ErrorStateSizes.SMALL}
                  title={t('listScaffold.errorState.title')}
                  description={errorMessage}
                  action={
                    <Button
                      variant="surface"
                      size="small"
                      onPress={onRetry}
                      accessibilityLabel={t('common.retry')}
                      accessibilityHint={t('common.retryHint')}
                      icon={<Icon glyph="?" size="xs" decorative />}
                    >
                      {t('common.retry')}
                    </Button>
                  }
                  testID="patient-resource-list-error"
                />
              ) : null}

              {showOffline ? (
                <OfflineState
                  size={OfflineStateSizes.SMALL}
                  title={t('shell.banners.offline.title')}
                  description={t('shell.banners.offline.message')}
                  action={
                    <Button
                      variant="surface"
                      size="small"
                      onPress={onRetry}
                      accessibilityLabel={t('common.retry')}
                      accessibilityHint={t('common.retryHint')}
                      icon={<Icon glyph="?" size="xs" decorative />}
                    >
                      {t('common.retry')}
                    </Button>
                  }
                  testID="patient-resource-list-offline"
                />
              ) : null}
            </StyledStateStack>

            {isLoading ? (
              <LoadingSpinner accessibilityLabel={t('common.loading')} testID="patient-resource-list-loading" />
            ) : null}

            {showEmpty ? (
              <EmptyState
                title={t(`${config.i18nKey}.list.emptyTitle`)}
                description={t(`${config.i18nKey}.list.emptyMessage`)}
                testID="patient-resource-list-empty"
              />
            ) : null}

            {items.length > 0 ? (
              <StyledList role="list">
                {items.map((item) => {
                  const itemTitle = config.getItemTitle(item, t);
                  const itemSubtitle = config.getItemSubtitle(item, t);
                  const canDeleteItem = canDelete;

                  return (
                    <li key={item.id} role="listitem">
                      <ListItem
                        title={itemTitle}
                        subtitle={itemSubtitle}
                        onPress={() => onItemPress(item.id)}
                        actions={
                          <Button
                            variant="surface"
                            size="small"
                            onPress={(event) => onDelete(item.id, event)}
                            disabled={!canDeleteItem}
                            aria-disabled={!canDeleteItem}
                            title={!canDeleteItem ? deleteBlockedReason : undefined}
                            accessibilityLabel={t(`${config.i18nKey}.list.delete`) }
                            accessibilityHint={t(`${config.i18nKey}.list.deleteHint`) }
                            icon={<Icon glyph="?" size="xs" decorative />}
                            testID={`patient-resource-delete-${item.id}`}
                          >
                            {t('common.remove')}
                          </Button>
                        }
                        accessibilityLabel={t(`${config.i18nKey}.list.itemLabel`, { name: itemTitle })}
                        accessibilityHint={t(`${config.i18nKey}.list.itemHint`, { name: itemTitle })}
                        testID={`patient-resource-item-${item.id}`}
                      />
                    </li>
                  );
                })}
              </StyledList>
            ) : null}
          </StyledListBody>
        </Card>
      </StyledContent>
    </StyledContainer>
  );
};

export default PatientResourceListScreenWeb;
