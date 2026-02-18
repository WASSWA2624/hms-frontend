/**
 * ListItem Component - Android
 * Platform wrapper for shared list-item behavior.
 * File: ListItem.android.jsx
 */
import React from 'react';
import { useTheme } from 'styled-components/native';

import createListItemComponent from './ListItem.shared';
import * as styles from './ListItem.android.styles';

const ListItemShared = createListItemComponent({
  styles,
  isWeb: false,
});

const ListItemAndroid = (props) => {
  const theme = useTheme();
  return <ListItemShared {...props} theme={theme} />;
};

export default ListItemAndroid;
