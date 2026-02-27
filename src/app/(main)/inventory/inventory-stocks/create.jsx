import { Redirect } from 'expo-router';

export default function LegacyRoute() {
  return <Redirect href="/inventory?panel=inventory&resource=inventory-stocks&action=create" />;
}
