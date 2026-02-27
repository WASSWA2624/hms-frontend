import { Redirect, useLocalSearchParams } from 'expo-router';

export default function LegacyLabTestsEditRoute() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const normalizedId = String(id || '').trim();
  const href = normalizedId ? `/lab/tests/${encodeURIComponent(normalizedId)}/edit` : '/lab/tests';

  return <Redirect href={href} />;
}
