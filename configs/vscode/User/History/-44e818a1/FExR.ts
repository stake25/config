import homePage from '@pages/homePage';
import routeReadyPage from '@pages/routeReadyPage';

describe('Route Ready tests', () => {
  beforeEach(() => {
    cy.visit(`/operations?networkId=automation&token=${Cypress.env('riseToken')}`);

    cy.dbUtil_getDivisionNumber('ROUTEREADY_DIVISION').dbUtil_getCustomerDetail().as('testData');
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
    }
  );
  it(
    'verify pick a date is selected as next business date',
    { tags: ['@regression', '@routeReady', '@TC_RouteReady'] },
    function () {
      const { divisionNumber, queryData } = this.testData;

      homePage.clickPageInSideBar('Home');
      cy.log('When I click "Home" page in sidebar');
      cy.get('body').click(0, 0);

        homePage.clickPageInSideBar('Home');
        cy.log('When I click "Home" page in sidebar');
        cy.get('body').click(0, 0);

        homePage.waitForHomePageLoaded();
        cy.log('When I am on the Home Page');

        homePage.selectDivision(selectedDivisionNumber, true);
        cy.log('When I select "queried" division');

      cy.log('verify pick a date is selected as next business date');
      const date = routeReadyPage.getNextBusinessDay();
      const year = date.getFullYear();
      const month = `0${date.getMonth() + 1}`.slice(-2);
      const day = `0${date.getDate()}`.slice(-2);

      expect(
        routeReadyPage.getPickADateBox().should('have.value', `${month}/${day}/${year}`),
        'Pick a Date is not selected as next business date'
      );
    }
  );
});
//});
