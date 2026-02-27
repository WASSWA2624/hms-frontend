import { Redirect } from 'expo-router';

export default function LegacyRadiologyResultsCreateRoute() {
  return <Redirect href="/radiology?resource=radiology-results&action=create" />;
}
