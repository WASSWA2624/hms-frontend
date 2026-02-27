import { Redirect, useLocalSearchParams } from 'expo-router';

export default function LegacyLabPanelsEditRoute() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const normalizedId = String(id || '').trim();
  const href = normalizedId ? `/lab/panels/${encodeURIComponent(normalizedId)}/edit` : '/lab/panels';

  return <Redirect href={href} />;
}
