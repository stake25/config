import homePage from '@pages/homePage';
import routeReadyPage from '@pages/routeReadyPage';

describe('Route Ready tests', () => {
  beforeEach(() => {
    cy.fixture('queryData').as('queryData');
    cy.getRoutesQuery('getCustomerDetail').as('getCustomerDetailQuery');
    cy.fixture('divisions').as('divisions');
    cy.fixture('testData').as('testData');
    cy.visit(`/operations?networkId=automation&token=${Cypress.env('secrets').riseToken}`);

    cy.log(
      'Given I get the division  from DB to end the route with "ROUTEREADY_DIVISION" division'
    );
  });

  it(
    'should verify Route Ready Page',
    { tags: ['@regression', '@routeReady', '@TC_RouteReady'] },
    function () {
      this.getCustomerDetailQuery = this.getCustomerDetailQuery.replace(
        '$divisionNumber',
        this.divisions[Cypress.env('env')].ROUTEREADY_DIVISION
      );
      cy.dbUtil_executeSQLQuery(this.getCustomerDetailQuery).then(results => {
        const selectedDivisionNumber = results[1];

        homePage.clickPageInSideBar('Home');
        cy.log('When I click "Home" page in sidebar');
        cy.get('body').click(0, 0);

        homePage.waitForHomePageLoaded();
        cy.log('When I am on the Home Page');

        homePage.selectDivision(selectedDivisionNumber, true);
        cy.log('When I select "queried" division');

        homePage.clickPageInSideBar('Route Ready');
        cy.log('When I click "Route Ready" page in sidebar');
        routeReadyPage.waitForRouteReadyPageLoaded();
        cy.get('body').click(0, 0);

        cy.log(
          'Verify that pick a date, Oracle Division dropdpwn and Instruction message are displayed'
        );
        expect(routeReadyPage.getPickADateBox().should('be.visible'), 'Pick a Date is not visible');
        expect(
          routeReadyPage.oracleDivisionDropdown().should('be.visible'),
          'Oracle Division dropdown is not visible'
        );
        expect(
          routeReadyPage.getInstructionMessage().should('be.visible'),
          'Instruction Message is not visible'
        );

        cy.log('verify pick a date is selected as next business date');
        const date = routeReadyPage.getNextBusinessDay();
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);

        expect(
          routeReadyPage.getPickADateBox().should('have.value', `${month}/${day}/${year}`),
          'Pick a Date is not selected as next business date'
        );
      });
    }
  );
  it(
    'verify pick a date is selected as next business date',
    { tags: ['@regression', '@routeReady', '@TC_RouteReady'] },
    function () {
      this.getCustomerDetailQuery = this.getCustomerDetailQuery.replace(
        '$divisionNumber',
        this.divisions[Cypress.env('env')].ROUTEREADY_DIVISION
      );
      cy.dbUtil_executeSQLQuery(this.getCustomerDetailQuery).then(results => {
        const selectedDivisionNumber = results[1];

        homePage.clickPageInSideBar('Home');
        cy.log('When I click "Home" page in sidebar');
        cy.get('body').click(0, 0);

        homePage.waitForHomePageLoaded();
        cy.log('When I am on the Home Page');

        homePage.selectDivision(selectedDivisionNumber, true);
        cy.log('When I select "queried" division');

        homePage.clickPageInSideBar('Route Ready');
        cy.log('When I click "Route Ready" page in sidebar');
        routeReadyPage.waitForRouteReadyPageLoaded();
        cy.get('body').click(0, 0);

        cy.log('verify pick a date is selected as next business date');
        const date = routeReadyPage.getNextBusinessDay();
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);

        expect(
          routeReadyPage.getPickADateBox().should('have.value', `${month}/${day}/${year}`),
          'Pick a Date is not selected as next business date'
        );
      });
    }
  );

  it(
    'should verify Oracle Division',
    { tags: ['@regression', '@routeReady', '@TC_RouteReady'] },

    function () {
      const testCaseData = this.testData[Cypress.env('env')].TC_RouteReady_US109374;

      this.getCustomerDetailQuery = this.getCustomerDetailQuery.replace(
        '$divisionNumber',
        this.divisions[Cypress.env('env')].ROUTEREADY_DIVISION
      );
      cy.dbUtil_executeSQLQuery(this.getCustomerDetailQuery).then(results => {
        const selectedDivisionNumber = results[1];

        homePage.clickPageInSideBar('Home');
        cy.log('When I click "Home" page in sidebar');
        cy.get('body').click(0, 0);

        homePage.waitForHomePageLoaded();
        cy.log('When I am on the Home Page');

        homePage.selectDivision(selectedDivisionNumber, true);
        cy.log('When I select "queried" division');

        cy.log('When I click "Route Ready" page in sidebar');
        homePage.clickPageInSideBar('Route Ready');
        cy.get('body').click(0, 0);

        routeReadyPage.waitForRouteReadyPageLoaded();
        routeReadyPage.oracleDivisionDropdown().click().type(testCaseData.oracleDivision).click();
        cy.contains(testCaseData.oracleDivision).last().should('exist');
      });
    }
  );
});
