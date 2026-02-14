import { useRouter } from 'expo-router';
import { Button, Card, Text } from '@platform/components';
import { useI18n } from '@hooks';

export default function BillingCoveragePlansIndexRoute() {
  const { t } = useI18n();
  const router = useRouter();

  return (
    <Card
      variant="outlined"
      accessibilityLabel={t('billing.unavailable.coveragePlans.title')}
      testID="billing-coverage-plans-unavailable"
    >
      <Text variant="h3" accessibilityRole="header">
        {t('billing.unavailable.coveragePlans.title')}
      </Text>
      <Text variant="body">{t('billing.unavailable.coveragePlans.description')}</Text>
      <Text variant="caption">{t('billing.unavailable.coveragePlans.details')}</Text>
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
