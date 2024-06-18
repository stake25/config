import homePage from '@pages/homePage';
import db_routes from '@support/database_routes';
import dbUtils from '@support/dbUtil';
import activeRoutesPage from '@pages/activeRoutesPage';
import routeClosingPage from '@pages/closingRoutesPage';
import routeClosingErrorPage from '@pages/closingRoutesErrorsPage';
import { result } from 'cypress/types/lodash';

describe('Close Route Error - Midnight routes validations', () => {
  before(() => {
    cy.fixture('testData').as('testData');
  });

  beforeEach(() => {
    // cy.visit(`/operations?networkId=automation&token=${Cypress.env('secrets').riseToken}`);
    cy.intercept(
      'GET',
      'https://routes-services-v2.riseqa1.awsext.repsrv.com/routes/v2/divisions/**/active/routes/summary**'
    ).as('getActiveRoutesSummary');
    cy.intercept(
      'GET',
      'https://routes-services.riseqa1.awsext.repsrv.com/routes/v1/divisions/**/routes/**/active/disposals/trux**'
    ).as('getActiveDisposals');

    //  Given I get the LC dataset from DB to end the route with "NONIFTA" division
    cy.fixture('divisions').then(divisions => {
      const division = divisions[Cypress.env('env')].NONIFTA_DIVISION;

      cy.routesQuery('getRouteTestDataLC', { $division: division }).then(resultset => {
        //   [
        //     {
        //         "INFOPRO_DIV": "690",
        //         "ROUTE_DATE": "2024-06-10T04:00:00.000Z",
        //         "ROUTE_NUM": 1126,
        //         "SEQUENCE": 1,
        //         "REV_DIST_CODE": "20",
        //         "SERVICE_CD": "DRT",
        //         "ACCOUNT": "1002243",
        //         "SITE": "00015",
        //         "CONTAINER_GRP": 1
        //     }
        // ]
        cy.wrap(resultset).as('route');
        cy.wrap(new Date(resultset[0].ROUTE_DATE)).as('routeDate');
        cy.wrap(resultset[0].ROUTE_NUM.toString()).as('routeNumber');
      });
    });
    // db_routes.getRouteTestDataLC('NONIFTA');
    cy.log('Retrieved the test data from DB to perform end the route test case');
  });

  it.only(
    'Verify Time between Open Clock In Time and Leave Yard Time should not exceed 12 hours',
    { tags: ['@regression', '@closingRoutesErrors', '@TC_MidnightRoutesErr'] },
    function () {
      const testCaseData = this.testData[Cypress.env('env')].TC_MidnightRoutesErr_sc1;

      // navigate to the route closing page
      cy.nav('routeClosing', this.route[0].INFOPRO_DIV);
      cy.wait('@getActiveRoutesSummary');

      // select the date of the route queried
      cy.routeClosing_selectDateFromString(this.routeDate.getUTCDate().toString());

      // Then I select "queried" route
      cy.routeClosing_filterRouteByNum(this.routeNumber);
      cy.contains('a', this.routeNumber).click();
      cy.wait('@getActiveDisposals');

      // When I fill input fields for open route block with <clockIn>,<leaveYard>,<beginMileage>
      cy.get('open-route').should('be.visible').scrollIntoView();
      cy.get('#open-clock-in').clear();
      cy.get('#open-clock-in').type(testCaseData.clockIn);
      cy.get('#open-leave-yard').clear();
      cy.get('#open-leave-yard').type(testCaseData.leaveYard);
      cy.get('#open-start-mileage').clear();
      cy.get('#open-start-mileage').type(testCaseData.beginMileage);

      // And I fill first Load and Disposal table for LC route with values
      // <startLoadOne>,<ticketNoOne>,<quantityOne>,<dispTimeInOne>,
      // <dispTimeOutOne>,<finishLoadOne>,<receiptOne>
      cy.get('p-table[formarrayname="loadLC"]')
        .eq(0)
        .within(() => {
          cy.get('loads-lc-start-time-0').clear();
          cy.get('loads-lc-start-time-0').type(testCaseData.startLoadOne);

          cy.get('p-dropdown[formcontrolname="site"]')
            .first()
            .then($siteText => {
              if ($siteText.text().trim() === '') {
                cy.get('p-dropdown[formcontrolname="site"]').first().click();
                cy.get('p-dropdown[formcontrolname="site"]').first().type('{downarrow},{enter}');
              }
            });

          cy.get('input[formcontrolname="ticketNumber"]').clear();
          cy.get('input[formcontrolname="ticketNumber"]').type(testCaseData.ticketNoOne);

          cy.get('input[formcontrolname="quantity"]').clear();
          cy.get('input[formcontrolname="quantity"]').type(testCaseData.quantityOne);

          cy.get('p-calendar[formcontrolname="inTime"]').find('input').clear();
          cy.get('p-calendar[formcontrolname="inTime"]')
            .find('input')
            .type(testCaseData.dispTimeInOne);

          cy.get('p-calendar[formcontrolname="outTime"]').find('input').clear();
          cy.get('p-calendar[formcontrolname="outTime"]')
            .find('input')
            .type(testCaseData.dispTimeOutOne);

          cy.get('p-calendar[formcontrolname="finishTime"]').find('input');
          cy.get('p-calendar[formcontrolname="finishTime"]').find('input');
        });

      //   this.getFinishTimeInputField().clear().type(finishLoad);
      //   if (receipt !== 'None') {
      //     const result = this.getReceiptInputField().should('be.visible');

      //     if (result) {
      //       this.getReceiptInputField().clear().type(receipt);
      //     }
      //   } else {
      //     this.getReceiptInputField().click();
      //   }
      // });
      routeClosingPage.enterLoadDataLCByIndex(
        0,
        testCaseData.startLoadOne,
        testCaseData.ticketNoOne,
        testCaseData.quantityOne,
        testCaseData.dispTimeInOne,
        testCaseData.dispTimeOutOne,
        testCaseData.finishLoadOne,
        testCaseData.receiptOne
      );

      // // And I fill input fields for close route block with time
      // // <returnTime>, <clockOutTime> and <endMileage>
      // routeClosingPage.closeRouteDetails(
      //   testCaseData.returnTime,
      //   testCaseData.clockOutTime,
      //   testCaseData.endMileage
      // );

      // // And I click "End" button
      // homePage.clickButton('End');
      // cy.log('I click on End button');
      // cy.wait(3000);

      // // Then I verify the error message
      // // "Time between Open Clock In Time and Leave Yard Time should not exceed 12 hours"
      // routeClosingErrorPage.validateCloseRouteAlertMsg(
      //   'Time between Open Clock In Time and Leave Yard Time should not exceed 12 hours'
      // );
    }
  );

  it(
    'Verify Time between First Load Start Time and Leave Yard Time Should not exceed 12 hours',
    { tags: ['@regression', '@closingRoutesErrors', '@TC_MidnightRoutesErr'] },
    function () {
      const testCaseData = this.testData[Cypress.env('env')].TC_MidnightRoutesErr_sc2;

      // And I click "Home" page in sidebar
      homePage.clickPageInSideBar('Home');
      cy.log('Clicked Home page in Sidebar');
      cy.get('body').click(0, 0);

      // And I am on the Home Page
      homePage.waitForHomePageLoaded();

      // And I select "queried" division
      homePage.selectDivision('queried');

      // And I click "Route Closing" page in sidebar
      homePage.clickPageInSideBar('Route Closing');
      cy.log('Clicked Route Closing page in Sidebar');
      cy.get('body').click(0, 0);

      // And I select a date "queried"
      homePage.selectDate('queried');
      dbUtils.generateDBQueryDate('queried');
      cy.log('Date is selected');
      cy.wait(3000);

      // And I select LOB "queried"
      homePage.selectLineOfBusiness('queried');
      cy.log('Selected LOB');
      cy.wait(3000);

      // Then I select "queried" route
      activeRoutesPage.selectRouteUpdated('queried');
      cy.log('Selected Route');

      // And Wait until the LC Load table is displayed
      routeClosingPage.getLCStopTable().should('be.visible');

      // When I fill input fields for open route block with <clockIn>,<leaveYard>,<beginMileage>
      cy.wait(2000);
      routeClosingPage.openRoutedetails(
        testCaseData.clockIn,
        testCaseData.leaveYard,
        testCaseData.beginMileage
      );

      // And I fill first Load and Disposal table for LC route with values
      // <startLoadOne>,<ticketNoOne>,<quantityOne>,<dispTimeInOne>,
      // <dispTimeOutOne>,<finishLoadOne>,<receiptOne>
      routeClosingPage.enterLoadDataLCByIndex(
        0,
        testCaseData.startLoadOne,
        testCaseData.ticketNoOne,
        testCaseData.quantityOne,
        testCaseData.dispTimeInOne,
        testCaseData.dispTimeOutOne,
        testCaseData.finishLoadOne,
        testCaseData.receiptOne
      );

      // And I fill input fields for close route block with time
      // <returnTime>, <clockOutTime> and <endMileage>
      routeClosingPage.closeRouteDetails(
        testCaseData.returnTime,
        testCaseData.clockOutTime,
        testCaseData.endMileage
      );

      // And I click "End" button
      homePage.clickButton('End');
      cy.log('I click on End button');
      cy.wait(3000);

      // Then I verify the error message exists
      // "Time between First Load Start Time and Leave Yard Time Should not exceed 12 hours"
      routeClosingErrorPage.validateCloseRouteAlertMsg(
        'Time between First Load Start Time and Leave Yard Time Should not exceed 12 hours'
      );

      // And I click Back button
      homePage.clickButton('Back');
      cy.log('I click on Back button');
      cy.wait(3000);

      // And Verify the route table presence
      routeClosingPage.verifyRouteClosingTable();

      // When I select "queried" route
      activeRoutesPage.selectRouteUpdated('queried');
      cy.log('Selected Route');

      // And Wait until the LC Load table is displayed
      routeClosingPage.getLCStopTable().should('be.visible');

      // And I fill input fields for open route block with <clockIn>,<leaveYard>,<beginMileage>
      cy.wait(2000);
      routeClosingPage.openRoutedetails(
        testCaseData.clockIn,
        testCaseData.leaveYard,
        testCaseData.beginMileage
      );

      // And I fill first Load and Disposal table for LC route with values
      // <startLoadOne2>,<ticketNoOne>,<quantityOne>,<dispTimeInOne2>,
      // <dispTimeOutOne2>,<finishLoadOne2>,<receiptOne>
      routeClosingPage.enterLoadDataLCByIndex(
        0,
        testCaseData.startLoadOne2,
        testCaseData.ticketNoOne,
        testCaseData.quantityOne,
        testCaseData.dispTimeInOne2,
        testCaseData.dispTimeOutOne2,
        testCaseData.finishLoadOne2,
        testCaseData.receiptOne
      );

      // And I fill input fields for close route block with time
      // <returnTime2>, <clockOutTime2> and <endMileage>
      routeClosingPage.closeRouteDetails(
        testCaseData.returnTime2,
        testCaseData.clockOutTime2,
        testCaseData.endMileage
      );

      // And I click "End" button
      homePage.clickButton('End');
      cy.log('I click on End button');
      cy.wait(3000);

      // Then I verify the error message exists
      // "Time between Return Time and Clock Out Time should not exceed 12hours"
      routeClosingErrorPage.validateCloseRouteAlertMsg(
        'Time between Return Time and Clock Out Time should not exceed 12hours'
      );
    }
  );
});
