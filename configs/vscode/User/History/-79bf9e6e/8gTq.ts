import activeRoutesPage from '@pages/activeRoutesPage';
import homePage from '@pages/homePage';
import db_routes from '@support/database_routes';
import dbUtil from '@support/dbUtil';

describe('Verify Active Route details', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      'https://vehicles-services.riseqa1.awsext.repsrv.com/vehicles/v1/divisions/**/vcr-summary?**'
    ).as('vehicleRequest');

    cy.setDivision('620');

    // Given I get the testdata from DB to proceed with Active Route with "NONIFTA" division
    cy.fixture('divisions').then(divisions => {
      const nonIftaDivisions = divisions[Cypress.env('env')].NONIFTA_DIVISION;

      cy.routesQuery('getRouteNoForActiveRouteServiceEvent', {
        '${division}': nonIftaDivisions
      }).then(result => {
        const division = result[0].INFOPRO_DIV;

        cy.wrap(division).as(`routeQueryDivision`);
      });
    });
  });

  // db_routes.getRouteNoForActiveRouteServiceEvent('NONIFTA');

  it('should verify Active Route details', { tags: ['@smoke'] }, () => {
    //   // When I click "Home" page in sidebar
    //   homePage.clickPageInSideBar('Home');
    //   cy.log('Clicked Home page in Sidebar');
    //   cy.get('body').click(0, 0);g

    //   // And I am on the Home Page
    //   homePage.waitForHomePageLoaded();

    //   // And I refresh the page
    //   cy.reload();

    //   // And I select "queried" division
    //   homePage.selectDivision('queried');

    //   // When I click "Active Routes" page in sidebar
    //   homePage.clickPageInSideBar('Active Routes');
    //   cy.log('Clicked Active Routes page in Sidebar');

    //   // And I select a date "queried"
    //   homePage.selectDate('queried');
    //   dbUtil.generateDBQueryDate('queried');
    //   cy.log('Date is selected');
    //   cy.wait(2000);

    // ------------------- test new functions ------------------------------------------------------
    cy.nav('activeRoutes');

    cy.activeRoutes_selectDate('4');
    cy.activeRoutes_filterRouteByNum('2002');
    // cy.activeRoutes_selectRoute('2002');

    // cy.visit({
    //   url: '/operations',
    //   qs: { networkId: 'automation', token: Cypress.env('secrets').riseToken }
    // });
    // cy.nav('activeRoutes');
    // cy.wait('@vehicleRequest');

    // cy.contains('Route Delay').should('be.visible');
    // cy.log('I waited');
    // cy.wait(10000);
    // cy.activeRoutes_navRoute('5-16-2024', '4127');
    // https://portal.riseqa1.awsext.repsrv.com/operations/active-routes/details/5-16-2024/4128

    // cy.activeRoutes_selectDate('16');

    // const routeNumber = '4128';

    // cy.activeRoutes_filterRouteByNum(routeNumber);
    // cy.contains('a', routeNumber).click();

    // validate that filter is applied
    // activeRoutesPage.selectRouteUpdated('4127');

    // cy.generateDBQueryDate('16').then(date => {
    // todo: add an action to select the date
    // cy.get('#date').click();
    // cy.get('.p-datepicker-calendar').get('td').not('.p-datepicker-other-month').contains(` 16 `);
    // });

    //   // And I select LOB "queried"
    //   cy.wait(2000);
    //   homePage.selectLineOfBusiness('queried');
    //   cy.log('Selected LOB');
    //   cy.wait(2000);

    //   // And I select the "queried" routenumber
    //   cy.log('Selected Route');

    //   // And I select the stop checkbox
    //   activeRoutesPage.selectCheckBoxForSequence('queried');

    //   // And I click "Additional" button
    //   homePage.clickButton('Additional');
    //   cy.log('I click on Additional button');
    //   cy.wait(3000);

    //   // And I enter "2" as quantity and service code
    //   activeRoutesPage.fillAdditionalModuleforHRS('2');

    //   // And I click "OK" button
    //   homePage.clickButton('OK');
    //   cy.log('I click on OK button');
    //   cy.wait(3000);

    //   // Then I see success message "Additional services have been added to the driver's route
    // and the customer's account." is displayed
    //   homePage.validatePopupMessage(
    //     'Additional services have been added to the drivers route and the customers account.'
    //   );
  });
});
