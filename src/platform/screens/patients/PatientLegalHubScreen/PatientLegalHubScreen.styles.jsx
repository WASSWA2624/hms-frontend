import styled from 'styled-components/native';
import { Button, Card } from '@platform/components';

const StyledContainer = styled.View`
  flex: 1;
  width: 100%;
  min-width: 0;
  gap: ${({ theme }) => theme.spacing.sm + theme.spacing.xs + 2}px;
  overflow: visible;
`;

const StyledHeroCard = styled(Card)`
  overflow: visible;
`;

const StyledHeader = styled.View`
  width: 100%;
  min-width: 0;
  gap: ${({ theme }) => theme.spacing.xs + 2}px;
`;

const StyledHeaderEyebrow = styled.Text`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-transform: uppercase;
`;

const StyledTabRow = styled.View`
  width: 100%;
  min-height: ${({ theme }) => theme.spacing.lg + theme.spacing.md}px;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding: ${({ theme }) => theme.spacing.xs}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  overflow: visible;
`;

const StyledTabSlot = styled.View`
  min-height: ${({ theme }) => theme.spacing.lg + theme.spacing.xs}px;
  min-width: ${({ $isCompact }) => ($isCompact ? '48%' : '160px')};
  flex-grow: ${({ $isCompact }) => ($isCompact ? 1 : 0)};
  flex-shrink: 0;
`;

const StyledTabButton = styled(Button)`
  width: 100%;
  justify-content: center;
`;

const StyledSectionMeta = styled.Text`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
`;

const StyledActions = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledActionButton = styled(Button)`
  flex-grow: ${({ $isCompact }) => ($isCompact ? 1 : 0)};
`;

const StyledContentCard = styled(Card)`
  overflow: visible;
`;

const StyledListHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledList = styled.View`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledListItem = styled.View`
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.radius.lg - 2}px;
  padding: ${({ theme }) => theme.spacing.sm + theme.spacing.xs}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const StyledListItemHeader = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const StyledListItemTitleBlock = styled.View`
  flex: 1;
  min-width: 0;
  gap: ${({ theme }) => theme.spacing.xs / 2}px;
`;

const StyledListItemActions = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledRecordMetaList = styled.View`
  gap: ${({ theme }) => theme.spacing.xs / 2}px;
`;

const StyledInlineBadge = styled.View`
  align-self: flex-start;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: ${({ theme }) => theme.spacing.xs / 2}px ${({ theme }) => theme.spacing.xs}px;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const StyledInlineBadgeLabel = styled.Text`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
`;

const StyledForm = styled.View`
  gap: ${({ theme }) => theme.spacing.sm + theme.spacing.xs}px;
`;

const StyledField = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const StyledFormActions = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export {
  StyledActionButton,
  StyledActions,
  StyledContainer,
  StyledContentCard,
  StyledField,
  StyledForm,
  StyledFormActions,
  StyledHeader,
  StyledHeaderEyebrow,
  StyledHeroCard,
  StyledInlineBadge,
  StyledInlineBadgeLabel,
  StyledList,
  StyledListHeader,
  StyledListItem,
  StyledListItemActions,
  StyledListItemHeader,
  StyledListItemTitleBlock,
  StyledRecordMetaList,
  StyledSectionMeta,
  StyledTabButton,
  StyledTabRow,
  StyledTabSlot,
};
