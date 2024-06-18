import homePage from '@pages/homePage';

describe('Portal Enhancements & Automation - Home Page', () => {
  beforeEach(() => {
    cy.visit(`/operations?networkId=automation&token=${Cypress.env('secrets').riseToken}`);
    homePage.sideBar().should('be.visible');
  });

  it(`Ability to Delete Submitted Items`, () => {
    // When I select "CREATEROUTE" division
    homePage.selectDivision('CREATEROUTE');

    // And I click "ROUTE FULL CRC NOTIFICATION" button
    cy.intercept(
      'GET',
      /routes-services-v2\..*\.awsext\.repsrv\.com\/routes\/v2\/divisions\/176\/routes\/lob-descriptions/i
    ).as('getRoutes');
    homePage.clickButton('ROUTE FULL CRC NOTIFICATION').then(() => {
      cy.wait('@getRoutes', { timeout: 5000 });
    });

    // And I create a CRC blocker
    homePage.createCRCBlocker();
    cy.wait('@getRoutes', { timeout: 5000 });
    homePage.popUpMessage().should('have.text', 'Route full notification has been updated.');
    homePage.popUpMessage().should('not.exist');

    // And I see the new blocker created
    cy.get('.table-no-records-found').should('not.exist');
    cy.get('p-tablecheckbox').should('exist');

    // Then I should be able to delete that blocker
    cy.intercept(
      'GET',
      /.*routes-services-v2\..*\.awsext\.repsrv\.com\/routes\/v2\/divisions.*/
    ).as('getRoutes');
    homePage.deleteCRCBlocker();
    cy.wait(['@getRoutes'], { timeout: 10000 });
    homePage.popUpMessage().contains('Records deleted successfully').should('exist');
  });
});
