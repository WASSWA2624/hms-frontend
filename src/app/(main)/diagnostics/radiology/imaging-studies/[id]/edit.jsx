import { Redirect, useLocalSearchParams } from 'expo-router';

export default function LegacyImagingStudiesEditRoute() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const normalizedId = String(id || '').trim();
  const href = normalizedId
    ? `/radiology?resource=imaging-studies&legacyId=${encodeURIComponent(normalizedId)}&action=edit`
    : '/radiology';

  return <Redirect href={href} />;
}
