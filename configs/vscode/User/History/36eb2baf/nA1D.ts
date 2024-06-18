/* eslint-disable no-unused-vars */
// cypress/support/index.d.ts file
// extends Cypress assertion Chainer interface with
// the new assertion methods

declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): Chainable<any>;
    createUser(name: string, username: string, password: string): Chainable<any>;
    logout(): Chainable<any>;
    /**
     * Custom command to get elements by data-cy attribute
     * @param {any} selector - the data-cy attribute value
     * @param {any} options? - the options to pass to cy.get
     * @returns {any} - the element
     */
    getCy(selector: string, options?): Cypress.Chainable;
    createNotesBtn(title: string, body: string): Cypress.Chainable;
  }
}
