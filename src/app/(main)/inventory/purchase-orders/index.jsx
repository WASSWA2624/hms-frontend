import { Redirect } from 'expo-router';

export default function LegacyRoute() {
  return <Redirect href="/pharmacy?panel=inventory&resource=purchase-orders" />;
}
