import { useRouter } from 'expo-router';
import { Button, Card, Text } from '@platform/components';
import { useI18n } from '@hooks';

export default function BillingPricingRulesEditRoute() {
  const { t } = useI18n();
  const router = useRouter();

  return (
    <Card
      variant="outlined"
      accessibilityLabel={t('billing.unavailable.pricingRules.title')}
      testID="billing-pricing-rules-edit-unavailable"
    >
      <Text variant="h3" accessibilityRole="header">
        {t('billing.unavailable.pricingRules.editBlockedTitle')}
      </Text>
      <Text variant="body">{t('billing.unavailable.pricingRules.editBlockedDescription')}</Text>
      <Button
        variant="surface"
        size="small"
        onPress={() => router.replace('/billing/pricing-rules')}
        accessibilityLabel={t('billing.unavailable.backToPricingRules')}
        accessibilityHint={t('billing.unavailable.backToPricingRulesHint')}
      >
        {t('billing.unavailable.backToPricingRules')}
      </Button>
    </Card>
  );
}
