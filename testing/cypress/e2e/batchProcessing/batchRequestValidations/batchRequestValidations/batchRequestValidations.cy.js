/**
 * @module BatchRquestValidations
 * 
 * @description
 * Validations for all modals in "New Batch Request" tab.
 * Bundled in a single file since they behave very similarly and seperated from the individual batch testing.
 * The UI features that this spec file includes:
 *    - Validations
 *    - Cancel Buttons
 */

import selectors from "../../support/selectors";
const batchProcessingSelectors = selectors.batchProcessing

describe('Batch Request Validations', () => {
  const batch_test_student = Cypress.env('batch_test_student')
})