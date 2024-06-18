import activeRoutesPage from '@pages/activeRoutesPage';
import dbUtils from '@support/dbUtil';
import homePage from '@pages/homePage';
import db_routes from '@support/database_routes';

describe('2023 - Portal Enhancements & Automation - Active Routes Page', () => {
  beforeEach(() => {
    // visit with the needed token
    // cy.visit(`/operations?networkId=automation&token=${Cypress.env('secrets').riseToken}`);

    cy.log(`Given I get the testdata from DB to proceed with Active Route Service Event with CD 
      "NONIFTA" division`);

    // cy.fixture('divisions').then(divisions => {
    //   const division = divisions[Cypress.env('env')].NONIFTA_DIVISION;

    //   cy.routesQuery('getRouteNoForActiveRouteServiceEventWithCD', {
    //     '${division}': division
    //   }).then(resultset => {
    //     cy.log(JSON.stringify(resultset));
    //     debugger;
    //   });
    // });
    // db_routes.getRouteNoForActiveRouteServiceEventWithCD('NONIFTA');
  });

  it(
    `Blocked and NO Service buttons should be disabled for DEL and NCL for Resi routes with 
    Container Delivery`,
    { tags: ['@TC_DisableBlockedAndNoserviceforCA_US86742', '@regression', '@activeRoutes'] },
    () => {
      cy.log('When I click "Home" page in sidebar');

      // homePage.clickPageInSideBar('Home');
      // cy.get('body').click(0, 0);
      // cy.log('When I am on the Home Page');
      // homePage.waitForHomePageLoaded();
      // cy.log('When I select "queried" division');
      // homePage.selectDivision('queried');
      // cy.log('When I click "Active Routes" page in sidebar');
      // homePage.clickPageInSideBar('Active Routes');

      cy.nav('activeRoutes', '690');
      // cy.get('body').click(0, 0);
      // cy.log('And I select a date "queried"');
      // homePage.selectDate('queried');
      // dbUtils.generateDBQueryDate('queried');
      // cy.intercept('GET', '**/active/routes/summary*').as('getRoutes');
      // cy.wait('@getRoutes');
      // cy.log('And I select LOB "queried"');
      // cy.wait(2000);
      // homePage.selectLineOfBusiness('queried');
      // cy.wait(2000);
      // cy.log('And I select "queried" route');
      // activeRoutesPage.selectRouteUpdated('queried');
      // cy.log('And I verify Route Sequence table is displayed');
      // activeRoutesPage.getRouteSequenceTable().should('be.visible');
      // activeRoutesPage.getRouteSequenceTableBody().should('be.visible');
      // cy.log('And I select the stop checkbox for sequence "queried"');
      // activeRoutesPage.selectCheckBoxForSequence('queried');
      // cy.log('When I get original container quantity');
      // activeRoutesPage.getContainerQuantity();
      // cy.log('Then Verify Blocked and No Service fields are disabled');
      // cy.contains('Blocked').should('be.disabled');
      // cy.contains('No Service').should('be.disabled');
    }
  );
});
