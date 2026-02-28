import React from 'react';
import { Button, Card, Select, Stack, Text, TextArea, TextField } from '@platform/components';
import {
  StyledFormGrid,
  StyledInlineActions,
  StyledMessageText,
  StyledSectionTitle,
} from '../BillingWorkbenchScreen.styles';

const ACTION_OPTIONS = [
  { value: 'ISSUE_INVOICE', label: 'Issue invoice' },
  { value: 'SEND_INVOICE', label: 'Send invoice' },
  { value: 'REQUEST_VOID', label: 'Request invoice void' },
  { value: 'RECORD_PAYMENT', label: 'Record payment' },
  { value: 'REQUEST_REFUND', label: 'Request refund' },
  { value: 'REQUEST_ADJUSTMENT', label: 'Request adjustment' },
];

const BillingActionDrawer = ({
  actionType = 'ISSUE_INVOICE',
  onActionTypeChange,
  draft = {},
  onDraftChange,
  invoiceOptions = [],
  paymentOptions = [],
  statusMessage = '',
  statusVariant = 'info',
  onSubmit,
  isSubmitting = false,
}) => {
  const isInvoiceAction = ['ISSUE_INVOICE', 'SEND_INVOICE', 'REQUEST_VOID', 'REQUEST_ADJUSTMENT'].includes(
    actionType
  );
  const isPaymentAction = ['RECORD_PAYMENT', 'REQUEST_REFUND'].includes(actionType);

  return (
    <Card variant="outlined" testID="billing-workbench-actions-card">
      <Stack spacing="sm">
        <StyledSectionTitle>Quick actions</StyledSectionTitle>
        <Select
          label="Action"
          value={actionType}
          options={ACTION_OPTIONS}
          onValueChange={(value) => onActionTypeChange(String(value || 'ISSUE_INVOICE'))}
          compact
          testID="billing-action-type"
        />

        <StyledFormGrid>
          {isInvoiceAction ? (
            <Select
              label="Invoice"
              value={draft.invoiceIdentifier || ''}
              options={invoiceOptions}
              onValueChange={(value) => onDraftChange('invoiceIdentifier', String(value || ''))}
              searchable
              compact
              testID="billing-action-invoice"
            />
          ) : null}

          {isPaymentAction ? (
            <Select
              label="Payment"
              value={draft.paymentIdentifier || ''}
              options={paymentOptions}
              onValueChange={(value) => onDraftChange('paymentIdentifier', String(value || ''))}
              searchable
              compact
              testID="billing-action-payment"
            />
          ) : null}

          {actionType === 'SEND_INVOICE' ? (
            <TextField
              label="Recipient email"
              value={draft.recipientEmail || ''}
              onChangeText={(value) => onDraftChange('recipientEmail', value)}
              placeholder="patient@example.com"
              testID="billing-action-recipient-email"
            />
          ) : null}

          {['REQUEST_REFUND', 'REQUEST_ADJUSTMENT'].includes(actionType) ? (
            <TextField
              label="Amount"
              value={draft.amount || ''}
              onChangeText={(value) => onDraftChange('amount', value)}
              placeholder="0.00"
              testID="billing-action-amount"
            />
          ) : null}

          {actionType === 'REQUEST_ADJUSTMENT' ? (
            <Select
              label="Adjustment status"
              value={draft.adjustmentStatus || 'ISSUED'}
              options={[
                { value: 'ISSUED', label: 'Issued' },
                { value: 'PAID', label: 'Paid' },
                { value: 'PARTIAL', label: 'Partial' },
                { value: 'DRAFT', label: 'Draft' },
                { value: 'CANCELLED', label: 'Cancelled' },
              ]}
              onValueChange={(value) => onDraftChange('adjustmentStatus', String(value || 'ISSUED'))}
              compact
              testID="billing-action-adjustment-status"
            />
          ) : null}

          {['REQUEST_REFUND', 'REQUEST_ADJUSTMENT', 'REQUEST_VOID'].includes(actionType) ? (
            <TextField
              label="Reason"
              value={draft.reason || ''}
              onChangeText={(value) => onDraftChange('reason', value)}
              placeholder="Reason"
              testID="billing-action-reason"
            />
          ) : null}
        </StyledFormGrid>

        <TextArea
          label="Notes"
          value={draft.notes || ''}
          onChangeText={(value) => onDraftChange('notes', value)}
          rows={3}
          testID="billing-action-notes"
        />

        {statusMessage ? (
          <StyledMessageText $variant={statusVariant}>{statusMessage}</StyledMessageText>
        ) : (
          <Text variant="caption">
            IDs in selectors use human-friendly identifiers only. System IDs are hidden.
          </Text>
        )}

        <StyledInlineActions>
          <Button
            variant="primary"
            size="small"
            onPress={onSubmit}
            disabled={isSubmitting}
            testID="billing-action-submit"
          >
            {isSubmitting ? 'Submitting...' : 'Submit action'}
          </Button>
        </StyledInlineActions>
      </Stack>
    </Card>
  );
};

export default BillingActionDrawer;
