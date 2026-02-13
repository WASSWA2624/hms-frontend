/**
 * Returns the CRUD hook state for the selected clinical resource.
 */
import { useMemo } from 'react';
import {
  useCarePlan,
  useClinicalNote,
  useDiagnosis,
  useEncounter,
  useFollowUp,
  useProcedure,
  useReferral,
  useVitalSign,
} from '@hooks';
import { CLINICAL_RESOURCE_IDS } from './ClinicalResourceConfigs';

const useClinicalResourceCrud = (resourceId) => {
  const encounter = useEncounter();
  const clinicalNote = useClinicalNote();
  const diagnosis = useDiagnosis();
  const procedure = useProcedure();
  const vitalSign = useVitalSign();
  const carePlan = useCarePlan();
  const referral = useReferral();
  const followUp = useFollowUp();

  return useMemo(() => {
    const map = {
      [CLINICAL_RESOURCE_IDS.ENCOUNTERS]: encounter,
      [CLINICAL_RESOURCE_IDS.CLINICAL_NOTES]: clinicalNote,
      [CLINICAL_RESOURCE_IDS.DIAGNOSES]: diagnosis,
      [CLINICAL_RESOURCE_IDS.PROCEDURES]: procedure,
      [CLINICAL_RESOURCE_IDS.VITAL_SIGNS]: vitalSign,
      [CLINICAL_RESOURCE_IDS.CARE_PLANS]: carePlan,
      [CLINICAL_RESOURCE_IDS.REFERRALS]: referral,
      [CLINICAL_RESOURCE_IDS.FOLLOW_UPS]: followUp,
    };
    return map[resourceId] || encounter;
  }, [
    resourceId,
    encounter,
    clinicalNote,
    diagnosis,
    procedure,
    vitalSign,
    carePlan,
    referral,
    followUp,
  ]);
};

export default useClinicalResourceCrud;
