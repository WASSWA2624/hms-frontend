import styled from 'styled-components';

const StyledContainer = styled.main.withConfig({
  displayName: 'PatientsScreen_StyledContainer',
  componentId: 'PatientsScreen_StyledContainer',
})`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  min-width: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: ${({ theme }) => theme?.colors?.background?.primary || '#FFFFFF'};
`;

const StyledContent = styled.div.withConfig({
  displayName: 'PatientsScreen_StyledContent',
  componentId: 'PatientsScreen_StyledContent',
})`
  flex: 1;
  min-height: 0;
  width: 100%;
  max-width: 1240px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
  padding: ${({ theme }) => theme?.spacing?.sm ?? 8}px ${({ theme }) => theme?.spacing?.md ?? 12}px
    ${({ theme }) => theme?.spacing?.lg ?? 16}px;
  gap: ${({ theme }) => theme?.spacing?.lg ?? 16}px;
`;

export { StyledContainer, StyledContent };
