/**
 * useGeneralSettingsPanel Hook
 * Shared state and handlers for GeneralSettingsPanel across platforms.
 */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectFooterVisible } from '@store/selectors';
import { actions as uiActions } from '@store/slices/ui.slice';

const useGeneralSettingsPanel = () => {
  const dispatch = useDispatch();
  const footerVisible = useSelector(selectFooterVisible);

  const onFooterVisibleChange = useCallback(
    (value) => {
      dispatch(uiActions.setFooterVisible(value));
    },
    [dispatch]
  );

  return {
    footerVisible,
    onFooterVisibleChange,
  };
};

export default useGeneralSettingsPanel;
