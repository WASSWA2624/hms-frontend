import { Redirect, useLocalSearchParams } from 'expo-router';

export default function LegacyRoute() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const normalizedId = String(id || '').trim();
  const href = normalizedId
    ? `/pharmacy?resource=formulary-items&legacyId=${encodeURIComponent(normalizedId)}&action=edit`
    : '/pharmacy';

  return <Redirect href={href} />;
}
