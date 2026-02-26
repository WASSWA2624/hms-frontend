/**
 * useClinicalTerm Hook
 * File: useClinicalTerm.js
 */
import useCrud from '@hooks/useCrud';
import {
  createClinicalTermFavorite,
  deleteClinicalTermFavorite,
  getClinicalTermSuggestions,
  listClinicalTermFavorites,
} from '@features/clinical-term';

const useClinicalTerm = () =>
  useCrud({
    suggestions: getClinicalTermSuggestions,
    listFavorites: listClinicalTermFavorites,
    createFavorite: createClinicalTermFavorite,
    deleteFavorite: deleteClinicalTermFavorite,
  });

export default useClinicalTerm;
