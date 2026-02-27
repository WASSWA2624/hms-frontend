import { Redirect, useLocalSearchParams } from 'expo-router';

export default function LegacyLabOrdersEditRoute() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const normalizedId = String(id || '').trim();
  const href = normalizedId ? `/lab/orders/${encodeURIComponent(normalizedId)}/edit` : '/lab/orders';

  return <Redirect href={href} />;
}
