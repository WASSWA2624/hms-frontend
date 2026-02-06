/**
 * LanguageControls Component - iOS
 * Flag button that opens language list
 */
import React, { useCallback, useState } from 'react';
import { Modal, Text, View } from 'react-native';
import { useI18n } from '@hooks';
import useLanguageControls from './useLanguageControls';
import { LOCALE_FLAGS } from './types';
import {
  StyledLanguageControls,
  StyledFlagTrigger,
  StyledLanguageItem,
  StyledLanguageItemFlag,
  StyledModalOverlay,
  StyledModalContent,
} from './LanguageControls.ios.styles';

const LanguageControlsIOS = ({ testID, accessibilityLabel, accessibilityHint }) => {
  const { t } = useI18n();
  const { locale, options, setLocale } = useLanguageControls();
  const [visible, setVisible] = useState(false);

  const resolvedLabel = accessibilityLabel || t('settings.language.accessibilityLabel');
  const resolvedHint = accessibilityHint || t('settings.language.hint');
  const currentFlag = LOCALE_FLAGS[locale] || '🌐';

  const close = useCallback(() => setVisible(false), []);

  return (
    <StyledLanguageControls testID={testID}>
      <StyledFlagTrigger
        onPress={() => setVisible(true)}
        accessibilityRole="button"
        accessibilityLabel={resolvedLabel}
        accessibilityHint={resolvedHint}
      >
        <Text style={{ fontSize: 18 }}>{currentFlag}</Text>
      </StyledFlagTrigger>
      <Modal visible={visible} transparent animationType="fade">
        <View style={{ flex: 1 }}>
          <StyledModalOverlay onPress={close} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
          <View style={{ flex: 1, justifyContent: 'center', padding: 24, pointerEvents: 'box-none' }}>
            <StyledModalContent>
              {options.map((opt) => (
                <StyledLanguageItem
                  key={opt.value}
                  onPress={() => {
                    setLocale(opt.value);
                    close();
                  }}
                >
                  <StyledLanguageItemFlag>{LOCALE_FLAGS[opt.value] || '🌐'}</StyledLanguageItemFlag>
                  <Text>{opt.label}</Text>
                </StyledLanguageItem>
              ))}
            </StyledModalContent>
          </View>
        </View>
      </Modal>
    </StyledLanguageControls>
  );
};

export default LanguageControlsIOS;
