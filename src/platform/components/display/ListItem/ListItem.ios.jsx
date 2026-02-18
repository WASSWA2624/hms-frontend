/**
 * ListItem Component - iOS
 * Platform wrapper for shared list-item behavior.
 * File: ListItem.ios.jsx
 */
import React from 'react';
import { useTheme } from 'styled-components/native';

import createListItemComponent from './ListItem.shared';
import * as styles from './ListItem.ios.styles';

const ListItemShared = createListItemComponent({
  styles,
  isWeb: false,
});

const ListItemIOS = (props) => {
  const theme = useTheme();
  return <ListItemShared {...props} theme={theme} />;
};

export default ListItemIOS;
