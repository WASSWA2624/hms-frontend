import { Redirect } from 'expo-router';

export default function LegacyRadiologyResultsListRoute() {
  return <Redirect href="/radiology?resource=radiology-results" />;
}
