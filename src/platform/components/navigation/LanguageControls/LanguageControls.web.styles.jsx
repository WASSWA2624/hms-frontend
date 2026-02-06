/**
 * LanguageControls Styles - Web
 * Flag button + dropdown with languages
 * File: LanguageControls.web.styles.jsx
 */
import styled from 'styled-components';

const StyledLanguageControls = styled.div.withConfig({
  displayName: 'StyledLanguageControls',
  componentId: 'StyledLanguageControls',
})`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const StyledFlagTrigger = styled.button.withConfig({
  displayName: 'StyledFlagTrigger',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 28px;
  padding: 0 6px;
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: transparent;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;

  & img {
    display: block;
    width: 24px;
    height: 18px;
    object-fit: cover;
    border-radius: 2px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border-color: ${({ theme }) => theme.colors.background.tertiary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const StyledLanguageMenu = styled.div.withConfig({
  displayName: 'StyledLanguageMenu',
})`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  min-width: 160px;
  padding: 4px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.radius.md}px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: langMenuSlide 0.2s ease-out;

  @keyframes langMenuSlide {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const StyledLanguageItem = styled.button.withConfig({
  displayName: 'StyledLanguageItem',
})`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background: transparent;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -2px;
  }
`;

const StyledLanguageItemFlag = styled.span.withConfig({
  displayName: 'StyledLanguageItemFlag',
})`
  flex-shrink: 0;
  line-height: 1;

  & img {
    display: block;
    width: 24px;
    height: 18px;
    object-fit: cover;
    border-radius: 2px;
  }
`;

export { StyledLanguageControls, StyledFlagTrigger, StyledLanguageMenu, StyledLanguageItem, StyledLanguageItemFlag };
