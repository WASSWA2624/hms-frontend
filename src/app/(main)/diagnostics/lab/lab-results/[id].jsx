import { Redirect, useLocalSearchParams } from 'expo-router';

export default function LegacyLabResultsDetailRoute() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const normalizedId = String(id || '').trim();
  const href = normalizedId ? `/lab/results/${encodeURIComponent(normalizedId)}` : '/lab/results';

  return <Redirect href={href} />;
}
