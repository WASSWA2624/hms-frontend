import { Redirect, useLocalSearchParams } from 'expo-router';

export default function LegacyLabOrderItemsDetailRoute() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const normalizedId = String(id || '').trim();
  const href = normalizedId ? `/lab/order-items/${encodeURIComponent(normalizedId)}` : '/lab/order-items';

  return <Redirect href={href} />;
}
