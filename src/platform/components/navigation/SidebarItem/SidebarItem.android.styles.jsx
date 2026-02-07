import styled from 'styled-components/native';
import { TouchableOpacity, Text, View } from 'react-native';

export const Row = styled(TouchableOpacity).withConfig({
  displayName: 'Row',
  componentId: 'Row',
  shouldForwardProp: (prop) => prop !== '$active',
})`
  flex-direction: row;
  align-items: center;
  padding: 12px 14px;
  background-color: ${({ theme, $active }) => ($active ? theme.colors.background.secondary : 'transparent')};
`;

export const IconBox = styled(View).withConfig({
  displayName: 'IconBox',
  componentId: 'SidebarItem_IconBox',
})`
  width: 20px;
  height: 20px;
`;

export const Label = styled(Text).withConfig({
  displayName: 'Label',
  componentId: 'Label',
  shouldForwardProp: (prop) => prop !== '$active',
})`
  margin-left: 12px;
  font-size: 14px;
  font-weight: ${({ theme, $active }) => ($active ? theme.typography?.fontWeight?.medium ?? 600 : theme.typography?.fontWeight?.normal ?? 400)};
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.text.primary)};
`;

