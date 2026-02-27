import { Redirect } from 'expo-router';

export default function LegacyRadiologyTestsListRoute() {
  return <Redirect href="/radiology?resource=radiology-tests" />;
}
