/**
 * Public Terms Route
 * Shared legal terms page for auth and onboarding flows.
 */
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useI18n } from '@hooks';
import { Button, Text } from '@platform/components';

const TERMS_SECTION_KEYS = [
  'introduction',
  'eligibility',
  'use',
  'healthcareCompliance',
  'privacy',
  'crossBorderData',
  'account',
  'feesBilling',
  'intellectualProperty',
  'serviceAvailability',
  'liability',
  'termination',
  'governingLaw',
  'changes',
  'contact',
];

export default function PublicTermsRoute() {
  const { t } = useI18n();
  const router = useRouter();

  const handleBack = () => {
    if (typeof router?.canGoBack === 'function' && router.canGoBack() && typeof router?.back === 'function') {
      router.back();
      return;
    }
    if (typeof router?.replace === 'function') {
      router.replace('/landing');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      testID="terms-route-scroll"
    >
      <View style={styles.backAction}>
        <Button
          variant="surface"
          size="small"
          onPress={handleBack}
          accessibilityLabel={t('common.back')}
          accessibilityHint={t('terms.backHint')}
          testID="terms-route-back"
        >
          {t('common.back')}
        </Button>
      </View>

      <View style={styles.meta}>
        <Text variant="caption" color="text.secondary">
          {t('terms.lastUpdated')}
        </Text>
      </View>

      {TERMS_SECTION_KEYS.map((key) => (
        <View key={key} style={styles.section}>
          <Text variant="h3">{t(`terms.sections.${key}.title`)}</Text>
          <Text variant="body" color="text.secondary">
            {t(`terms.sections.${key}.body`)}
          </Text>
        </View>
      ))}

      <View style={styles.confirmAction}>
        <Button
          variant="primary"
          size="small"
          onPress={handleBack}
          accessibilityLabel={t('terms.actions.confirmRead')}
          accessibilityHint={t('terms.actions.confirmReadHint')}
          testID="terms-route-confirm-read"
        >
          {t('terms.actions.confirmRead')}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
    paddingBottom: 16,
  },
  backAction: {
    alignItems: 'flex-start',
  },
  meta: {
    marginTop: 4,
  },
  section: {
    gap: 6,
  },
  confirmAction: {
    marginTop: 8,
    paddingBottom: 4,
  },
});
