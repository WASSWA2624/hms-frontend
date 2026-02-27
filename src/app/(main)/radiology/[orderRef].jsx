import { Redirect, useLocalSearchParams } from 'expo-router';

export default function RadiologyOrderRoute() {
  const params = useLocalSearchParams();
  const orderRef = Array.isArray(params?.orderRef) ? params.orderRef[0] : params?.orderRef;
  const id = String(orderRef || '').trim();
  if (!id) return <Redirect href="/radiology" />;
  return <Redirect href={`/radiology?id=${encodeURIComponent(id)}`} />;
}

