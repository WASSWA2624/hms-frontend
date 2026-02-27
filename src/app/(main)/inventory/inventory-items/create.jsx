import { Redirect } from 'expo-router';

export default function LegacyRoute() {
  return <Redirect href="/inventory?panel=inventory&resource=inventory-items&action=create" />;
}
