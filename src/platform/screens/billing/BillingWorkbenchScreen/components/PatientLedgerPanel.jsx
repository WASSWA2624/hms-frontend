import React from 'react';
import { Button, Card, EmptyState, Stack, Text } from '@platform/components';
import {
  StyledGroupBlock,
  StyledGroupTitle,
  StyledInlineActions,
  StyledRecordItem,
  StyledRecordMeta,
  StyledRecordsList,
  StyledSectionTitle,
} from '../BillingWorkbenchScreen.styles';

const PatientLedgerPanel = ({
  ledger = null,
  selectedPatientDisplayId = '',
  onDownloadInvoice,
  onClose,
  isLoading = false,
}) => (
  <Card variant="outlined" testID="billing-workbench-ledger-card">
    <Stack spacing="sm">
      <StyledInlineActions>
        <StyledSectionTitle>Patient ledger</StyledSectionTitle>
        {selectedPatientDisplayId ? (
          <Button
            variant="surface"
            size="small"
            onPress={onClose}
            testID="billing-ledger-close"
          >
            Close
          </Button>
        ) : null}
      </StyledInlineActions>

      {isLoading ? <Text variant="caption">Loading patient ledger...</Text> : null}

      {!isLoading && !ledger ? (
        <EmptyState
          title="No patient selected"
          description="Select a queue or timeline record to open the patient ledger."
          testID="billing-ledger-empty-selection"
        />
      ) : null}

      {!isLoading && ledger ? (
        <>
          <Stack spacing="xs">
            <Text variant="label">
              {ledger.patient?.display_name || 'Patient'} | {ledger.patient?.display_id || '-'}
            </Text>
            <Text variant="caption">Total invoiced: {ledger.summary?.total_invoiced || '0.00'}</Text>
            <Text variant="caption">Net paid: {ledger.summary?.net_paid || '0.00'}</Text>
            <Text variant="caption">Balance due: {ledger.summary?.balance_due || '0.00'}</Text>
          </Stack>

          <StyledRecordsList>
            {(ledger.ledger?.groups || []).map((group) => (
              <StyledGroupBlock key={group.bucket || group.label}>
                <StyledGroupTitle>{group.label || 'Earlier'}</StyledGroupTitle>
                {Array.isArray(group.items)
                  ? group.items.map((item, index) => {
                      const invoiceIdentifier =
                        item.invoice_display_id || item.invoice_backend_identifier;
                      const key =
                        item.display_id ||
                        item.invoice_display_id ||
                        `${group.bucket || 'bucket'}-${index + 1}`;
                      return (
                        <StyledRecordItem key={key}>
                          <StyledInlineActions>
                            <Text variant="label">
                              {item.display_id || item.invoice_display_id || 'Record'}
                            </Text>
                            <Text variant="caption">{item.type || 'ENTRY'}</Text>
                          </StyledInlineActions>
                          <StyledRecordMeta>
                            {item.timeline_at
                              ? new Date(item.timeline_at).toLocaleString()
                              : 'Date unavailable'}
                          </StyledRecordMeta>
                          {invoiceIdentifier ? (
                            <StyledInlineActions>
                              <Button
                                variant="surface"
                                size="small"
                                onPress={() => onDownloadInvoice(invoiceIdentifier)}
                                testID={`billing-ledger-download-${key}`}
                              >
                                Invoice PDF
                              </Button>
                            </StyledInlineActions>
                          ) : null}
                        </StyledRecordItem>
                      );
                    })
                  : null}
              </StyledGroupBlock>
            ))}
          </StyledRecordsList>
        </>
      ) : null}
    </Stack>
  </Card>
);

export default PatientLedgerPanel;
