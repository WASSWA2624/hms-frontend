import styled from 'styled-components';

export const Row = styled.a.withConfig({
  displayName: 'Row',
  componentId: 'Row',
})`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.text.primary)};
  background-color: ${({ theme, $active }) => ($active ? theme.colors.background.secondary : 'transparent')};
  border-radius: ${({ theme }) => theme.radius?.md ?? 8}px;
  transition: background-color 0.15s ease, color 0.15s ease;

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
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: inherit;
`;

export const Label = styled.span.withConfig({
  displayName: 'Label',
  componentId: 'Label',
})`
  margin-left: ${({ theme }) => theme.spacing.sm}px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  font-weight: ${({ theme, $active }) => ($active ? theme.typography.fontWeight.medium : theme.typography.fontWeight.normal)};
  display: ${({ collapsed }) => (collapsed ? 'none' : 'inline')};
  color: inherit;
`;
