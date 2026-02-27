import { Redirect } from 'expo-router';

export default function LegacyRadiologyOrdersListRoute() {
  return <Redirect href="/radiology?resource=radiology-orders" />;
}
