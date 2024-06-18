import homePage from '@pages/homePage';

describe('Home Page of RISE and Fleet - VCR DAILY SUMMARY button validate', () => {
  beforeEach(() => {
    cy.fixture('queryData').as('queryData');
    cy.getRoutesQuery('getRouteTestDataLC').as('getRouteTestDataSCQuery');

    cy.fixture('divisions').as('divisions');
    cy.visit(`/operations?networkId=automation&token=${Cypress.env('secrets').riseToken}`);
  });

  it(
    `Scenario: Verify VCR DAILY SUMMARY button is visible in home page`,
    { tags: ['@regression', '@HomePage', '@TC_VCR_DAILY_SUMMARY'] },
    function () {
      this.getRouteTestDataSCQuery = this.getRouteTestDataSCQuery.replace(
        '$division',
        this.divisions[Cypress.env('env')].ORACLE_DIVISION
      );
      const queryData = this.queryData;

      cy.dbUtil_executeSQLQuery(this.getRouteTestDataSCQuery).then(results => {
        queryData.infoProdivision = results[0];

        cy.log('When I click "Home" page in sidebar');
        homePage.clickPageInSideBar('Home');

        cy.log('Clicked Home page in Sidebar');
        cy.get('body').click(0, 0);

        cy.log('And I am on the Home Page');
        homePage.waitForHomePageLoaded();

        cy.log(`And I select division ${queryData.infoProdivisio}`);
        const divisionNumber = queryData.infoProdivision;

        cy.get('.p-dropdown-label').click();
        cy.get('input.p-dropdown-filter').type(divisionNumber);
        cy.intercept('GET', `**routes/v2/divisions/${divisionNumber}/routes/lob-descriptions`).as(
          `getRoutesForDivision${divisionNumber}`
        );
        cy.get(`[role="option"][aria-label=${divisionNumber}]`).click();
        cy.wait(`@getRoutesForDivision${divisionNumber}`);

        cy.log('Then I verify VCR DAILY SUMMARY button is there in RISE home page');
        homePage.getVcrDailySummaryButton().should('be.visible');

        cy.log('And I go to Fleet page');
        cy.nav('fleet');
        cy.intercept('GET', '**routes/v2/divisions/all/get-fleet-notes').as('getFleetNotes');
        cy.wait('@getFleetNotes');

        cy.log('Then I verify VCR DAILY SUMMARY button is there in Fleet home page');
        homePage.getVcrDailySummaryButton().should('be.visible');
      });
    }
  );
});
