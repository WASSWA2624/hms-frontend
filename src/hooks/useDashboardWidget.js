/**
 * useDashboardWidget Hook
 * File: useDashboardWidget.js
 */
import useCrud from '@hooks/useCrud';
import {
  listDashboardWidgets,
  getDashboardWidget,
  createDashboardWidget,
  updateDashboardWidget,
  deleteDashboardWidget
} from '@features/dashboard-widget';

const useDashboardWidget = () =>
  useCrud({
    list: listDashboardWidgets,
    get: getDashboardWidget,
    create: createDashboardWidget,
    update: updateDashboardWidget,
    remove: deleteDashboardWidget,
  });

export default useDashboardWidget;
