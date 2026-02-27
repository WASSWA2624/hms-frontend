import { Redirect, useLocalSearchParams } from 'expo-router';

export default function LegacyLabSamplesEditRoute() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const normalizedId = String(id || '').trim();
  const href = normalizedId ? `/lab/samples/${encodeURIComponent(normalizedId)}/edit` : '/lab/samples';

  return <Redirect href={href} />;
}
