/**
 * MobileSidebar - Android
 * Drawer overlay with panel and Sidebar (matches mobile web)
 * File: MobileSidebar/MobileSidebar.android.jsx
 */
import React from 'react';
import { Modal } from 'react-native';
import { Sidebar } from '@platform/components';
import Brand from '../Brand';
import {
  StyledMobileSidebarBackdrop,
  StyledMobileSidebarContent,
  StyledMobileSidebarHeader,
  StyledMobileSidebarHeaderBrand,
  StyledMobileSidebarPanel,
  StyledMobileCloseButton,
  StyledMobileCloseButtonText,
  StyledMobileSidebarWrap,
} from './MobileSidebar.android.styles';

export default function MobileSidebar({
  isOpen,
  onClose,
  sidebarLabel,
  closeLabel,
  mainItems,
  isItemVisible,
  appName,
  appShortName,
  closeButtonRef,
  panelRef,
}) {
  if (!isOpen) return null;
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      accessibilityViewIsModal
      accessibilityLabel={sidebarLabel}
    >
      <StyledMobileSidebarWrap>
        <StyledMobileSidebarPanel ref={panelRef}>
          <StyledMobileSidebarHeader>
            <StyledMobileSidebarHeaderBrand>
              {appName != null && (
                <Brand
                  appName={appName}
                  appShortName={appShortName ?? appName}
                />
              )}
            </StyledMobileSidebarHeaderBrand>
            <StyledMobileCloseButton
              onPress={onClose}
              accessibilityLabel={closeLabel}
              ref={closeButtonRef}
            >
              <StyledMobileCloseButtonText>X</StyledMobileCloseButtonText>
            </StyledMobileCloseButton>
          </StyledMobileSidebarHeader>
          <StyledMobileSidebarContent>
            <Sidebar
              accessibilityLabel={sidebarLabel}
              items={mainItems}
              isItemVisible={isItemVisible}
              collapsed={false}
              testID="main-sidebar-mobile"
            />
          </StyledMobileSidebarContent>
        </StyledMobileSidebarPanel>
        <StyledMobileSidebarBackdrop
          accessibilityLabel={closeLabel}
          accessibilityRole="button"
          onPress={onClose}
        />
      </StyledMobileSidebarWrap>
    </Modal>
  );
}
