export {}; // This file needs to be a module

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      login(): Chainable<void>;
      doesExist(selector: string): Chainable<boolean>;
      shouldHaveData(selector: string, expectedRowNum?: number): Chainable<void>;
      selectDropdown(selector: string, text: string, forceFlag?: boolean): Chainable<void>;
      selectAutoselect(selector: string, text: string): Chainable<void>;
    }
  }
}