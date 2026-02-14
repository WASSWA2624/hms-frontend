/**
 * Returns the CRUD hook state for the selected clinical resource.
 */
import { useMemo } from 'react';
import {
  useAdmission,
  useAnesthesiaRecord,
  useAmbulance,
  useAmbulanceDispatch,
  useAmbulanceTrip,
  useBedAssignment,
  useCarePlan,
  useCriticalAlert,
  useClinicalNote,
  useDischargeSummary,
  useDiagnosis,
  useEmergencyCase,
  useEmergencyResponse,
  useEncounter,
  useFollowUp,
  useIcuObservation,
  useIcuStay,
  useMedicationAdministration,
  useNursingNote,
  usePostOpNote,
  useProcedure,
  useReferral,
  useTheatreCase,
  useTransferRequest,
  useTriageAssessment,
  useVitalSign,
  useWardRound,
} from '@hooks';
import { CLINICAL_RESOURCE_IDS } from './ClinicalResourceConfigs';

const useClinicalResourceCrud = (resourceId) => {
  const admission = useAdmission();
  const bedAssignment = useBedAssignment();
  const wardRound = useWardRound();
  const nursingNote = useNursingNote();
  const medicationAdministration = useMedicationAdministration();
  const dischargeSummary = useDischargeSummary();
  const transferRequest = useTransferRequest();
  const icuStay = useIcuStay();
  const icuObservation = useIcuObservation();
  const criticalAlert = useCriticalAlert();
  const theatreCase = useTheatreCase();
  const anesthesiaRecord = useAnesthesiaRecord();
  const postOpNote = usePostOpNote();
  const emergencyCase = useEmergencyCase();
  const triageAssessment = useTriageAssessment();
  const emergencyResponse = useEmergencyResponse();
  const ambulance = useAmbulance();
  const ambulanceDispatch = useAmbulanceDispatch();
  const ambulanceTrip = useAmbulanceTrip();
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
      [CLINICAL_RESOURCE_IDS.ADMISSIONS]: admission,
      [CLINICAL_RESOURCE_IDS.BED_ASSIGNMENTS]: bedAssignment,
      [CLINICAL_RESOURCE_IDS.WARD_ROUNDS]: wardRound,
      [CLINICAL_RESOURCE_IDS.NURSING_NOTES]: nursingNote,
      [CLINICAL_RESOURCE_IDS.MEDICATION_ADMINISTRATIONS]: medicationAdministration,
      [CLINICAL_RESOURCE_IDS.DISCHARGE_SUMMARIES]: dischargeSummary,
      [CLINICAL_RESOURCE_IDS.TRANSFER_REQUESTS]: transferRequest,
      [CLINICAL_RESOURCE_IDS.ICU_STAYS]: icuStay,
      [CLINICAL_RESOURCE_IDS.ICU_OBSERVATIONS]: icuObservation,
      [CLINICAL_RESOURCE_IDS.CRITICAL_ALERTS]: criticalAlert,
      [CLINICAL_RESOURCE_IDS.THEATRE_CASES]: theatreCase,
      [CLINICAL_RESOURCE_IDS.ANESTHESIA_RECORDS]: anesthesiaRecord,
      [CLINICAL_RESOURCE_IDS.POST_OP_NOTES]: postOpNote,
      [CLINICAL_RESOURCE_IDS.EMERGENCY_CASES]: emergencyCase,
      [CLINICAL_RESOURCE_IDS.TRIAGE_ASSESSMENTS]: triageAssessment,
      [CLINICAL_RESOURCE_IDS.EMERGENCY_RESPONSES]: emergencyResponse,
      [CLINICAL_RESOURCE_IDS.AMBULANCES]: ambulance,
      [CLINICAL_RESOURCE_IDS.AMBULANCE_DISPATCHES]: ambulanceDispatch,
      [CLINICAL_RESOURCE_IDS.AMBULANCE_TRIPS]: ambulanceTrip,
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
    admission,
    bedAssignment,
    wardRound,
    nursingNote,
    medicationAdministration,
    dischargeSummary,
    transferRequest,
    icuStay,
    icuObservation,
    criticalAlert,
    theatreCase,
    anesthesiaRecord,
    postOpNote,
    emergencyCase,
    triageAssessment,
    emergencyResponse,
    ambulance,
    ambulanceDispatch,
    ambulanceTrip,
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
