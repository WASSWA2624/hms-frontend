import { Redirect, useLocalSearchParams } from 'expo-router';

export default function LegacyRoute() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const normalizedId = String(id || '').trim();
  const href = normalizedId
    ? `/pharmacy?panel=inventory&resource=purchase-orders&legacyId=${encodeURIComponent(normalizedId)}`
    : '/pharmacy?panel=inventory';

  return <Redirect href={href} />;
}
