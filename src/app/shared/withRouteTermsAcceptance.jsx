/**
 * Route Terms Acceptance Wrapper
 * Adds terms acceptance controls to individual auth/onboarding routes.
 */
import React from 'react';
import { useRouter } from 'expo-router';
import { useI18n } from '@hooks';
import { Button, Checkbox, Container, Stack } from '@platform/components';

function RouteTermsAcceptance({ screenKey = 'route-screen' }) {
  const { t } = useI18n();
  const router = useRouter();
  const [checked, setChecked] = React.useState(false);

  const handleOpenTerms = React.useCallback(() => {
    router.push('/terms');
  }, [router]);

  return (
    <Container size="medium" testID={`${screenKey}-terms-acceptance`}>
      <Stack spacing="xs">
        <Checkbox
          checked={checked}
          onChange={(nextChecked) => setChecked(Boolean(nextChecked))}
          label={t('auth.layout.termsAcceptance.label')}
          accessibilityHint={t('auth.layout.termsAcceptance.hint')}
          testID={`${screenKey}-terms-checkbox`}
        />
        <Button
          variant="text"
          size="small"
          onPress={handleOpenTerms}
          accessibilityLabel={t('auth.layout.termsAcceptance.openTerms')}
          accessibilityHint={t('auth.layout.termsAcceptance.openTermsHint')}
          testID={`${screenKey}-terms-link`}
        >
          {t('auth.layout.termsAcceptance.openTerms')}
        </Button>
      </Stack>
    </Container>
  );
}

const withRouteTermsAcceptance = (ScreenComponent, options = {}) => {
  const fallbackName = ScreenComponent?.displayName || ScreenComponent?.name || 'Screen';
  const screenKey = options?.screenKey || String(fallbackName).toLowerCase();

  const RouteWithTermsAcceptance = (props) => (
    <>
      <ScreenComponent {...props} />
      <RouteTermsAcceptance screenKey={screenKey} />
    </>
  );

  RouteWithTermsAcceptance.displayName = `WithRouteTermsAcceptance(${fallbackName})`;

  return RouteWithTermsAcceptance;
};

export default withRouteTermsAcceptance;
