import React from 'react';
import {
  Button,
  ErrorState,
  ErrorStateSizes,
  Icon,
  LoadingSpinner,
  OfflineState,
  OfflineStateSizes,
  Stack,
} from '@platform/components';
import { useI18n } from '@hooks';
import BillingActionDrawer from './components/BillingActionDrawer';
import BillingQueue from './components/BillingQueue';
import BillingSummaryCards from './components/BillingSummaryCards';
import BillingTimeline from './components/BillingTimeline';
import PatientLedgerPanel from './components/PatientLedgerPanel';
import useBillingWorkbenchScreen from './useBillingWorkbenchScreen';
import {
  StyledContainer,
  StyledDescription,
  StyledHeader,
  StyledHeading,
  StyledInlineActions,
  StyledPanel,
  StyledStickyActions,
  StyledTitle,
  StyledWorkspaceGrid,
} from './BillingWorkbenchScreen.styles';

const BillingWorkbenchScreen = () => {
  const { t } = useI18n();
  const screen = useBillingWorkbenchScreen();

  return (
    <StyledContainer testID="billing-workbench-screen">
      <StyledHeader>
        <StyledHeading>
          <StyledTitle>Billing workspace</StyledTitle>
          <StyledDescription>
            Centralized paperless billing operations for invoices, payments, claims, approvals,
            refunds, adjustments, and patient ledger visibility.
          </StyledDescription>
        </StyledHeading>
        <StyledInlineActions>
          <Button
            variant="surface"
            size="small"
            onPress={screen.onRetry}
            icon={<Icon glyph={'\u21bb'} size="xs" decorative />}
            testID="billing-workbench-refresh"
          >
            {t('common.retry')}
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={() => screen.onOpenLegacyRoute('/billing/invoices/create')}
            testID="billing-workbench-open-invoice-create"
          >
            New invoice draft
          </Button>
        </StyledInlineActions>
      </StyledHeader>

      <BillingSummaryCards summary={screen.summary} />

      {screen.isLoading ? (
        <LoadingSpinner accessibilityLabel={t('common.loading')} testID="billing-workbench-loading" />
      ) : null}

      {!screen.isLoading && !screen.canViewWorkbench ? (
        <ErrorState
          size={ErrorStateSizes.SMALL}
          title="Access denied"
          description="Billing workspace access is not available for this account."
          testID="billing-workbench-access-denied"
        />
      ) : null}

      {!screen.isLoading && screen.hasError ? (
        <ErrorState
          size={ErrorStateSizes.SMALL}
          title="Could not load billing workspace"
          description={screen.errorCode || 'Please retry.'}
          testID="billing-workbench-error"
        />
      ) : null}

      {!screen.isLoading ? (
        <OfflineState
          size={OfflineStateSizes.SMALL}
          title={t('shell.banners.offline.title')}
          description="You are offline. Billing actions are temporarily read-only."
          style={{ display: screen.isOffline ? 'block' : 'none' }}
          testID="billing-workbench-offline"
        />
      ) : null}

      {!screen.isLoading && screen.canViewWorkbench ? (
        <>
          <StyledWorkspaceGrid>
            <StyledPanel>
              <BillingQueue
                queues={screen.queues}
                activeQueue={screen.activeQueue}
                queueItems={screen.queueItems}
                onSelectQueue={screen.onSelectQueue}
                onSelectItem={screen.onSelectQueueItem}
                onApproveApproval={screen.onApproveApproval}
                onRejectApproval={screen.onRejectApproval}
                selectedItemIdentifier={screen.selectedQueueItemIdentifier}
                isQueueLoading={screen.isQueueLoading}
              />
            </StyledPanel>

            <StyledPanel>
              <BillingTimeline
                groups={screen.timelineGroups}
                onOpenPatientLedger={screen.onOpenPatientLedger}
                onDownloadInvoice={screen.onDownloadInvoice}
                onRefresh={screen.onRetry}
                isRefreshing={screen.isWorkspaceLoading}
              />
            </StyledPanel>

            <StyledPanel>
              <BillingActionDrawer
                actionType={screen.actionType}
                onActionTypeChange={screen.onActionTypeChange}
                draft={screen.actionDraft}
                onDraftChange={screen.onDraftChange}
                invoiceOptions={screen.invoiceOptions}
                paymentOptions={screen.paymentOptions}
                statusMessage={screen.statusMessage}
                statusVariant={screen.statusVariant}
                onSubmit={screen.onSubmitAction}
                isSubmitting={screen.isActionLoading}
              />
              <PatientLedgerPanel
                ledger={screen.ledger}
                selectedPatientDisplayId={screen.selectedPatientDisplayId}
                onDownloadInvoice={screen.onDownloadInvoice}
                onClose={screen.onClosePatientLedger}
                isLoading={screen.isLedgerLoading}
              />
            </StyledPanel>
          </StyledWorkspaceGrid>
          <StyledStickyActions>
            <Stack spacing="xs">
              <Button
                variant="primary"
                size="small"
                onPress={screen.onSubmitAction}
                disabled={screen.isActionLoading}
                testID="billing-workbench-sticky-submit"
              >
                Submit action
              </Button>
            </Stack>
          </StyledStickyActions>
        </>
      ) : null}
    </StyledContainer>
  );
};

export default BillingWorkbenchScreen;
