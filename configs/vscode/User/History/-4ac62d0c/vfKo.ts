import activeRoutesPage from '@pages/activeRoutesPage';
import { queryData } from '@fixtures/queryData';

describe('Verify Routes with data ', () => {
  before(() => {
    // get needed data for the test
    cy.fixture('divisions').as('divisions');
  });

  beforeEach(() => {
    // Given I get the testdata from DB to proceed with Cancel Route with data "NONIFTA" division
    cy.fixture('divisions').then((divisions) => {
      const divisionNumber = divisions[Cypress.env('env')].NONIFTA_DIVISION;

      cy.getRoutesQuery('getRouteNoForCancelRouteWithData').then((query) => {
        query = query.replace('$division', divisionNumber);
        cy.routesQuery(query).then((recordset) => {

        });
    });
    cy.dbUtil_getDivisionNumber('NONIFTA_DIVISION')
      .as('divisionNumber')
      .createRoutes_getRouteNoForCancelRouteWithData()
      .dbUtil_generateDBQueryDate();

    // And I refresh the page
    cy.reload();
  });

  it(
    'are cancelled',
    { tags: ['@TC_CancelRouteWithData', '@regressionTest', '@regression'] },
    function () {
      // When I select "queried" division
      cy.selectDivision(this.divisionNumber);

      // When I click "Create/Print Routes" page in sidebar
      cy.get('span.sidebar-text').contains('Create/Print Routes').click();

      // And I select the "queried" date in create print route
      cy.get('#filter-container input').click({ force: true });
      cy.createRoute_generateDBQueryDate('queried', queryData).then(() => {
        cy.log('Date is selected');
        cy.wait(3000);
        // And I select "queried" route for cancel
        activeRoutesPage.selectRouteUpdated('queried');

        // And I click "Cancel Routes" button
        cy.contains('button', 'Cancel Routes').last().click();

        // And I enter the Reason for cancel created routes section "Bad"
        cy.xpath('//input[@id="reason"]').clear();
        cy.xpath('//input[@id="reason"]').type('Bad');

        // And I click "OK" button
        cy.contains('button', 'OK').last().click();

        // And I wait for few seconds "5000"
        cy.wait(5000);

        // Then Verify Warning message is displayed
        // TODO //expect( createRoutesPage.warningMessageForCancelRouteWithData().should('be.enabled')).to.equal(true);

        // And I click "OK" button
        cy.contains('button', 'OK').last().click();
      });
    }
  );
});
