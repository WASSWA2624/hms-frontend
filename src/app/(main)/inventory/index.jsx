import { Redirect } from 'expo-router';

export default function InventoryIndexRoute() {
  return <Redirect href="/pharmacy?panel=inventory" />;
}
