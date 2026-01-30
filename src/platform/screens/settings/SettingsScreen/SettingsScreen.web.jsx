/**
 * SettingsScreen - Web
 * Template: tablet/desktop = resizable sidebar + content; mobile = drawer nav + full-width content.
 * Per platform-ui.mdc: presentation-only; theme via styles.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useI18n } from '@hooks';
import { getMenuIconGlyph } from '@config/sideMenu';
import {
  StyledContainer,
  StyledMobileHeader,
  StyledMobileMenuButton,
  StyledDrawerOverlay,
  StyledSidebarWrapper,
  StyledSidebar,
  StyledSidebarTitle,
  StyledGroup,
  StyledGroupToggle,
  StyledGroupChevron,
  StyledGroupContent,
  StyledNavList,
  StyledNavItem,
  StyledNavLink,
  StyledNavLinkIcon,
  StyledNavLinkLabel,
  StyledResizeHandle,
  StyledContent,
} from './SettingsScreen.web.styles';
import useSettingsScreen from './useSettingsScreen';
import useSettingsSidebarResize from './useSettingsSidebarResize';

const SettingsScreenWeb = ({ children }) => {
  const { t } = useI18n();
  const { groupedTabs, onTabChange, currentTabId } = useSettingsScreen();
  const {
    sidebarWidth,
    sidebarMinWidth,
    sidebarMaxWidth,
    handleResizeStart,
    handleResizeKeyDown,
  } = useSettingsSidebarResize();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState(() =>
    new Set(groupedTabs.map((g) => g.id))
  );

  const toggleGroup = useCallback((groupId) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  }, []);

  const handleNavSelect = useCallback(
    (tabId) => {
      onTabChange(tabId);
      setMobileDrawerOpen(false);
    },
    [onTabChange]
  );

  const openDrawer = useCallback(() => setMobileDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setMobileDrawerOpen(false), []);

  useEffect(() => {
    if (!mobileDrawerOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeDrawer();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileDrawerOpen, closeDrawer]);

  return (
    <StyledContainer testID="settings-screen" role="main" aria-label={t('settings.screen.label')}>
      <StyledMobileHeader>
        <StyledMobileMenuButton
          type="button"
          onClick={openDrawer}
          aria-label={t('settings.sidebar.menuOpen')}
          aria-expanded={mobileDrawerOpen}
          data-testid="settings-mobile-menu-button"
        >
          <span aria-hidden>☰</span>
          <span>{t('settings.sidebar.menu')}</span>
        </StyledMobileMenuButton>
      </StyledMobileHeader>

      <StyledDrawerOverlay
        $open={mobileDrawerOpen}
        onClick={closeDrawer}
        aria-hidden={!mobileDrawerOpen}
        data-testid="settings-drawer-overlay"
      />

      <StyledSidebarWrapper $drawerOpen={mobileDrawerOpen}>
        <StyledSidebar
          aria-label={t('settings.tabs.accessibilityLabel')}
          $width={sidebarWidth}
          $minWidth={sidebarMinWidth}
        >
          <StyledSidebarTitle id="settings-nav-title">{t('settings.title')}</StyledSidebarTitle>
          {groupedTabs.map((group) => {
            const isExpanded = expandedGroups.has(group.id);
            return (
              <StyledGroup key={group.id} aria-labelledby={`settings-group-${group.id}`}>
                <StyledGroupToggle
                  type="button"
                  id={`settings-group-${group.id}`}
                  onClick={() => toggleGroup(group.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`settings-group-content-${group.id}`}
                  data-testid={`settings-group-toggle-${group.id}`}
                >
                  <span>{t(group.labelKey)}</span>
                  <StyledGroupChevron $expanded={isExpanded} aria-hidden>
                    ▼
                  </StyledGroupChevron>
                </StyledGroupToggle>
                <StyledGroupContent
                  id={`settings-group-content-${group.id}`}
                  $expanded={isExpanded}
                  role="region"
                  aria-labelledby={`settings-group-${group.id}`}
                >
                  <StyledNavList>
                    {group.tabs.map((tab) => {
                      const active = currentTabId === tab.id;
                      const iconGlyph = tab.icon ? getMenuIconGlyph(tab.icon) : null;
                      return (
                        <StyledNavItem key={tab.id}>
                          <StyledNavLink
                            type="button"
                            $active={active}
                            onClick={() => handleNavSelect(tab.id)}
                            data-testid={tab.testID}
                            aria-current={active ? 'page' : undefined}
                            aria-label={t(tab.label)}
                          >
                            {iconGlyph ? (
                              <StyledNavLinkIcon $active={active} aria-hidden>
                                {iconGlyph}
                              </StyledNavLinkIcon>
                            ) : null}
                            <StyledNavLinkLabel>{t(tab.label)}</StyledNavLinkLabel>
                          </StyledNavLink>
                        </StyledNavItem>
                      );
                    })}
                  </StyledNavList>
                </StyledGroupContent>
              </StyledGroup>
            );
          })}
        </StyledSidebar>
        <StyledResizeHandle
          role="slider"
          aria-orientation="vertical"
          aria-label={t('settings.sidebar.resize')}
          aria-valuemin={sidebarMinWidth}
          aria-valuemax={sidebarMaxWidth}
          aria-valuenow={sidebarWidth}
          tabIndex={0}
          onMouseDown={handleResizeStart}
          onKeyDown={handleResizeKeyDown}
        />
      </StyledSidebarWrapper>
      <StyledContent>{children}</StyledContent>
    </StyledContainer>
  );
};

export default SettingsScreenWeb;
