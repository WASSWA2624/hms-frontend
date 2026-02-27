import { Redirect, useLocalSearchParams } from 'expo-router';

export default function LegacyLabTestsDetailRoute() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const normalizedId = String(id || '').trim();
  const href = normalizedId ? `/lab/tests/${encodeURIComponent(normalizedId)}` : '/lab/tests';

  return <Redirect href={href} />;
}
