import { useRouter } from 'expo-router';
import { Button, Card, Text } from '@platform/components';
import { useI18n } from '@hooks';

export default function BillingPricingRulesIndexRoute() {
  const { t } = useI18n();
  const router = useRouter();

  return (
    <Card
      variant="outlined"
      accessibilityLabel={t('billing.unavailable.pricingRules.title')}
      testID="billing-pricing-rules-unavailable"
    >
      <Text variant="h3" accessibilityRole="header">
        {t('billing.unavailable.pricingRules.title')}
      </Text>
      <Text variant="body">{t('billing.unavailable.pricingRules.description')}</Text>
      <Text variant="caption">{t('billing.unavailable.pricingRules.details')}</Text>
      <Button
        variant="surface"
        size="small"
        onPress={() => router.replace('/billing')}
        accessibilityLabel={t('billing.unavailable.backToBilling')}
        accessibilityHint={t('billing.unavailable.backToBillingHint')}
      >
        {t('billing.unavailable.backToBilling')}
      </Button>
    </Card>
  );
}
