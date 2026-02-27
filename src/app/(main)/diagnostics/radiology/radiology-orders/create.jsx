import { Redirect } from 'expo-router';

export default function LegacyRadiologyOrdersCreateRoute() {
  return <Redirect href="/radiology?resource=radiology-orders&action=create" />;
}
