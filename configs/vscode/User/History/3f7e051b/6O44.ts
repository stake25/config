// / <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// no imports are allowed in typescript if you declare a namespace here
// in this repo we have moved the namespace to a file called index.d.ts within the support folder
// see: https://stackoverflow.com/questions/59728371/typescript-d-ts-file-not-recognized/59728984#59728984

/**
 * Custom command to get elements by data-cy attribute
 * @param {any} selector - the data-cy attribute value
 * @param {any} options? - the options to pass to cy.get
 * @returns {any} - the element
 */
Cypress.Commands.add('getCy', (selector: string, options?) => {
  if (options) {
    return cy.get(`[data-cy='${selector}']`, options);
  }

  return cy.get(`[data-cy='${selector}']`);
});

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');

  cy.getCy('username-label').type(`${email}`);
  cy.getCy('password-label').type(password);
  cy.getCy('login-button').click();

  cy.getCy('nav').contains('Logout');
});

Cypress.Commands.add('logout', () => {
  cy.visit('/login?logout');
});

Cypress.Commands.add('createUser', (name: string, username: string, password: string) => {
  cy.visit('/manage');

  cy.getCy('name-label').type(name);
  cy.getCy('username-label').type(username);
  cy.getCy('password-label').type(password);

  cy.getCy('create-account-button').click();
});

Cypress.Commands.add('createNotesBtn', (title: string, body: string) => {
  cy.getCy('new-note-button').click();
  if (title) {
    cy.getCy('title-input').type(title);
  }
  if (body) {
    cy.getCy('body-textarea').type(body);
  }
  cy.getCy('save-button').click();
});
