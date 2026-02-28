import React from 'react';
import { Badge, Button, Card, EmptyState, Stack, Text } from '@platform/components';
import {
  StyledInlineActions,
  StyledQueueCount,
  StyledQueueItem,
  StyledQueueLabel,
  StyledQueueList,
  StyledRecordItem,
  StyledRecordMeta,
  StyledRecordsList,
  StyledSectionTitle,
} from '../BillingWorkbenchScreen.styles';

const normalize = (value) => String(value || '').trim();

const BillingQueue = ({
  queues = [],
  activeQueue = '',
  queueItems = [],
  onSelectQueue,
  onSelectItem,
  onApproveApproval,
  onRejectApproval,
  selectedItemIdentifier = '',
  isQueueLoading = false,
}) => (
  <Card variant="outlined" testID="billing-workbench-queue-card">
    <Stack spacing="sm">
      <StyledSectionTitle>Action queues</StyledSectionTitle>
      <StyledQueueList>
        {queues.map((entry) => {
          const queue = normalize(entry.queue);
          return (
            <StyledQueueItem
              key={queue}
              $active={queue === normalize(activeQueue)}
              onPress={() => onSelectQueue(queue)}
              accessibilityRole="button"
              testID={`billing-queue-${queue.toLowerCase()}`}
            >
              <StyledQueueLabel>{entry.label || queue}</StyledQueueLabel>
              <StyledQueueCount>{Number(entry.count || 0)}</StyledQueueCount>
            </StyledQueueItem>
          );
        })}
      </StyledQueueList>

      <StyledInlineActions>
        <Text variant="caption">
          {isQueueLoading
            ? 'Refreshing selected queue...'
            : `${queueItems.length} records in selected queue`}
        </Text>
      </StyledInlineActions>

      {queueItems.length === 0 ? (
        <EmptyState
          title="No records"
          description="The selected queue has no records right now."
          testID="billing-queue-empty"
        />
      ) : (
        <StyledRecordsList>
          {queueItems.map((item, index) => {
            const identifier = normalize(item.display_id || item.approval_display_id);
            const fallbackId = normalize(item.backend_identifier || item.approval_backend_identifier);
            const itemKey = identifier || fallbackId || `queue-item-${index + 1}`;
            const isSelected =
              normalize(selectedItemIdentifier).toUpperCase() ===
              normalize(identifier || fallbackId).toUpperCase();
            const isApprovalQueue = normalize(activeQueue) === 'APPROVAL_REQUIRED';

            return (
              <StyledRecordItem
                key={itemKey}
                $active={isSelected}
                onPress={() => onSelectItem(item)}
                accessibilityRole="button"
                testID={`billing-queue-item-${index + 1}`}
              >
                <StyledInlineActions>
                  <Text variant="label">{identifier || 'Record'}</Text>
                  <Badge>{item.status || 'UNKNOWN'}</Badge>
                </StyledInlineActions>
                <StyledRecordMeta>
                  {item.patient_display_name || 'Patient not available'}
                </StyledRecordMeta>
                <StyledRecordMeta>
                  {item.timeline_at ? new Date(item.timeline_at).toLocaleString() : 'Date unavailable'}
                </StyledRecordMeta>
                {isApprovalQueue ? (
                  <StyledInlineActions>
                    <Button
                      variant="surface"
                      size="small"
                      onPress={() => onApproveApproval(item)}
                      testID={`billing-queue-approve-${index + 1}`}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="surface"
                      size="small"
                      onPress={() => onRejectApproval(item)}
                      testID={`billing-queue-reject-${index + 1}`}
                    >
                      Reject
                    </Button>
                  </StyledInlineActions>
                ) : null}
              </StyledRecordItem>
            );
          })}
        </StyledRecordsList>
      )}
    </Stack>
  </Card>
);

export default BillingQueue;
