import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Row, Icon, Label } from './SidebarItem.ios.styles.jsx';

const normalize = (props) => {
  if (props.item) {
    const { path, href, label, icon } = props.item;
    return {
      path: path || href,
      label,
      icon,
      collapsed: props.collapsed,
      active: props.active,
      onPress: props.onPress,
    };
  }
  return {
    path: props.path || props.href,
    label: props.label,
    icon: props.icon,
    collapsed: props.collapsed,
    active: props.active,
    onPress: props.onPress,
  };
};

const SidebarItemIOS = (props) => {
  const { path, label, icon, collapsed, active, onPress } = normalize(props);

  const handlePress = () => {
    if (onPress) onPress();
    // Navigation logic can be handled at a higher level or by passing a handler via props
  };

  return (
    <TouchableOpacity onPress={handlePress} accessibilityLabel={label} accessibilityState={{ selected: !!active }}>
      <Row active={active}>
        <Icon name={icon} />
        <Label collapsed={collapsed}>{label}</Label>
      </Row>
    </TouchableOpacity>
  );
};

export default SidebarItemIOS;