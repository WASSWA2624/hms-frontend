/**
 * ListItem Component - Web
 * Platform wrapper for shared list-item behavior.
 * File: ListItem.web.jsx
 */
import React from 'react';
import { useTheme } from 'styled-components';

import createListItemComponent from './ListItem.shared';
import * as styles from './ListItem.web.styles';

const ListItemShared = createListItemComponent({
  styles,
  isWeb: true,
});

const ListItemWeb = (props) => {
  const theme = useTheme();
  return <ListItemShared {...props} theme={theme} />;
};

export default ListItemWeb;
