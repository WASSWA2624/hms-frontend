import { Redirect, useLocalSearchParams } from 'expo-router';

export default function OpdFlowsDetailRoute() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const normalizedId = String(id || '').trim();
  const href = normalizedId
    ? `/clinical?id=${encodeURIComponent(normalizedId)}`
    : '/clinical';

  return <Redirect href={href} />;
}
