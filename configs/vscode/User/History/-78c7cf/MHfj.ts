import homePage from '@pages/homePage';
import db_routes from '@support/database_routes';
import dbUtils from '@support/dbUtil';
import activeRoutesPage from '@pages/activeRoutesPage';
import routeClosingPage from '@pages/closingRoutesPage';
import routeClosingErrorPage from '@pages/closingRoutesErrorsPage';
import { result } from 'cypress/types/lodash';

describe('Close Route Error - Midnight routes validations', () => {
  // todo cy ids
  const openRouteTable = 'open-route';
  const clockIn = '#open-clock-in';
  const leaveYard = '#open-leave-yard';
  const startMileage = '#open-start-mileage';
  const loadTimeTable = 'p-table[formarrayname="loadLC"]';
  const startLoad = '#loads-lc-start-time-0';
  const siteDropdown = 'p-dropdown[formcontrolname="site"]';
  const ticketNumber = 'input[formcontrolname="ticketNumber"]';
  const quantity = 'input[formcontrolname="quantity"]';
  const inTime = 'p-calendar[formcontrolname="inTime"]';
  const outTime = 'p-calendar[formcontrolname="outTime"]';
  const finishTime = 'p-calendar[formcontrolname="finishTime"]';
  const receipt = 'input[formcontrolname="receipt"]';
  const closeRouteTable = '.table-group-col > close-route';
  const returnFieldInCloseRoute = '#close-start-time';
  const clockOutFieldInCloseRoute = '#close-finish-time';
  const endMilageFieldInCloseRoute = '#close-finish-mileage';
  const routeCloseError = 'p.alert-routeClose';

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

  it(
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
      cy.get(openRouteTable).should('be.visible').scrollIntoView();

      cy.get(clockIn).clear();
      cy.get(clockIn).type(testCaseData.clockIn);

      cy.get(leaveYard).clear();
      cy.get(leaveYard).type(testCaseData.leaveYard);

      cy.get(startMileage).clear();
      cy.get(startMileage).type(testCaseData.beginMileage);

      // And I fill first Load and Disposal table for LC route with values
      // <startLoadOne>,<ticketNoOne>,<quantityOne>,<dispTimeInOne>,
      // <dispTimeOutOne>,<finishLoadOne>,<receiptOne>
      cy.get(loadTimeTable)
        .eq(0)
        .within(() => {
          cy.get(startLoad).clear();
          cy.get(startLoad).type(testCaseData.startLoadOne);

          cy.get(siteDropdown)
            .first()
            .then($siteText => {
              if ($siteText.text().trim() === '') {
                cy.get(siteDropdown).first().click();
                cy.get(siteDropdown).first().type('{downarrow},{enter}');
              }
            });

          cy.get(ticketNumber).clear();
          cy.get(ticketNumber).type(testCaseData.ticketNoOne);

          cy.get(quantity).clear();
          cy.get(quantity).type(testCaseData.quantityOne);

          cy.get(inTime).find('input').clear();
          cy.get(inTime).find('input').type(testCaseData.dispTimeInOne);

          cy.get(outTime).find('input').clear();
          cy.get(outTime).find('input').type(testCaseData.dispTimeOutOne);

          cy.get(finishTime).find('input').clear();
          cy.get(finishTime).find('input').type(testCaseData.finishLoadOne);

          if (testCaseData.receiptOne !== 'None') {
            cy.get(receipt).should('be.visible');

            cy.get(receipt).clear();
            cy.get(receipt).type(testCaseData.receiptOne);
          } else {
            cy.get(receipt).click();
          }
        });

      // And I fill input fields for close route block with time
      // <returnTime>, <clockOutTime> and <endMileage>
      cy.get(closeRouteTable).should('be.visible');

      cy.get(returnFieldInCloseRoute).clear();
      cy.get(returnFieldInCloseRoute).type(testCaseData.returnTime);

      cy.get(clockOutFieldInCloseRoute).clear();
      cy.get(clockOutFieldInCloseRoute).type(testCaseData.clockOutTime);

      cy.get(endMilageFieldInCloseRoute).clear();
      cy.get(endMilageFieldInCloseRoute).type(testCaseData.endMileage);

      // And I click "End" button
      cy.contains('button', 'End').click();

      // Then I verify the error message
      // "Time between Open Clock In Time and Leave Yard Time should not exceed 12 hours"
      cy.get(routeCloseError)
        .first()
        .invoke('text')
        .then(elemText => {
          expect(elemText.trim()).to.equals(
            'Time between Open Clock In Time and Leave Yard Time should not exceed 12 hours'
          );
        });
    }
  );

  it.only(
    'Verify Time between First Load Start Time and Leave Yard Time Should not exceed 12 hours',
    { tags: ['@regression', '@closingRoutesErrors', '@TC_MidnightRoutesErr'] },
    function () {
      const testCaseData = this.testData[Cypress.env('env')].TC_MidnightRoutesErr_sc2;

      // navigate to the route closing page
      cy.nav('routeClosing', this.route[0].INFOPRO_DIV);
      cy.wait('@getActiveRoutesSummary');

      // select the date of the route queried
      cy.routeClosing_selectDateFromString(this.routeDate.getUTCDate().toString());

      // Then I select "queried" route
      cy.routeClosing_filterRouteByNum(this.routeNumber);
      cy.contains('a', this.routeNumber).click();
      cy.wait('@getActiveDisposals');

      // And Wait until the LC Load table is displayed
      routeClosingPage.getLCStopTable().should('be.visible');

      // When I fill input fields for open route block with <clockIn>,<leaveYard>,<beginMileage>
      cy.get(openRouteTable).should('be.visible').scrollIntoView();

      cy.get(clockIn).clear();
      cy.get(clockIn).type(testCaseData.clockIn);

      cy.get(leaveYard).clear();
      cy.get(leaveYard).type(testCaseData.leaveYard);

      cy.get(startMileage).clear();
      cy.get(startMileage).type(testCaseData.beginMileage);

      // And I fill first Load and Disposal table for LC route with values
      // <startLoadOne>,<ticketNoOne>,<quantityOne>,<dispTimeInOne>,
      // <dispTimeOutOne>,<finishLoadOne>,<receiptOne>
      cy.get(loadTimeTable)
        .eq(0)
        .within(() => {
          cy.get(startLoad).clear();
          cy.get(startLoad).type(testCaseData.startLoadOne);

          cy.get(siteDropdown)
            .first()
            .then($siteText => {
              if ($siteText.text().trim() === '') {
                cy.get(siteDropdown).first().click();
                cy.get(siteDropdown).first().type('{downarrow},{enter}');
              }
            });

          cy.get(ticketNumber).clear();
          cy.get(ticketNumber).type(testCaseData.ticketNoOne);

          cy.get(quantity).clear();
          cy.get(quantity).type(testCaseData.quantityOne);

          cy.get(inTime).find('input').clear();
          cy.get(inTime).find('input').type(testCaseData.dispTimeInOne);

          cy.get(outTime).find('input').clear();
          cy.get(outTime).find('input').type(testCaseData.dispTimeOutOne);

          cy.get(finishTime).find('input').clear();
          cy.get(finishTime).find('input').type(testCaseData.finishLoadOne);

          if (testCaseData.receiptOne !== 'None') {
            cy.get(receipt).should('be.visible');

            cy.get(receipt).clear();
            cy.get(receipt).type(testCaseData.receiptOne);
          } else {
            cy.get(receipt).click();
          }
        });

      // And I fill input fields for close route block with time
      // <returnTime>, <clockOutTime> and <endMileage>
      cy.get(closeRouteTable).should('be.visible');

      cy.get(returnFieldInCloseRoute).clear();
      cy.get(returnFieldInCloseRoute).type(testCaseData.returnTime);

      cy.get(clockOutFieldInCloseRoute).clear();
      cy.get(clockOutFieldInCloseRoute).type(testCaseData.clockOutTime);

      cy.get(endMilageFieldInCloseRoute).clear();
      cy.get(endMilageFieldInCloseRoute).type(testCaseData.endMileage);

      // And I click Back button
      cy.contains('button', 'Back').click();

      // And Verify the route table presence
      // routeClosingPage.verifyRouteClosingTable();
      cy.get('div#route-closing').find('table > .p-datatable-tbody', { timeout: 1200000 });

      // When I select "queried" route
      cy.contains('a', this.routeNumber).click();
      cy.wait('@getActiveDisposals');

      // When I fill input fields for open route block with <clockIn>,<leaveYard>,<beginMileage>
      cy.get(openRouteTable).should('be.visible').scrollIntoView();

      cy.get(clockIn).clear();
      cy.get(clockIn).type(testCaseData.clockIn);

      cy.get(leaveYard).clear();
      cy.get(leaveYard).type(testCaseData.leaveYard);

      cy.get(startMileage).clear();
      cy.get(startMileage).type(testCaseData.beginMileage);

      // And I fill first Load and Disposal table for LC route with values
      // <startLoadOne>,<ticketNoOne>,<quantityOne>,<dispTimeInOne>,
      // <dispTimeOutOne>,<finishLoadOne>,<receiptOne>
      cy.get(loadTimeTable)
        .eq(0)
        .within(() => {
          cy.get(startLoad).clear();
          cy.get(startLoad).type(testCaseData.startLoadOne);

          cy.get(siteDropdown)
            .first()
            .then($siteText => {
              if ($siteText.text().trim() === '') {
                cy.get(siteDropdown).first().click();
                cy.get(siteDropdown).first().type('{downarrow},{enter}');
              }
            });

          cy.get(ticketNumber).clear();
          cy.get(ticketNumber).type(testCaseData.ticketNoOne);

          cy.get(quantity).clear();
          cy.get(quantity).type(testCaseData.quantityOne);

          cy.get(inTime).find('input').clear();
          cy.get(inTime).find('input').type(testCaseData.dispTimeInOne);

          cy.get(outTime).find('input').clear();
          cy.get(outTime).find('input').type(testCaseData.dispTimeOutOne);

          cy.get(finishTime).find('input').clear();
          cy.get(finishTime).find('input').type(testCaseData.finishLoadOne);

          if (testCaseData.receiptOne !== 'None') {
            cy.get(receipt).should('be.visible');

            cy.get(receipt).clear();
            cy.get(receipt).type(testCaseData.receiptOne);
          } else {
            cy.get(receipt).click();
          }
        });

      // And I fill input fields for close route block with time
      // <returnTime>, <clockOutTime> and <endMileage>
      cy.get(closeRouteTable).should('be.visible');

      cy.get(returnFieldInCloseRoute).clear();
      cy.get(returnFieldInCloseRoute).type(testCaseData.returnTime);

      cy.get(clockOutFieldInCloseRoute).clear();
      cy.get(clockOutFieldInCloseRoute).type(testCaseData.clockOutTime);

      cy.get(endMilageFieldInCloseRoute).clear();
      cy.get(endMilageFieldInCloseRoute).type(testCaseData.endMileage);

      // And I click "End" button
      cy.contains('button', 'End').click();

      // Then I verify the error message
      // "Time between Open Clock In Time and Leave Yard Time should not exceed 12 hours"
      cy.get(routeCloseError)
        .first()
        .invoke('text')
        .then(elemText => {
          expect(elemText.trim()).to.equals(
            'Time between Return Time and Clock Out Time should not exceed 12 hours'
          );
        });

      // // Then I verify the error message exists
      // // "Time between Return Time and Clock Out Time should not exceed 12hours"
      // routeClosingErrorPage.validateCloseRouteAlertMsg(
      //   'Time between Return Time and Clock Out Time should not exceed 12hours'
      // );
    }
  );
});
