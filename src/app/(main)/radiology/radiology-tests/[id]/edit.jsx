import { Redirect, useLocalSearchParams } from 'expo-router';

export default function RadiologyRadiologyTestsEditRoute() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const normalizedId = String(id || '').trim();
  const href = normalizedId
    ? `/radiology?resource=radiology-tests&legacyId=${encodeURIComponent(normalizedId)}&action=edit`
    : '/radiology';

  return <Redirect href={href} />;
}
