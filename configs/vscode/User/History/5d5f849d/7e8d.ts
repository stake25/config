describe('Close Route Error - Break block error message', () => {
  // todo cy ids
  const openRouteTable = 'open-route';
  const clockInCell = '#open-clock-in';
  const leaveYardCell = '#open-leave-yard';
  const beginMileageCell = '#open-start-mileage';
  const loadLargeContainers = 'p-table[formarrayname="loadLC"]';
  const startTimeContainer = 'p-calendar[formcontrolname="startTime"]';
  const siteNumberDropdownOptions = 'p-dropdown[formcontrolname="site"]';
  const ticketNumberInputField = 'input[formcontrolname="ticketNumber"]';
  const quantityInputField = 'input[formcontrolname="quantity"]';
  const timeInInputContainer = 'p-calendar[formcontrolname="inTime"]';
  const timeOutInputContainer = 'p-calendar[formcontrolname="outTime"]';
  const getFinishTimeInputField = 'p-calendar[formcontrolname="finishTime"]';
  const receiptInputField = 'input[formcontrolname="receipt"]';
  const closeRouteTable = '.table-group-col > close-route';
  const returnFieldInCloseRoute = '#close-start-time';
  const clockOutFieldInCloseRoute = '#close-finish-time';
  const endMilageFieldInCloseRoute = '#close-finish-mileage';
  const breaksTable = 'breaks';
  const breakStart = '#breaks-start-time-0';
  const breakFinish = '#breaks-finish-time-0';
  const routeCloseErrorMessage = 'p.alert-routeClose';

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

      // And  I fill first Load And Disposal table for LC route with values
      // <startLoadOne>,<ticketNoOne>,<quantityOne>,<dispTimeInOne><dispTimeOutOne>,<finishLoadOne>,
      // <receiptOne>
      cy.log(
        'And  I fill first Load And Disposal table for LC route with values <startLoadOne>,<ticketNoOne>,<quantityOne>,<dispTimeInOne><dispTimeOutOne>,<finishLoadOne>,<receiptOne>'
      );

      cy.get(loadLargeContainers)
        .eq(0)
        .within(() => {
          cy.get(startTimeContainer)
            .find('input')
            .then($siteText => {
              cy.get(startTimeContainer).find('input').clear();
              cy.get(startTimeContainer).find('input').type(this.testCaseData.startLoadOne);

              if ($siteText.text().trim() === '') {
                cy.get(siteNumberDropdownOptions).first().click();
                cy.get(siteNumberDropdownOptions).first().type('{downarrow},{enter}');
              }

              cy.get(ticketNumberInputField).clear();
              cy.get(ticketNumberInputField).type(this.testCaseData.ticketNoOne);

              cy.get(quantityInputField).clear();
              cy.get(quantityInputField).type(this.testCaseData.quantityOne);

              cy.get(timeInInputContainer).find('input').clear();
              cy.get(timeInInputContainer).find('input').type(this.testCaseData.dispTimeInOne);

              cy.get(timeOutInputContainer).find('input').clear();
              cy.get(timeOutInputContainer).find('input').type(this.testCaseData.dispTimeOutOne);

              cy.get(getFinishTimeInputField).find('input').clear();
              cy.get(getFinishTimeInputField).find('input').type(this.testCaseData.finishLoadOne);

              if (this.testCaseData.receipt !== 'None') {
                cy.get(receiptInputField).should('be.visible');

                cy.get(receiptInputField).clear();
                cy.get(receiptInputField).type(this.testCaseData.receiptOne);
              }
            });
        });

      // And I fill the input fields for Close Route table with <return>, <clockOut>, <endMileage>
      cy.log(
        'And I fill the input fields for Close Route table with <return>, <clockOut>, <endMileage>'
      );

      cy.get(closeRouteTable).should('be.visible');

      cy.get(returnFieldInCloseRoute).clear();
      cy.get(returnFieldInCloseRoute).type(this.testCaseData.return);

      cy.get(clockOutFieldInCloseRoute).clear();
      cy.get(clockOutFieldInCloseRoute).type(this.testCaseData.clockOut);

      cy.get(endMilageFieldInCloseRoute).clear();
      cy.get(endMilageFieldInCloseRoute).type(this.testCaseData.endMileage);

      // And I click the create the Break input
      cy.log('And I click the create the Break input');

      cy.contains('h2', 'Breaks').find('i').click();

      cy.get(breaksTable).within(() => {
        cy.get('tbody').should('exist');
        cy.get('tbody').trigger('mouseover');
        // Ensuring this object exist, because code does not click anywhere afterwards.
        cy.get('tbody').should('exist');

        // And I fill the Break with Start Time "11:00" And Finish Time "11:15"
        cy.log('And I fill the Break with Start Time "11:00" And Finish Time "11:15"');
        cy.get('tbody').should('be.visible');
        cy.get(breakStart).clear();
        cy.get(breakStart).type(this.testCaseData.startTime8);

        cy.get(breakFinish).clear();
        cy.get(breakFinish).type(this.testCaseData.finishTime8);
      });

      // And I click "End" button
      cy.log('And I click "End" button');
      cy.contains('button', 'End').click();

      // And I verify the error message
      // "Break Finish Time must be less than or equal to Clock Out Time"
      cy.log(
        'And I verify the error message "Break Finish Time must be less than or equal to Clock Out Time"'
      );

      cy.get(routeCloseErrorMessage)
        .first()
        .invoke('text')
        .then(elemText => {
          expect(elemText.trim()).to.equals(
            'Break Finish Time must be less than or equal to Clock Out Time'
          );
        });

      // And I fill the Break with Start Time "05:30" And Finish Time "09:30"
      cy.log('And I fill the Break with Start Time "05:30" And Finish Time "09:30"');
      // routeClosingPage.fillBreaksInput(this.testCaseData.startTime7, this.testCaseData.finishTime7);

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
