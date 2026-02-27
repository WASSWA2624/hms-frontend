import { Redirect } from 'expo-router';

export default function LegacyRoute() {
  return <Redirect href="/pharmacy?resource=pharmacy-order-items&action=create" />;
}
