import React, { useState } from 'react';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  ErrorStateSizes,
  Icon,
  ListItem,
  LoadingSpinner,
  Modal,
  OfflineState,
  OfflineStateSizes,
  Snackbar,
  Text,
} from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledAddButton,
  StyledAddLabel,
  StyledContainer,
  StyledContent,
  StyledHeader,
  StyledHeaderCopy,
  StyledHeaderTop,
  StyledHelpButton,
  StyledHelpButtonLabel,
  StyledHelpModalBody,
  StyledHelpModalItem,
  StyledHelpModalTitle,
  StyledList,
  StyledListBody,
  StyledSeparator,
  StyledStateStack,
  StyledToolbar,
  StyledToolbarActions,
} from './PatientResourceListScreen.ios.styles';
import usePatientResourceListScreen from './usePatientResourceListScreen';

const PatientResourceListScreenIOS = ({ resourceId }) => {
  const { t } = useI18n();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const {
    config,
    resourceLabel,
    items,
    isLoading,
    hasError,
    errorMessage,
    isOffline,
    noticeMessage,
    helpContent,
    onDismissNotice,
    onRetry,
    onItemPress,
    onEdit,
    onDelete,
    onAdd,
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
        <StyledHeader>
          <StyledHeaderTop>
            <StyledHeaderCopy>
              <Text variant="h2" accessibilityRole="header">{t(`${config.i18nKey}.list.title`)}</Text>
              <Text variant="body">{t('patients.common.list.description', { resource: resourceLabel })}</Text>
            </StyledHeaderCopy>
            <StyledHelpButton
              accessibilityRole="button"
              accessibilityLabel={helpContent?.label}
              accessibilityHint={helpContent?.tooltip}
              testID="patient-resource-list-help-trigger"
              onPress={() => setIsHelpOpen(true)}
            >
              <StyledHelpButtonLabel>?</StyledHelpButtonLabel>
            </StyledHelpButton>
          </StyledHeaderTop>
        </StyledHeader>

        <Modal
          visible={isHelpOpen}
          onDismiss={() => setIsHelpOpen(false)}
          size="small"
          accessibilityLabel={helpContent?.title}
          testID="patient-resource-list-help-modal"
        >
          <StyledHelpModalTitle>{helpContent?.title}</StyledHelpModalTitle>
          <StyledHelpModalBody>{helpContent?.body}</StyledHelpModalBody>
          {(helpContent?.items || []).map((item) => (
            <StyledHelpModalItem key={item}>{`- ${item}`}</StyledHelpModalItem>
          ))}
        </Modal>

        <StyledToolbar>
          <StyledToolbarActions>
            {onAdd ? (
              <StyledAddButton
                onPress={onAdd}
                accessibilityLabel={t(`${config.i18nKey}.list.addLabel`)}
                accessibilityHint={t(`${config.i18nKey}.list.addHint`)}
                testID="patient-resource-list-add"
              >
                <Icon glyph="+" size="xs" decorative />
                <StyledAddLabel>{t(`${config.i18nKey}.list.addLabel`)}</StyledAddLabel>
              </StyledAddButton>
            ) : null}
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
                  const itemTitle = config.getItemTitle(item, t)
                    || t('patients.common.list.unnamedRecord', { position: index + 1 });
                  const itemSubtitle = config.getItemSubtitle(item, t);
                  const itemId = item?.id;
                  const itemKey = itemId ?? `patient-resource-${index}`;
                  const leadingGlyph = String(itemTitle || 'P').charAt(0).toUpperCase();
                  return (
                    <React.Fragment key={itemKey}>
                      <ListItem
                        leading={{ glyph: leadingGlyph, tone: 'inverse', backgroundTone: 'primary' }}
                        title={itemTitle}
                        subtitle={itemSubtitle || '-'}
                        density="compact"
                        onPress={itemId ? () => onItemPress(itemId) : undefined}
                        onView={itemId ? () => onItemPress(itemId) : undefined}
                        onEdit={onEdit && itemId ? (event) => onEdit(itemId, event) : undefined}
                        onDelete={onDelete && itemId ? (event) => onDelete(itemId, event) : undefined}
                        viewLabel={t('patients.common.list.view')}
                        viewHint={t('patients.common.list.viewHint')}
                        editLabel={t('patients.common.list.edit')}
                        editHint={t('patients.common.list.editHint')}
                        deleteLabel={t('common.remove')}
                        deleteHint={t(`${config.i18nKey}.list.deleteHint`)}
                        viewTestID={`patient-resource-view-${itemKey}`}
                        editTestID={`patient-resource-edit-${itemKey}`}
                        deleteTestID={`patient-resource-delete-${itemKey}`}
                        accessibilityLabel={t(`${config.i18nKey}.list.itemLabel`, { name: itemTitle })}
                        accessibilityHint={t(`${config.i18nKey}.list.itemHint`, { name: itemTitle })}
                        testID={`patient-resource-item-${itemKey}`}
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

export default PatientResourceListScreenIOS;
