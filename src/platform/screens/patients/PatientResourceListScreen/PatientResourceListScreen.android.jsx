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
  StyledSeparator,
  StyledStateStack,
  StyledToolbar,
  StyledToolbarActions,
} from './PatientResourceListScreen.android.styles';
import usePatientResourceListScreen from './usePatientResourceListScreen';

const PatientResourceListScreenAndroid = ({ resourceId }) => {
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
  } = usePatientResourceListScreen(resourceId);

  if (!config) return null;

  return (
    <StyledContainer>
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
        <StyledToolbar>
          <StyledToolbarActions>
            <StyledAddButton
              onPress={onAdd}
              disabled={!canCreate}
              accessibilityLabel={t(`${config.i18nKey}.list.addLabel`)}
              accessibilityHint={t(`${config.i18nKey}.list.addHint`)}
              testID="patient-resource-list-add"
            >
              <Icon glyph="+" size="xs" decorative />
              <StyledAddLabel>{t(`${config.i18nKey}.list.addLabel`)}</StyledAddLabel>
            </StyledAddButton>
          </StyledToolbarActions>
        </StyledToolbar>

        <Card
          variant="outlined"
          accessibilityLabel={t(`${config.i18nKey}.list.accessibilityLabel`)}
          testID="patient-resource-list-card"
        >
          <StyledListBody>
            <StyledStateStack>
              {!isLoading && hasError && !isOffline ? (
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

              {!isLoading && isOffline ? (
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

            {!isLoading && !hasError && !isOffline && items.length === 0 ? (
              <EmptyState
                title={t(`${config.i18nKey}.list.emptyTitle`)}
                description={t(`${config.i18nKey}.list.emptyMessage`)}
                testID="patient-resource-list-empty"
              />
            ) : null}

            {items.length > 0 ? (
              <StyledList>
                {items.map((item, index) => {
                  const itemTitle = config.getItemTitle(item, t);
                  const itemSubtitle = config.getItemSubtitle(item, t);
                  return (
                    <React.Fragment key={item.id}>
                      <ListItem
                        title={itemTitle}
                        subtitle={itemSubtitle}
                        onPress={() => onItemPress(item.id)}
                        actions={
                          <Button
                            variant="surface"
                            size="small"
                            onPress={(event) => onDelete(item.id, event)}
                            disabled={!canDelete}
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
                      {index < items.length - 1 ? <StyledSeparator /> : null}
                    </React.Fragment>
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

export default PatientResourceListScreenAndroid;
