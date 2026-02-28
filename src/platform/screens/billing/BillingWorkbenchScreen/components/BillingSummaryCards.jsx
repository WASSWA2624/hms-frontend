import React from 'react';
import { Text } from '@platform/components';
import {
  StyledSummaryGrid,
  StyledSummaryLabel,
  StyledSummaryTile,
  StyledSummaryValue,
} from '../BillingWorkbenchScreen.styles';

const CARD_KEYS = [
  { key: 'needs_issue', label: 'Needs issue' },
  { key: 'pending_payment', label: 'Pending payment' },
  { key: 'claims_pending', label: 'Claims pending' },
  { key: 'approval_required', label: 'Approval required' },
  { key: 'overdue', label: 'Overdue' },
];

const BillingSummaryCards = ({ summary = {}, testIDPrefix = 'billing-summary-card' }) => (
  <StyledSummaryGrid>
    {CARD_KEYS.map((card) => (
      <StyledSummaryTile key={card.key}>
        <StyledSummaryLabel>{card.label}</StyledSummaryLabel>
        <StyledSummaryValue>{Number(summary?.[card.key] || 0)}</StyledSummaryValue>
      </StyledSummaryTile>
    ))}
    <StyledSummaryTile testID={`${testIDPrefix}-payments-today`}>
      <StyledSummaryLabel>Payments today</StyledSummaryLabel>
      <StyledSummaryValue>{summary?.payments_today_total || '0.00'}</StyledSummaryValue>
    </StyledSummaryTile>
    <StyledSummaryTile testID={`${testIDPrefix}-refunds-today`}>
      <StyledSummaryLabel>Refunds today</StyledSummaryLabel>
      <StyledSummaryValue>{summary?.refunds_today_total || '0.00'}</StyledSummaryValue>
      <Text variant="caption">Monetary totals are from completed records.</Text>
    </StyledSummaryTile>
  </StyledSummaryGrid>
);

export default BillingSummaryCards;
