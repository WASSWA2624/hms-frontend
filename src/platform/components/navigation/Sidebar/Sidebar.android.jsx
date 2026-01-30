/**
 * Sidebar Component - Android
 * Mobile navigation drawer (typically used in drawer navigation)
 * File: Sidebar.android.jsx
 */
import React from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useI18n } from '@hooks';
import { sidebarMenu } from '@platform/components/navigation/Sidebar/useSidebar';
import SidebarItem from '@platform/components/navigation/SidebarItem';
import { StyledSidebar, StyledSidebarContent } from './Sidebar.android.styles';

/**
 * Sidebar component for Android
 * @param {Object} props - Sidebar props
 * @param {Array} props.items - Navigation items
 * @param {Function} props.onItemPress - Item press handler
 * @param {Function} props.isItemVisible - Function to check item visibility
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {Object} props.style - Additional styles
 */
const SidebarAndroid = ({ accessibilityLabel, testID, style, ...rest }) => {
  const { t } = useI18n();
  const router = useRouter();
  return (
    <StyledSidebar
      accessibilityRole="navigation"
      accessibilityLabel={accessibilityLabel || t('navigation.sidebar.title')}
      testID={testID}
      style={style}
      {...rest}
    >
      <ScrollView scrollEnabled showsVerticalScrollIndicator contentContainerStyle={{ paddingBottom: 16 }}>
        <StyledSidebarContent>
          {sidebarMenu.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={t(`navigation.items.main.${item.id}`)}
              path={item.href}
              collapsed={false}
              active={false}
              onClick={() => item.href && router.push(item.href)}
            />
          ))}
        </StyledSidebarContent>
      </ScrollView>
    </StyledSidebar>
  );
};

export default SidebarAndroid;

