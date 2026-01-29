import styled from 'styled-components/native';
import { TouchableOpacity, Text, View } from 'react-native';

export const Row = styled(TouchableOpacity).withConfig({
  displayName: 'Row',
  componentId: 'Row',
})`
  flex-direction: row;
  align-items: center;
  padding: 12px 14px;
`;

export const Icon = styled(View).withConfig({
  displayName: 'Icon',
  componentId: 'Icon',
})`
  width: 20px;
  height: 20px;
`;

export const Label = styled(Text).withConfig({
  displayName: 'Label',
  componentId: 'Label',
})`
  margin-left: 12px;
  font-size: 14px;
`;

