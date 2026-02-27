import { Redirect, useLocalSearchParams } from 'expo-router';

export default function LegacyLabQcLogsDetailRoute() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const normalizedId = String(id || '').trim();
  const href = normalizedId ? `/lab/qc-logs/${encodeURIComponent(normalizedId)}` : '/lab/qc-logs';

  return <Redirect href={href} />;
}
