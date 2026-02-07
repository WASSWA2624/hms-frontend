/**
 * SidebarItem Styles - Android
 * Theme tokens only; 44px min touch target (accessibility.mdc).
 */
import styled from 'styled-components/native';
import { TouchableOpacity, Pressable, Text, View } from 'react-native';

export const Row = styled(View).withConfig({
  displayName: 'Row',
  componentId: 'Row',
  shouldForwardProp: (prop) => prop !== '$active' && prop !== '$level',
})`
  flex-direction: row;
  align-items: center;
  min-height: 44px;
  padding: ${({ theme }) => theme.spacing.xs / 2}px ${({ theme }) => theme.spacing.sm}px;
  padding-left: ${({ theme, $level = 0 }) => theme.spacing.sm + $level * theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.radius?.sm ?? 4}px;
  background-color: ${({ theme, $active }) => ($active ? theme.colors.background.secondary : 'transparent')};
`;

export const RowPressable = styled(TouchableOpacity).withConfig({
  displayName: 'RowPressable',
  componentId: 'RowPressable',
})`
  flex-direction: row;
  align-items: center;
  flex: 1;
  min-height: 44px;
`;

export const IconBox = styled(View).withConfig({
  displayName: 'IconBox',
  componentId: 'SidebarItem_IconBox',
})`
  width: 20px;
  height: 20px;
  justify-content: center;
  align-items: center;
`;

export const Label = styled(Text).withConfig({
  displayName: 'Label',
  componentId: 'Label',
  shouldForwardProp: (prop) => prop !== '$active',
})`
  margin-left: ${({ theme }) => theme.spacing.xs}px;
  flex: 1;
  font-size: ${({ theme }) => theme.typography?.fontSize?.sm ?? 14}px;
  font-weight: ${({ theme, $active }) => ($active ? theme.typography?.fontWeight?.semibold : theme.typography?.fontWeight?.normal)};
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.text.primary)};
`;

export const ExpandTouch = styled(Pressable).withConfig({
  displayName: 'ExpandTouch',
  componentId: 'ExpandTouch',
  shouldForwardProp: (prop) => prop !== '$expanded',
})`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radius?.sm ?? 4}px;
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  justify-content: center;
  align-items: center;
`;

export const ExpandChevron = styled(Text).withConfig({
  displayName: 'ExpandChevron',
  componentId: 'ExpandChevron',
  shouldForwardProp: (prop) => prop !== '$expanded',
})`
  font-size: ${({ theme }) => theme.typography?.fontSize?.xs ?? 12}px;
  font-weight: ${({ theme }) => theme.typography?.fontWeight?.semibold};
  color: ${({ theme }) => theme.colors.text.secondary};
  transform: ${({ $expanded }) => ($expanded ? 'rotate(0deg)' : 'rotate(-90deg)')};
`;
