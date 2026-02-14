import { useRouter } from 'expo-router';
import { Button, Card, Text } from '@platform/components';
import { useI18n } from '@hooks';

export default function BillingCoveragePlansCreateRoute() {
  const { t } = useI18n();
  const router = useRouter();

  return (
    <Card
      variant="outlined"
      accessibilityLabel={t('billing.unavailable.coveragePlans.title')}
      testID="billing-coverage-plans-create-unavailable"
    >
      <Text variant="h3" accessibilityRole="header">
        {t('billing.unavailable.coveragePlans.createBlockedTitle')}
      </Text>
      <Text variant="body">{t('billing.unavailable.coveragePlans.createBlockedDescription')}</Text>
      <Button
        variant="surface"
        size="small"
        onPress={() => router.replace('/billing/coverage-plans')}
        accessibilityLabel={t('billing.unavailable.backToCoveragePlans')}
        accessibilityHint={t('billing.unavailable.backToCoveragePlansHint')}
      >
        {t('billing.unavailable.backToCoveragePlans')}
      </Button>
    </Card>
  );
}
