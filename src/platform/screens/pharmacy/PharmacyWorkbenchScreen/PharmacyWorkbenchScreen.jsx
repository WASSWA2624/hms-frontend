import React from 'react';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  ErrorStateSizes,
  Icon,
  LoadingSpinner,
  OfflineState,
  OfflineStateSizes,
  Select,
  Switch,
  Text,
  TextArea,
  TextField,
} from '@platform/components';
import { useI18n } from '@hooks';
import usePharmacyWorkbenchScreen from './usePharmacyWorkbenchScreen';
import {
  StyledActionGrid,
  StyledContainer,
  StyledDescription,
  StyledErrorText,
  StyledFilterGrid,
  StyledHeader,
  StyledHeading,
  StyledInfoText,
  StyledInlineActions,
  StyledItemHeader,
  StyledItemMeta,
  StyledItemTitle,
  StyledLayout,
  StyledList,
  StyledListItem,
  StyledPanel,
  StyledPillButton,
  StyledPillGroup,
  StyledPillText,
  StyledSectionTitle,
  StyledSnapshotField,
  StyledSnapshotGrid,
  StyledSnapshotLabel,
  StyledSnapshotValue,
  StyledSubsection,
  StyledSuccessText,
  StyledSummaryCard,
  StyledSummaryGrid,
  StyledSummaryLabel,
  StyledSummaryValue,
  StyledTitle,
  StyledWorklist,
  StyledWorklistItem,
} from './PharmacyWorkbenchScreen.styles';

const STATUS_ICON = {
  ORDERED: '\u{1F4CB}',
  PARTIALLY_DISPENSED: '\u{1F48A}',
  DISPENSED: '\u2705',
  CANCELLED: '\u26D4',
};

const toSelectOptions = (options = [], fallbackLabel = '') => [
  { value: '', label: fallbackLabel },
  ...(Array.isArray(options)
    ? options.map((entry) =>
        typeof entry === 'string'
          ? { value: entry, label: entry.replace(/_/g, ' ') }
          : { value: entry.value, label: entry.label || entry.value }
      )
    : []),
];

const renderSnapshotField = (label, value, fallback) => (
  <StyledSnapshotField>
    <StyledSnapshotLabel>{label}</StyledSnapshotLabel>
    <StyledSnapshotValue>{value || fallback}</StyledSnapshotValue>
  </StyledSnapshotField>
);

