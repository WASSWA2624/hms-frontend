import { THEATRE_WORKBENCH_V1 } from '@config/feature.flags';
import {
  ClinicalOverviewScreen,
  TheatreWorkbenchScreen,
} from '@platform/screens';

export default function TheatreIndexRoute() {
  if (THEATRE_WORKBENCH_V1) {
    return <TheatreWorkbenchScreen />;
  }

  return <ClinicalOverviewScreen scope="theatre" />;
}
