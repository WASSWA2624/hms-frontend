import styled from 'styled-components';

export const Row = styled.a.withConfig({
  displayName: 'Row',
  componentId: 'Row',
  shouldForwardProp: (prop) => !['$collapsed', '$active', '$level'].includes(prop),
})`
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  min-height: ${({ $collapsed }) => ($collapsed ? '28px' : '44px')};
  height: ${({ $collapsed }) => ($collapsed ? '28px' : 'auto')};
  min-width: ${({ $collapsed }) => ($collapsed ? '28px' : '0')};
  width: ${({ $collapsed }) => ($collapsed ? '28px' : '95%')};
  padding: ${({ theme, $collapsed, $level = 0 }) =>
    $collapsed ? `0 ${theme.spacing.xs}px` : `${theme.spacing.xs / 2}px ${theme.spacing.sm + $level * theme.spacing.lg}px`};
  margin: ${({ $collapsed }) => ($collapsed ? '0 auto' : '0')};
  border-radius: ${({ theme }) => theme.radius?.sm ?? 4}px;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.text.primary)};
  background-color: ${({ theme, $active }) => ($active ? theme.colors.background.secondary : 'transparent')};
  font-size: ${({ theme }) => theme.typography?.fontSize?.sm ?? 14}px;
  font-weight: ${({ theme, $active }) => ($active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.normal)};
  transition: background-color 0.15s ease, color 0.15s ease;
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  &:hover {
    background-color: ${({ theme, $active }) => ($active ? theme.colors.background.secondary : theme.colors.background.tertiary)};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const IconWrapper = styled.span.withConfig({
  displayName: 'IconWrapper',
  componentId: 'IconWrapper',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: inherit;
`;

export const Label = styled.span.withConfig({
  displayName: 'Label',
  componentId: 'Label',
  shouldForwardProp: (prop) => prop !== '$collapsed' && prop !== '$active',
})`
  margin-left: ${({ theme }) => theme.spacing.xs}px;
  flex: 1;
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme, $active }) => ($active ? theme.typography.fontWeight.medium : theme.typography.fontWeight.normal)};
  color: inherit;
  display: ${({ $collapsed }) => ($collapsed ? 'none' : 'inline')};
  @media (max-width: ${({ theme }) => theme.breakpoints?.tablet ?? 768}px) {
    display: inline;
  }
`;

export const ExpandButton = styled.button.withConfig({
  displayName: 'ExpandButton',
  componentId: 'ExpandButton',
  shouldForwardProp: (prop) => prop !== '$expanded',
})`
  margin-left: auto;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: ${({ theme }) => theme.radius?.sm ?? 4}px;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography?.fontSize?.xs ?? 12}px;
  font-weight: ${({ theme }) => theme.typography?.fontWeight?.semibold};
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: ${({ $expanded }) => ($expanded ? 'rotate(0deg)' : 'rotate(-90deg)')};
  transition: transform 0.2s ease, background-color 0.15s ease;
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.primary};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;
