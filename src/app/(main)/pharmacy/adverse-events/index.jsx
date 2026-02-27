import { Redirect } from 'expo-router';

export default function LegacyRoute() {
  return <Redirect href="/pharmacy?resource=adverse-events" />;
}
