/**
 * useMainLayout Hook
 * Shared slot visibility logic for MainLayout
 * File: useMainLayout.js
 */

import { useMemo } from 'react';

/**
 * @param {Object} props - MainLayout props
 * @param {React.ReactNode} props.header
 * @param {React.ReactNode} props.footer
 * @param {React.ReactNode} props.sidebar
 * @param {React.ReactNode} props.breadcrumbs
 * @returns {{ hasHeader: boolean, hasFooter: boolean, hasSidebar: boolean, hasBreadcrumbs: boolean }}
 */
const useMainLayout = ({ header, footer, sidebar, breadcrumbs }) => {
  return useMemo(
    () => ({
      hasHeader: Boolean(header),
      hasFooter: Boolean(footer),
      hasSidebar: Boolean(sidebar),
      hasBreadcrumbs: Boolean(breadcrumbs),
    }),
    [breadcrumbs, footer, header, sidebar]
  );
};

export default useMainLayout;
