import React from 'react';
import { Badge, Button, Card, EmptyState, Stack, Text } from '@platform/components';
import {
  StyledGroupBlock,
  StyledGroupTitle,
  StyledInlineActions,
  StyledRecordItem,
  StyledRecordMeta,
  StyledRecordsList,
  StyledSectionTitle,
} from '../BillingWorkbenchScreen.styles';

const normalize = (value) => String(value || '').trim();

const BillingTimeline = ({
  groups = [],
  onOpenPatientLedger,
  onDownloadInvoice,
  onRefresh,
  isRefreshing = false,
}) => {
  const hasRows = groups.some((group) => Array.isArray(group.items) && group.items.length > 0);

  return (
    <Card variant="outlined" testID="billing-workbench-timeline-card">
      <Stack spacing="sm">
        <StyledInlineActions>
          <StyledSectionTitle>Timeline</StyledSectionTitle>
          <Button
            variant="surface"
            size="small"
            onPress={onRefresh}
            disabled={isRefreshing}
            testID="billing-workbench-timeline-refresh"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </StyledInlineActions>
        {!hasRows ? (
          <EmptyState
            title="Timeline is empty"
            description="No billing events were found for the selected scope."
            testID="billing-timeline-empty"
          />
        ) : (
          <StyledRecordsList>
            {groups.map((group) => (
              <StyledGroupBlock key={group.bucket || group.label}>
                <StyledGroupTitle>{group.label || 'Earlier'}</StyledGroupTitle>
                {Array.isArray(group.items)
                  ? group.items.map((item, index) => {
                    const key =
                        normalize(item.display_id) ||
                        normalize(item.backend_identifier) ||
                        `${group.bucket || 'bucket'}-${index + 1}`;
                      const patientIdentifier = normalize(
                        item.patient_display_id || item.patient_backend_identifier
                      );
                      const invoiceIdentifier = normalize(
                        item.invoice_display_id || item.invoice_backend_identifier
                      );
                      const canOpenLedger = Boolean(patientIdentifier);
                      const canDownloadInvoice = Boolean(invoiceIdentifier);

                      return (
                        <StyledRecordItem
                          key={key}
                          onPress={() => {
                            if (canOpenLedger) {
                              onOpenPatientLedger(patientIdentifier);
                            }
                          }}
                          accessibilityRole="button"
                          testID={`billing-timeline-item-${key}`}
                        >
                          <StyledInlineActions>
                            <Text variant="label">
                              {item.display_id || item.invoice_display_id || 'Record'}
                            </Text>
                            <Badge>{item.type || 'ENTRY'}</Badge>
                            <Badge>{item.status || 'UNKNOWN'}</Badge>
                          </StyledInlineActions>
                          <StyledRecordMeta>
                            {item.patient_display_name || 'Patient not available'}
                          </StyledRecordMeta>
                          <StyledRecordMeta>
                            {item.timeline_at
                              ? new Date(item.timeline_at).toLocaleString()
                              : 'Date unavailable'}
                          </StyledRecordMeta>
                          <StyledInlineActions>
                            {canOpenLedger ? (
                              <Button
                                variant="surface"
                                size="small"
                                onPress={() => onOpenPatientLedger(patientIdentifier)}
                                testID={`billing-timeline-ledger-${key}`}
                              >
                                Patient ledger
                              </Button>
                            ) : null}
                            {canDownloadInvoice ? (
                              <Button
                                variant="surface"
                                size="small"
                                onPress={() => onDownloadInvoice(invoiceIdentifier)}
                                testID={`billing-timeline-download-${key}`}
                              >
                                Invoice PDF
                              </Button>
                            ) : null}
                          </StyledInlineActions>
                        </StyledRecordItem>
                      );
                    })
                  : null}
              </StyledGroupBlock>
            ))}
          </StyledRecordsList>
        )}
      </Stack>
    </Card>
  );
};

export default BillingTimeline;
