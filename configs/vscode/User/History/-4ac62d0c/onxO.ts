import activeRoutesPage from '@pages/activeRoutesPage';
import { queryData } from '@fixtures/queryData';

describe('Verify Routes with data ', () => {
  beforeEach(() => {
    cy.log(`Given I get the testdata from DB to proceed with Cancel Route with data "NONIFTA" 
      division`);

    cy.fixture('divisions')
      .as('divisions')
      .then(divisions => {
        const divisionNumbers = divisions[Cypress.env('env')].NONIFTA_DIVISION;

        // cy.routesQuery('getRouteNoForCancelRouteWithData', { $division: divisionNumbers }).then(
        //   recordset => {
        //     cy.wrap(recordset).as('queryData');
        //   }
        // );
      });

    // example
    // cy.dbUtil_getDivisionNumber('NONIFTA_DIVISION')
    //   .as('divisionNumber')
    //   .createRoutes_getRouteNoForCancelRouteWithData()
    //   .dbUtil_generateDBQueryDate();
  });

  it(
    'are cancelled',
    { tags: ['@TC_CancelRouteWithData', '@regressionTest', '@regression'] },
    () => {
      cy.nav('cpRoutes', '690');

      // And I select the "queried" date in create print route
      cy.get('#filter-container input').click({ force: true });

      cy.generateDBQueryDate('16').then(date => {
        debugger;
      });
      // cy.createRoute_generateDBQueryDate('queried', this.queryData).then(() => {
      //   cy.log('Date is selected');
      //   cy.wait(3000);
      //   // And I select "queried" route for cancel
      //   activeRoutesPage.selectRouteUpdated('queried');

      //   // And I click "Cancel Routes" button
      //   cy.contains('button', 'Cancel Routes').last().click();

      //   // And I enter the Reason for cancel created routes section "Bad"
      //   cy.xpath('//input[@id="reason"]').clear();
      //   cy.xpath('//input[@id="reason"]').type('Bad');

      //   // And I click "OK" button
      //   cy.contains('button', 'OK').last().click();

      //   // And I wait for few seconds "5000"
      //   cy.wait(5000);

      //   // Then Verify Warning message is displayed
      //   // TODO //expect( createRoutesPage.warningMessageForCancelRouteWithData().should('be.enabled')).to.equal(true);

      //   // And I click "OK" button
      //   cy.contains('button', 'OK').last().click();
      // });
    }
  );
});
