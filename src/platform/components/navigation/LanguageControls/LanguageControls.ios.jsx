/**
 * LanguageControls Component - iOS
 * Flag button that opens language list
 */
import React, { useCallback, useState } from 'react';
import { Modal, Text } from 'react-native';
import { useI18n } from '@hooks';
import useLanguageControls from './useLanguageControls';
import { LOCALE_FLAGS } from './types';
import {
  StyledFlagGlyph,
  StyledFlagTrigger,
  StyledLanguageControls,
  StyledLanguageItem,
  StyledLanguageItemFlag,
  StyledModalContent,
  StyledModalOverlay,
  StyledModalRoot,
  StyledModalStage,
} from './LanguageControls.ios.styles';

const LanguageControlsIOS = ({ testID, accessibilityLabel, accessibilityHint }) => {
  const { t } = useI18n();
  const { locale, options, setLocale } = useLanguageControls();
  const [visible, setVisible] = useState(false);

  const resolvedLabel = accessibilityLabel || t('settings.language.accessibilityLabel');
  const resolvedHint = accessibilityHint || t('settings.language.hint');
  const currentFlag = LOCALE_FLAGS[locale] || '\u{1F310}';

  const close = useCallback(() => setVisible(false), []);

  return (
    <StyledLanguageControls testID={testID}>
      <StyledFlagTrigger
        onPress={() => setVisible(true)}
        accessibilityRole="button"
        accessibilityLabel={resolvedLabel}
        accessibilityHint={resolvedHint}
      >
        <StyledFlagGlyph>{currentFlag}</StyledFlagGlyph>
      </StyledFlagTrigger>
      <Modal visible={visible} transparent animationType="fade">
        <StyledModalRoot>
          <StyledModalOverlay onPress={close} />
          <StyledModalStage>
            <StyledModalContent>
              {options.map((opt) => (
                <StyledLanguageItem
                  key={opt.value}
                  onPress={() => {
                    setLocale(opt.value);
                    close();
                  }}
                >
                  <StyledLanguageItemFlag>{LOCALE_FLAGS[opt.value] || '\u{1F310}'}</StyledLanguageItemFlag>
                  <Text>{opt.label}</Text>
                </StyledLanguageItem>
              ))}
            </StyledModalContent>
          </StyledModalStage>
        </StyledModalRoot>
      </Modal>
    </StyledLanguageControls>
  );
};

export default LanguageControlsIOS;
