import homePage from '@pages/homePage';

describe('Home Page of RISE and Fleet - Download VCR validation', () => {
  beforeEach(() => {
    cy.fixture('queryData').as('queryData');
    cy.getRoutesQuery('getRouteTestDataLC').as('getRouteTestDataLCQuery');
    cy.fixture('divisions').as('divisions');
    cy.visit(`/operations?networkId=automation&token=${Cypress.env('secrets').riseToken}`);
  });

  it(
    `Scenario: Verify VCR report download functionality`,
    { tags: ['@regression', '@HomePage', '@TC_Download_VCR_Report'] },
    function () {
      this.getRouteTestDataLCQuery = this.getRouteTestDataLCQuery.replace(
        '$division',
        this.divisions[Cypress.env('env')].ORACLE_DIVISION
      );
      const queryData = this.queryData;

      cy.dbUtil_executeSQLQuery(this.getRouteTestDataLCQuery).then(results => {
        queryData.infoProdivision = results[0];

        cy.log('When I click "Home" page in sidebar');
        homePage.clickPageInSideBar('Home');

        cy.log('Clicked Home page in Sidebar');
        cy.get('body').click(0, 0);

        cy.log('And I am on the Home Page');
        homePage.waitForHomePageLoaded();

        cy.log(`And I select ORACLE division ${queryData.infoProdivision}`);
        const divisionNumber = queryData.infoProdivision;

        cy.get('.p-dropdown-label').click();
        cy.get('input.p-dropdown-filter').type(divisionNumber);
        cy.intercept('GET', `**routes/v2/divisions/${divisionNumber}/routes/lob-descriptions`).as(
          `getRoutesForDivision${divisionNumber}`
        );
        cy.get(`[role="option"][aria-label=${divisionNumber}]`).click();
        cy.wait(`@getRoutesForDivision${divisionNumber}`);

        cy.log('And I verify VCR DAILY SUMMARY button is there in RISE home page');
        homePage.getVcrDailySummaryButton().should('be.visible');

        cy.log('Then I click on VCR DAILY SUMMARY button');
        homePage.getVcrDailySummaryButton().click();

        cy.log('And I select current date from dialog');
        homePage.SelectCurrentDateFromCalendar();

        cy.log('And I select lob from dialog');
        homePage.SelectLobFromList();

        cy.log('And I click on Ok button to download vcr');
        homePage.getOkButtonFromDialog().click();

        cy.log('Then I verify network is successful');
        cy.intercept('GET', `**vehicles/v1/divisions/${divisionNumber}/vcr/issues/download**`).as(
          'downloadVcr'
        );
        cy.wait('@downloadVcr').should(xhr => {
          expect(xhr.response.statusCode).to.eq(200);
        });

        cy.log('Then I go to Fleet page');
        cy.nav('fleet');

        cy.log('And I verify VCR DAILY SUMMARY button is there in RISE home page');
        homePage.getVcrDailySummaryButton().should('be.visible');

        cy.log('Then I click on VCR DAILY SUMMARY button');
        homePage.getVcrDailySummaryButton().click();

        cy.log('And I select current date from dialog');
        homePage.SelectCurrentDateFromCalendar();

        cy.log('And I select lob from dialog');
        homePage.SelectLobFromList();

        cy.log('And I click on Ok button to download vcr');
        homePage.getOkButtonFromDialog().click();

        cy.wait('@downloadVcr').should(xhr => {
          expect(xhr.response.statusCode).to.eq(200);
        });
      });
    }
  );
});
