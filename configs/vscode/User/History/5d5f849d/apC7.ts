import homePage from '@pages/homePage';
import db_routes from '@support/database_routes';
import dbUtils from '@support/dbUtil';
import activeRoutesPage from '@pages/activeRoutesPage';
import routeClosingPage from '@pages/closingRoutesPage';
import routeClosingErrorPage from '@pages/closingRoutesErrorsPage';

describe('Close Route Error - Break block error message', () => {
  // todo cy ids
  const openRouteTable = 'open-route';
  const clockInCell = '#open-clock-in';
  const leaveYardCell = '#open-leave-yard';
  const beginMileageCell = '#open-start-mileage';

  beforeEach(() => {
    // setup intercepts
    cy.intercept(
      'GET',
      'https://routes-services-v2.riseqa1.awsext.repsrv.com/routes/v2/divisions/**/active/routes/summary**'
    ).as('getRouteSummary');
    cy.intercept(
      'GET',
      'https://routes-services.riseqa1.awsext.repsrv.com/routes/v1/divisions/**/routes/**/active/disposals/trux**'
    ).as('getActiveDisposals');

    cy.fixture('testData').then(testData => {
      cy.wrap(testData[Cypress.env('env')].TC_BreakBlockErr).as('testCaseData');
    });

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
        cy.wrap(resultset[0]).as('route');
        cy.wrap(resultset[0].INFOPRO_DIV).as('division');
        cy.wrap(new Date(resultset[0].ROUTE_DATE)).as('routeDate');
        cy.wrap(resultset[0].ROUTE_NUM.toString()).as('routeNum');
      });
    });
    cy.log('Given I get the LC dataset from DB to end the route with "NONIFTA" division');
  });

  it(
    'should verify Close Route details error messages for break block',
    { tags: ['@regression', '@closingRoutesErrors', '@TC_BreakBlockErr'] },
    function () {
      // And I navigate to the Route Closing page
      cy.nav('routeClosing', this.division);
      cy.wait('@getRouteSummary');

      // And I select the date from the queried data
      cy.routeClosing_selectDateFromString(this.routeDate.getUTCDate().toString());

      // And I filter for route from the queried data (and select it)
      cy.routeClosing_filterRouteByNum(this.routeNum);
      cy.contains('a', this.routeNum).click();
      cy.wait('@getActiveDisposals');

      // And I fill input fields for open route block with <clockIn>,<leaveYard>,<beginMileage>
      cy.log(
        'And I fill input fields for open route block with <clockIn>,<leaveYard>,<beginMileage>'
      );

      cy.get(openRouteTable).should('be.visible').scrollIntoView();

      cy.get(clockInCell).clear();
      cy.get(clockInCell).type(this.testCaseData.clockIn);

      cy.get(leaveYardCell).clear();
      cy.get(leaveYardCell).type(this.testCaseData.leaveYard);

      cy.get(beginMileageCell).clear();
      cy.get(beginMileageCell).type(this.testCaseData.beginMileage);

      // And  I fill first Load And Disposal table for LC route with values <startLoadOne>,<ticketNoOne>,<quantityOne>,<dispTimeInOne><dispTimeOutOne>,<finishLoadOne>,<receiptOne>
      cy.log(
        'And  I fill first Load And Disposal table for LC route with values <startLoadOne>,<ticketNoOne>,<quantityOne>,<dispTimeInOne><dispTimeOutOne>,<finishLoadOne>,<receiptOne>'
      );
      // enterLoadDataLCByIndex(
      //   index,
      //   startLoad,
      //   ticketNo,
      //   quantity,
      //   dispTimeIn,
      //   dispTimeOut,
      //   finishLoad,
      //   receipt
      // ) {
      const loadLargeContainers = 'p-table[formarrayname="loadLC"]';
      const startTimeContainer = 'p-calendar[formcontrolname="startTime"]';
      const siteNumberDropdownOptions = 'p-dropdown[formcontrolname="site"]';
      const ticketNumberInputField = 'input[formcontrolname="ticketNumber"]';
      const quantityInputField = 'input[formcontrolname="quantity"]';
      const timeInInputContainer = 'p-calendar[formcontrolname="inTime"]';
      const timeOutInputContainer = 'p-calendar[formcontrolname="outTime"]';
      //   this.getLoadLargeContainerByIndex(index).within(() => {

      cy.get(loadLargeContainers)
        .eq(0)
        .within(() => {
          //     this.getStartTimeInputField().clear().type(startLoad);

          cy.get(startTimeContainer)
            .find('input')
            .then($siteText => {
              if ($siteText.text().trim() === '') {
                cy.get(siteNumberDropdownOptions).first().click();
                cy.get(siteNumberDropdownOptions).first().type('{downarrow},{enter}');
              }

              cy.get(ticketNumberInputField).clear();
              cy.get(ticketNumberInputField).type(this.testCaseData.ticketNo);

              cy.get(quantityInputField).clear();
              cy.get(quantityInputField).type(this.testCaseData.quantity);

              cy.get(timeInInputContainer).find('input').clear();
              cy.get(timeInInputContainer).find('input').type(this.testCaseData.dispTimeIn);

              cy.get(timeOutInputContainer).find('input').clear();
              cy.get(timeOutInputContainer).find('input').type(this.testCaseData.dispTimeOut);

              //     this.getFinishTimeInputField().clear().type(finishLoad);

              //     if (receipt !== 'None') {
              //       const result = this.getReceiptInputField().should('be.visible');
              //       if (result) {
              //         this.getReceiptInputField().clear().type(receipt);
              //       }
              //     } else {
              //       this.getReceiptInputField().click();
              //     }
              //   });
            });
        });
      // }

      // routeClosingPage.enterLoadDataLCByIndex(
      //   0,
      //   this.testCaseData.startLoadOne,
      //   this.testCaseData.ticketNoOne,
      //   this.testCaseData.quantityOne,
      //   this.testCaseData.dispTimeInOne,
      //   this.testCaseData.dispTimeOutOne,
      //   this.testCaseData.finishLoadOne,
      //   this.testCaseData.receiptOne
      // );

      // routeClosingPage.closeRouteDetails(
      //   this.testCaseData.return,
      //   this.testCaseData.clockOut,
      //   this.testCaseData.endMileage
      // );
      // cy.log(
      //   'And I fill the input fields for Close Route table with <return>, <clockOut>, <endMileage>'
      // );

      // routeClosingPage.createBreakInput();
      // cy.log('And I click the create the Break input');

      // routeClosingPage.fillBreaksInput(this.testCaseData.startTime8, this.testCaseData.finishTime8);
      // cy.log('And I fill the Break with Start Time "11:00" And Finish Time "11:15"');

      // cy.intercept('POST', '**/appmonitors/**').as('appmonitors');
      // homePage.clickButton('End');
      // cy.log('And I click "End" button');
      // cy.wait('@appmonitors');

      // routeClosingErrorPage.validateCloseRouteAlertMsg(
      //   'Break Finish Time must be less than or equal to Clock Out Time'
      // );
      // cy.log(
      //   'And I verify the error message "Break Finish Time must be less than or equal to Clock Out Time"'
      // );

      // routeClosingPage.fillBreaksInput(this.testCaseData.startTime7, this.testCaseData.finishTime7);
      // cy.log('And I fill the Break with Start Time "05:30" And Finish Time "09:30"');

      // cy.intercept('POST', '**/appmonitors/**').as('appmonitors');
      // homePage.clickButton('End');
      // cy.log('And I click "End" button');
      // cy.wait('@appmonitors');

      // routeClosingErrorPage.validateCloseRouteAlertMsg(
      //   'No other route Time should exist between Start Break Time and Finish Break Time'
      // );
      // cy.log(
      //   'And I verify the error message "No other route Time should exist between Start Break Time and Finish Break Time"'
      // );

      // routeClosingPage.fillBreaksInput(this.testCaseData.startTime6, this.testCaseData.finishTime6);
      // cy.log('And I fill the Break with Start Time "06:01" And Finish Time "20:12"');

      // cy.intercept('POST', '**/appmonitors/**').as('appmonitors');
      // homePage.clickButton('End');
      // cy.log('And I click "End" button');
      // cy.wait('@appmonitors');

      // routeClosingErrorPage.validateCloseRouteAlertMsg(
      //   'Time between Break Start Time and Break Finish Time should not exceed 12 hours'
      // );
      // cy.log(
      //   'And I verify the error message "Time between Break Start Time and Break Finish Time should not exceed 12 hours"'
      // );

      // routeClosingPage.fillBreaksInput(this.testCaseData.startTime5, this.testCaseData.finishTime5);
      // cy.log('And I fill the Break with Start Time "07:55" And Finish Time "07:45"');

      // cy.intercept('POST', '**/appmonitors/**').as('appmonitors');
      // homePage.clickButton('End');
      // cy.log('And I click "End" button');
      // cy.wait('@appmonitors');

      // routeClosingErrorPage.validateCloseRouteAlertMsg(
      //   'Break Start Time must be less than or equal to Break Finish Time'
      // );
      // cy.log(
      //   'And I verify the error message "Break Start Time must be less than or equal to Break Finish Time"'
      // );
    }
  );
});