const PharmacyWorkbenchScreen = ({ defaultPanel = 'orders' }) => {
  const { t } = useI18n();
  const screen = usePharmacyWorkbenchScreen(defaultPanel);

  const orderStatusOptions = toSelectOptions(
    screen.orderStatusOptions,
    t('pharmacy.workbench.filters.allStatuses')
  );
  const batchOptions = toSelectOptions(screen.batchOptions, t('common.selectOption'));
  const inventoryItemOptions = toSelectOptions(
    screen.inventoryItemOptions,
    t('common.selectOption')
  );
  const inventoryReasonOptions = toSelectOptions(
    screen.inventoryReasonOptions,
    t('common.selectOption')
  );

  return (
    <StyledContainer testID="pharmacy-workbench-screen">
      <StyledHeader>
        <StyledHeading>
          <StyledTitle>{t('pharmacy.workbench.title')}</StyledTitle>
          <StyledDescription>{t('pharmacy.workbench.description')}</StyledDescription>
          <StyledPillGroup>
            <StyledPillButton
              $active={screen.activePanel === 'orders'}
              onPress={() => screen.onSetPanel('orders')}
              accessibilityRole="button"
            >
              <StyledPillText $active={screen.activePanel === 'orders'}>
                {t('pharmacy.workbench.panels.orders')}
              </StyledPillText>
            </StyledPillButton>
            <StyledPillButton
              $active={screen.activePanel === 'inventory'}
              onPress={() => screen.onSetPanel('inventory')}
              accessibilityRole="button"
            >
              <StyledPillText $active={screen.activePanel === 'inventory'}>
                {t('pharmacy.workbench.panels.inventory')}
              </StyledPillText>
            </StyledPillButton>
          </StyledPillGroup>
        </StyledHeading>

        <StyledInlineActions>
          <Button
            variant="surface"
            size="small"
            onPress={screen.onOpenOrderRoute}
            disabled={!screen.selectedOrderId}
            icon={<Icon glyph="\u{1F50E}" size="xs" decorative />}
          >
            {t('pharmacy.workbench.quickLinks.openOrder')}
          </Button>
          <Button
            variant="surface"
            size="small"
            onPress={screen.onRetry}
            icon={<Icon glyph="\u21BB" size="xs" decorative />}
          >
            {t('common.retry')}
          </Button>
        </StyledInlineActions>
      </StyledHeader>

      {screen.isLoading ? (
        <LoadingSpinner
          accessibilityLabel={t('common.loading')}
          testID="pharmacy-workbench-loading"
        />
      ) : null}

      {!screen.isLoading && !screen.canViewWorkbench ? (
        <ErrorState
          size={ErrorStateSizes.SMALL}
          title={t('pharmacy.workbench.states.accessDeniedTitle')}
          description={t('pharmacy.workbench.states.accessDeniedDescription')}
          testID="pharmacy-workbench-access-denied"
        />
      ) : null}

      {!screen.isLoading && screen.hasError ? (
        <ErrorState
          size={ErrorStateSizes.SMALL}
          title={t('pharmacy.workbench.states.loadErrorTitle')}
          description={screen.errorCode || t('pharmacy.workbench.states.loadErrorDescription')}
          testID="pharmacy-workbench-error"
        />
      ) : null}

      {!screen.isLoading ? (
        <OfflineState
          size={OfflineStateSizes.SMALL}
          title={t('shell.banners.offline.title')}
          description={t('pharmacy.workbench.states.offlineNotice')}
          testID="pharmacy-workbench-offline"
          style={{ display: screen.isOffline ? 'block' : 'none' }}
        />
      ) : null}

      {!screen.isLoading && screen.canViewWorkbench ? (
        <>
          <StyledSummaryGrid>
            {screen.summaryCards.map((card) => (
              <StyledSummaryCard key={card.id}>
                <StyledSummaryLabel>{card.label}</StyledSummaryLabel>
                <StyledSummaryValue>{card.value}</StyledSummaryValue>
              </StyledSummaryCard>
            ))}
          </StyledSummaryGrid>

          <StyledLayout>
            <StyledPanel>
              <Card variant="outlined">
                <StyledSectionTitle>{t('pharmacy.workbench.list.title')}</StyledSectionTitle>
                <StyledFilterGrid>
                  <TextField
                    label={t('pharmacy.workbench.filters.search')}
                    value={screen.orderSearch}
                    onChangeText={screen.onOrderSearchChange}
                    density="compact"
                  />
                  <Select
                    label={t('pharmacy.workbench.filters.status')}
                    value={screen.orderStatusFilter}
                    options={orderStatusOptions}
                    onValueChange={screen.onOrderStatusFilterChange}
                    compact
                  />
                </StyledFilterGrid>
                <StyledInlineActions>
                  <Button variant="surface" size="small" onPress={screen.onClearFilters}>
                    {t('pharmacy.workbench.filters.clear')}
                  </Button>
                  <Text variant="caption">
                    {t('pharmacy.workbench.list.count', { count: screen.worklist.length })}
                  </Text>
                </StyledInlineActions>
              </Card>

              <Card variant="outlined">
                {screen.worklist.length === 0 ? (
                  <EmptyState
                    title={t('pharmacy.workbench.states.emptyTitle')}
                    description={t('pharmacy.workbench.states.emptyDescription')}
                  />
                ) : (
                  <StyledWorklist>
                    {screen.worklist.map((order, index) => {
                      const orderId = order.display_id || order.id;
                      const isSelected =
                        String(screen.selectedOrderId || '').toUpperCase() ===
                        String(orderId || '').toUpperCase();
                      const status = String(order.status || '').toUpperCase();

                      return (
                        <StyledWorklistItem
                          key={orderId || `pharmacy-order-${index + 1}`}
                          $selected={isSelected}
                          onPress={() => screen.onSelectOrder(order)}
                          accessibilityRole="button"
                        >
                          <StyledItemHeader>
                            <StyledItemTitle>
                              {order.patient_display_name || t('common.notAvailable')}
                            </StyledItemTitle>
                            <Badge>{status || t('common.notAvailable')}</Badge>
                          </StyledItemHeader>
                          <StyledItemMeta>
                            <Icon
                              glyph={STATUS_ICON[status] || '\u{1F48A}'}
                              size="xs"
                              decorative
                            />{' '}
                            {`${t('pharmacy.workbench.snapshot.orderId')}: ${
                              orderId || t('common.notAvailable')
                            }`}
                          </StyledItemMeta>
                          <StyledItemMeta>
                            {t('pharmacy.workbench.list.metrics', {
                              items: Number(order.item_count || 0),
                              pending: Number(order.quantity_pending_total || 0),
                              remaining: Number(order.quantity_remaining_total || 0),
                            })}
                          </StyledItemMeta>
                        </StyledWorklistItem>
                      );
                    })}
                  </StyledWorklist>
                )}
              </Card>
            </StyledPanel>

            <StyledPanel>
              <Card variant="outlined">
                <StyledInlineActions>
                  <StyledSectionTitle>{t('pharmacy.workbench.snapshot.title')}</StyledSectionTitle>
                  <Button
                    variant="surface"
                    size="small"
                    onPress={screen.onOpenPatientProfile}
                    disabled={!screen.selectedSummary.patientId}
                  >
                    {t('pharmacy.workbench.quickLinks.patient')}
                  </Button>
                </StyledInlineActions>

                {!screen.selectedWorkflow?.order ? (
                  <EmptyState
                    title={t('pharmacy.workbench.states.noSelectionTitle')}
                    description={t('pharmacy.workbench.states.noSelectionDescription')}
                  />
                ) : (
                  <StyledSnapshotGrid>
                    {renderSnapshotField(
                      t('pharmacy.workbench.snapshot.orderId'),
                      screen.selectedSummary.orderId,
                      t('common.notAvailable')
                    )}
                    {renderSnapshotField(
                      t('pharmacy.workbench.snapshot.patient'),
                      screen.selectedSummary.patientName,
                      t('common.notAvailable')
                    )}
                    {renderSnapshotField(
                      t('pharmacy.workbench.snapshot.patientId'),
                      screen.selectedSummary.patientId,
                      t('common.notAvailable')
                    )}
                    {renderSnapshotField(
                      t('pharmacy.workbench.snapshot.encounterId'),
                      screen.selectedSummary.encounterId,
                      t('common.notAvailable')
                    )}
                    {renderSnapshotField(
                      t('pharmacy.workbench.snapshot.status'),
                      screen.selectedSummary.status,
                      t('common.notAvailable')
                    )}
                    {renderSnapshotField(
                      t('pharmacy.workbench.snapshot.orderedAt'),
                      screen.selectedSummary.orderedAt,
                      t('common.notAvailable')
                    )}
                    {renderSnapshotField(
                      t('pharmacy.workbench.snapshot.itemCount'),
                      String(screen.selectedSummary.itemCount || 0),
                      '0'
                    )}
                    {renderSnapshotField(
                      t('pharmacy.workbench.snapshot.prescribedTotal'),
                      String(screen.selectedSummary.prescribed || 0),
                      '0'
                    )}
                    {renderSnapshotField(
                      t('pharmacy.workbench.snapshot.dispensedTotal'),
                      String(screen.selectedSummary.dispensed || 0),
                      '0'
                    )}
                    {renderSnapshotField(
                      t('pharmacy.workbench.snapshot.remainingTotal'),
                      String(screen.selectedSummary.remaining || 0),
                      '0'
                    )}
                  </StyledSnapshotGrid>
                )}
              </Card>

              <Card variant="outlined">
                <StyledSectionTitle>{t('pharmacy.workbench.items.title')}</StyledSectionTitle>
                {screen.items.length === 0 ? (
                  <EmptyState
                    title={t('pharmacy.workbench.items.emptyTitle')}
                    description={t('pharmacy.workbench.items.emptyDescription')}
                  />
                ) : (
                  <StyledList>
                    {screen.items.map((item) => {
                      const itemId = item.display_id || item.id;
                      const prepareQty = screen.drafts.prepare.quantities?.[itemId] || '';
                      const returnQty = screen.drafts.returns.quantities?.[itemId] || '';
                      return (
                        <StyledListItem key={itemId}>
                          {`${item.drug_display_name || itemId} | ${t(
                            'pharmacy.workbench.items.metrics',
                            {
                              prescribed: Number(item.quantity_prescribed || 0),
                              dispensed: Number(item.quantity_dispensed || 0),
                              remaining: Number(item.quantity_remaining || 0),
                            }
                          )}`}
                          <StyledActionGrid>
                            <TextField
                              label={t('pharmacy.workbench.actions.prepareQuantity')}
                              value={prepareQty}
                              onChangeText={(value) =>
                                screen.onPrepareQuantityChange(itemId, value)
                              }
                              density="compact"
                            />
                            <TextField
                              label={t('pharmacy.workbench.actions.returnQuantity')}
                              value={returnQty}
                              onChangeText={(value) =>
                                screen.onReturnQuantityChange(itemId, value)
                              }
                              density="compact"
                            />
                          </StyledActionGrid>
                        </StyledListItem>
                      );
                    })}
                  </StyledList>
                )}
              </Card>

              <Card variant="outlined">
                <StyledSectionTitle>{t('pharmacy.workbench.timeline.title')}</StyledSectionTitle>
                {screen.timelineItems.length === 0 ? (
                  <EmptyState
                    title={t('pharmacy.workbench.timeline.emptyTitle')}
                    description={t('pharmacy.workbench.timeline.emptyDescription')}
                  />
                ) : (
                  <StyledList>
                    {screen.timelineItems.map((entry) => (
                      <StyledListItem key={entry.id}>{`${entry.label} | ${entry.timestamp}`}</StyledListItem>
                    ))}
                  </StyledList>
                )}
              </Card>
            </StyledPanel>

            <StyledPanel>
              <Card variant="outlined">
                <StyledSectionTitle>{t('pharmacy.workbench.actions.title')}</StyledSectionTitle>

                <StyledSubsection>
                  <StyledSectionTitle>{t('pharmacy.workbench.actions.prepareTitle')}</StyledSectionTitle>
                  <StyledActionGrid>
                    <TextField
                      label={t('pharmacy.workbench.actions.batchRef')}
                      value={screen.drafts.prepare.dispense_batch_ref}
                      onChangeText={(value) =>
                        screen.onDraftChange('prepare', 'dispense_batch_ref', value)
                      }
                      density="compact"
                    />
                    <TextField
                      label={t('pharmacy.workbench.actions.reason')}
                      value={screen.drafts.prepare.reason}
                      onChangeText={(value) => screen.onDraftChange('prepare', 'reason', value)}
                      density="compact"
                    />
                    <TextArea
                      label={t('pharmacy.workbench.actions.statement')}
                      value={screen.drafts.prepare.statement}
                      onChangeText={(value) =>
                        screen.onDraftChange('prepare', 'statement', value)
                      }
                      rows={2}
                    />
                    <Button
                      variant="primary"
                      size="small"
                      onPress={screen.onPrepareDispense}
                      disabled={!screen.canMutatePharmacy || !screen.actionMatrix.canPrepareDispense}
                    >
                      {t('pharmacy.workbench.actions.prepareAction')}
                    </Button>
                  </StyledActionGrid>
                </StyledSubsection>

                <StyledSubsection>
                  <StyledSectionTitle>{t('pharmacy.workbench.actions.attestTitle')}</StyledSectionTitle>
                  <StyledActionGrid>
                    <Select
                      label={t('pharmacy.workbench.actions.batchRef')}
                      value={screen.drafts.attest.dispense_batch_ref}
                      options={batchOptions}
                      onValueChange={(value) =>
                        screen.onDraftChange('attest', 'dispense_batch_ref', value)
                      }
                      compact
                      searchable
                    />
                    <TextField
                      label={t('pharmacy.workbench.actions.attestedAt')}
                      type="datetime-local"
                      value={screen.drafts.attest.attested_at}
                      onChangeText={(value) => screen.onDraftChange('attest', 'attested_at', value)}
                      density="compact"
                    />
                    <TextArea
                      label={t('pharmacy.workbench.actions.statement')}
                      value={screen.drafts.attest.statement}
                      onChangeText={(value) => screen.onDraftChange('attest', 'statement', value)}
                      rows={2}
                    />
                    <Button
                      variant="surface"
                      size="small"
                      onPress={screen.onAttestDispense}
                      disabled={!screen.canMutatePharmacy || !screen.actionMatrix.canAttestDispense}
                    >
                      {t('pharmacy.workbench.actions.attestAction')}
                    </Button>
                  </StyledActionGrid>
                </StyledSubsection>

                <StyledSubsection>
                  <StyledSectionTitle>{t('pharmacy.workbench.actions.cancelTitle')}</StyledSectionTitle>
                  <StyledActionGrid>
                    <TextField
                      label={t('pharmacy.workbench.actions.cancelReason')}
                      value={screen.drafts.cancel.reason}
                      onChangeText={(value) => screen.onDraftChange('cancel', 'reason', value)}
                      density="compact"
                    />
                    <TextArea
                      label={t('pharmacy.workbench.actions.cancelNotes')}
                      value={screen.drafts.cancel.notes}
                      onChangeText={(value) => screen.onDraftChange('cancel', 'notes', value)}
                      rows={2}
                    />
                    <Button
                      variant="surface"
                      size="small"
                      onPress={screen.onCancelOrder}
                      disabled={!screen.canMutatePharmacy || !screen.actionMatrix.canCancel}
                    >
                      {t('pharmacy.workbench.actions.cancelAction')}
                    </Button>
                    <Button
                      variant="surface"
                      size="small"
                      onPress={screen.onReturnOrder}
                      disabled={!screen.canMutatePharmacy || !screen.actionMatrix.canReturn}
                    >
                      {t('pharmacy.workbench.actions.returnAction')}
                    </Button>
                  </StyledActionGrid>
                </StyledSubsection>
              </Card>

              <Card variant="outlined">
                <StyledSectionTitle>{t('pharmacy.workbench.inventory.title')}</StyledSectionTitle>
                <StyledFilterGrid>
                  <TextField
                    label={t('pharmacy.workbench.inventory.search')}
                    value={screen.stockSearch}
                    onChangeText={screen.onStockSearchChange}
                    density="compact"
                  />
                  <Switch
                    label={t('pharmacy.workbench.inventory.lowStockOnly')}
                    value={Boolean(screen.lowStockOnly)}
                    onValueChange={screen.onLowStockOnlyChange}
                  />
                </StyledFilterGrid>

                {screen.stockRows.length === 0 ? (
                  <EmptyState
                    title={t('pharmacy.workbench.inventory.emptyTitle')}
                    description={t('pharmacy.workbench.inventory.emptyDescription')}
                  />
                ) : (
                  <StyledList>
                    {screen.stockRows.slice(0, 40).map((stock) => (
                      <StyledListItem key={stock.display_id || stock.id}>
                        {`${stock.inventory_item?.name || stock.inventory_item_id} | ${t(
                          'pharmacy.workbench.inventory.metrics',
                          {
                            quantity: Number(stock.quantity || 0),
                            reorder: Number(stock.reorder_level || 0),
                            facility: stock.facility_name || t('common.notAvailable'),
                          }
                        )}`}
                      </StyledListItem>
                    ))}
                  </StyledList>
                )}

                <StyledSubsection>
                  <StyledSectionTitle>{t('pharmacy.workbench.inventory.adjustTitle')}</StyledSectionTitle>
                  <StyledActionGrid>
                    <Select
                      label={t('pharmacy.workbench.inventory.inventoryItem')}
                      value={screen.drafts.adjust.inventory_item_id}
                      options={inventoryItemOptions}
                      onValueChange={(value) =>
                        screen.onDraftChange('adjust', 'inventory_item_id', value)
                      }
                      compact
                      searchable
                    />
                    <TextField
                      label={t('pharmacy.workbench.inventory.facilityId')}
                      value={screen.drafts.adjust.facility_id}
                      onChangeText={(value) => screen.onDraftChange('adjust', 'facility_id', value)}
                      density="compact"
                    />
                    <TextField
                      label={t('pharmacy.workbench.inventory.quantityDelta')}
                      value={screen.drafts.adjust.quantity_delta}
                      onChangeText={(value) =>
                        screen.onDraftChange('adjust', 'quantity_delta', value)
                      }
                      density="compact"
                    />
                    <Select
                      label={t('pharmacy.workbench.inventory.reason')}
                      value={screen.drafts.adjust.reason}
                      options={inventoryReasonOptions}
                      onValueChange={(value) => screen.onDraftChange('adjust', 'reason', value)}
                      compact
                    />
                    <TextField
                      label={t('pharmacy.workbench.inventory.occurredAt')}
                      type="datetime-local"
                      value={screen.drafts.adjust.occurred_at}
                      onChangeText={(value) => screen.onDraftChange('adjust', 'occurred_at', value)}
                      density="compact"
                    />
                    <TextArea
                      label={t('pharmacy.workbench.inventory.notes')}
                      value={screen.drafts.adjust.notes}
                      onChangeText={(value) => screen.onDraftChange('adjust', 'notes', value)}
                      rows={2}
                    />
                    <Button
                      variant="primary"
                      size="small"
                      onPress={screen.onAdjustInventory}
                      disabled={
                        !screen.canMutateInventory || !screen.actionMatrix.canAdjustInventory
                      }
                    >
                      {t('pharmacy.workbench.inventory.adjustAction')}
                    </Button>
                  </StyledActionGrid>
                </StyledSubsection>
              </Card>

              {screen.formError ? <StyledErrorText>{screen.formError}</StyledErrorText> : null}
              {screen.successMessage ? (
                <StyledSuccessText>{screen.successMessage}</StyledSuccessText>
              ) : null}
              {!screen.formError && !screen.successMessage ? (
                <StyledInfoText>{t('pharmacy.workbench.helperText')}</StyledInfoText>
              ) : null}
            </StyledPanel>
          </StyledLayout>
        </>
      ) : null}
    </StyledContainer>
  );
};

export default PharmacyWorkbenchScreen;
