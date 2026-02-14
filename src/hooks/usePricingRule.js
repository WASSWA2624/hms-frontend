/**
 * usePricingRule Hook
 * File: usePricingRule.js
 */
import useCrud from '@hooks/useCrud';
import {
  listPricingRules,
  getPricingRule,
  createPricingRule,
  updatePricingRule,
  deletePricingRule
} from '@features/pricing-rule';

const usePricingRule = () =>
  useCrud({
    list: listPricingRules,
    get: getPricingRule,
    create: createPricingRule,
    update: updatePricingRule,
    remove: deletePricingRule,
  });

export default usePricingRule;
