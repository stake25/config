import activeRoutepage from '@pages/activeRoutesPage';
import db_routes from '@support/database_routes';
import { queryData } from '@fixtures/queryData';
import homepage from '@pages/homePage';

class RouteClosing {
  // -------------------------- ROUTE CLOSING PAGE TABLE---------------

  button(buttonName: string) {
    return cy.get('button').contains(buttonName);
  }

  getReplacementPopup() {
    return cy.contains('p.modal-prompt', 'Replacement');
  }

  verifyReplacementPopupDisplay() {
    this.getReplacementPopup().should('be.visible');
  }

  getReplaceDriverPopup() {
    return cy.get('p.modal-prompt').contains('Replace Driver');
  }

  verifyReplaceDriverPopupDisplay() {
    this.getReplaceDriverPopup().should('be.visible');
  }

  getReplaceTruckPopup() {
    return cy.get('p.modal-prompt').contains('Replace Truck');
  }

  verifyReplaceTruckPopupDisplay() {
    this.getReplaceTruckPopup().should('be.visible');
  }

  getRouteFailureHeader() {
    return cy.get('.table-row-error.ng-star-inserted');
  }

  getRouteTableHeader() {
    return cy.get('div#route-closing').find('table > .p-datatable-tbody', { timeout: 1200000 });
  }

  getRouteTableBody() {
    return cy.get('div#route-closing').find('tbody.p-datatable-tbody', { timeout: 10000 });
  }

  getRouteData() {
    return cy.contains('div', 'Getting close', { timeout: 10000 });
  }

  getRouteNumberLink(routeNumber: string) {
    return cy.contains('a', routeNumber);
  }

  getDropDownRouteStatus() {
    return cy.get('p-multiselect[inputid="status"]');
  }

  getTableRowByRouteNumber(routeNumber: string) {
    return cy.get('tbody').find('td').contains(routeNumber).parent();
  }

  getStatusByRouteNumber(routeNumber: string, status: string) {
    return cy
      .contains('a', routeNumber, { timeout: 40000 })
      .parentsUntil('tbody')
      .last()
      .find('td')
      .eq(7)
      .contains(status, { timeout: 900000 });
  }

  getStatusForRouteNumber(routeNumber: string) {
    return cy.get('td').contains('a', routeNumber).parentsUntil('tbody').last().find('td').eq(6);
  }

  waitForRouteToLoad() {
    return this.getRouteData().should('not.be.visible');
  }

  // Method name is changed as per old method name
  verifyRouteClosingTable() {
    return this.getRouteTableHeader().should('be.visible');
  }

  // Method name is changed as per old method name
  verifyRouteClosingTableBody() {
    return this.getRouteTableBody().should('be.visible', { timeout: 10000 });
  }

  verifyRouteNumberLinkIsPresent(routeNumber: string) {
    this.getRouteNumberLink(routeNumber).should('exist');
  }

  verifyRouteStatus(routeNo, routeStatus: string) {
    this.getStatusByRouteNumber(routeNo, routeStatus).should('be.visible');
  }

  selectRouteStatusInDropDown(routeStatus) {
    this.getDropDownRouteStatus().click();
    this.getDropDownRouteStatus().find('.p-inputtext').type(routeStatus);
    this.getDropDownRouteStatus()
      .find('.p-multiselect-item')
      .contains(routeStatus)
      .parent()
      .find('.p-checkbox')
      .click();
  }

  verifyRouteStatusUpdated(route, routeStatus: string) {
    let flag: Boolean = false;
    let currStatus: any;

    for (let i = 0; i < 10; i++) {
      try {
        let totalPages;

        activeRoutepage.totalPages().then(activeRoutepage => {
          totalPages = activeRoutepage.length;
        });
        if (totalPages > 1) {
          for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
            activeRoutepage.clickPage(currentPage).click();
            cy.wait(5000);
            this.getStatusForRouteNumber(route).then(getStatusForRouteNumber => {
              currStatus = getStatusForRouteNumber.text();
            });

            if (currStatus === 'End Failed') {
              flag = true;
              i = i + 1;
              break;
            }
            this.getStatusByRouteNumber(route, routeStatus).should('be.visible');
            break;
          }
        } else if (totalPages === 1) {
          this.getStatusForRouteNumber(route).then(statusForRouteNumber => {
            currStatus = statusForRouteNumber.text();
          });
          if (currStatus === 'End Failed') {
            flag = true;
            break;
          }
          this.getStatusByRouteNumber(route, routeStatus).should('be.visible');
        }
      } catch (e) {
        cy.wait(60000);
        this.routeNumber(route).click();
        cy.go('back');
      }
      if (flag === true) {
        throw new Error('End Failed Status');
      }
    }
  }

  verifyInProgressRouteStatus(routeNo, routeStatus: string) {
    this.getStatusByRouteNumber(routeNo, routeStatus).should('be.visible');
  }

  // ------------------------ ROUTE DETAIL PAGE ------------------------

  // LIFTS

  getEnteredLiftsBox() {
    return cy.get('.lift-list').contains('.lift-list-item', 'Entered Lifts:');
  }

  getRegularLiftsCount() {
    return cy.get('.lift-list').contains('.lift-list-item', 'Regular Lifts:').find('.lift-detail');
  }

  getAdditionalLiftsCount() {
    return cy
      .get('.lift-list')
      .contains('.lift-list-item', 'Additional Lifts:')
      .find('.lift-detail');
  }

  getMissedLiftsCount() {
    return cy
      .get('.lift-list')
      .contains('.lift-list-item', 'Missed/Transferred Lifts:')
      .find('.lift-detail');
  }

  getEnteredLiftsCount() {
    return cy.get('.lift-list').contains('.lift-list-item', 'Entered Lifts:').find('.lift-detail');
  }

  getLiftCounts() {
    cy.wait(3000);
    let regLifts;
    let addLifts;
    let missedLifts;

    this.getRegularLiftsCount().then(regularLiftsCount => {
      regLifts = regularLiftsCount.attr('innerText');
    });
    this.getAdditionalLiftsCount().then(additionalLiftsCount => {
      addLifts = additionalLiftsCount.attr('innerText');
    });
    this.getMissedLiftsCount().then(missedLiftsCount => {
      missedLifts = missedLiftsCount.attr('innerText');
    });
    const totLifts = parseInt(regLifts, 10) + parseInt(addLifts, 10) - parseInt(missedLifts, 10);

    return totLifts;
  }

  totLifts() {
    return cy.contains('Total Lifts:').parent().find('p.lift-detail');
  }

  getEntLifts() {
    return this.getEnteredLiftsCount().invoke('text');
  }

  // Nanthini: Returns value as undefined. Refer 'enterDataFirstLoadSC' method in Closing Routes Error page
  getTotalLifts() {
    return this.totLifts().invoke('text');
  }

  verifyTotalLiftsinUI() {
    const liftNumberFromUI = this.getLiftCounts().toString();
    const result = this.getLiftsField().should('exist');

    if (result) {
      this.getLiftsField().clear();
      this.getLiftsField().type(liftNumberFromUI);
    }
  }

  // ------------------------ KEY IN SAME TIME UI validation ------------------------------
  getStartTimeError() {
    return cy.get('.alert-routeClose.ng-star-inserted').first();
  }

  getDisposalTimeError() {
    return cy.get('.alert-routeClose.ng-star-inserted').last();
  }

  sameTimeValidation() {
    let startTimeErrorMessage;

    this.getStartTimeError().then(startTimeError => {
      startTimeErrorMessage = startTimeError.attr('innerText');
    });

    return startTimeErrorMessage;
  }

  disposaleTimeValidation() {
    let disposalTimeErrorMessage;

    this.getDisposalTimeError().then(disposalTimeError => {
      disposalTimeErrorMessage = disposalTimeError.attr('outerText');
    });

    return disposalTimeErrorMessage;
  }

  verifyErrorMessageForElement(errorMessage: string, elemError: string) {
    const elemToGet = elemError.includes('start')
      ? this.getStartTimeError()
      : this.getDisposalTimeError();

    elemToGet.invoke('text').then($elemErrorText => {
      expect($elemErrorText.trim()).to.equal(errorMessage);
    });
  }

  // ------------------------ OPEN ROUTE SECTION -----------------------------------

  getOpenRouteTable() {
    return cy.get('open-route');
  }

  getClockInCell() {
    return cy.get('#open-clock-in');
  }

  verifyClockInFieldIsNotDisabled() {
    this.getClockInCell().should('not.have.attr', 'disabled');
  }

  getLeaveCell() {
    return cy.get('#open-leave-yard');
  }

  getBeginMileageCell() {
    return cy.get('#open-start-mileage');
  }

  // ------------------------LOAD TIME AND DISPOSAL SITE SECTION ------------------

  loadTimePlusButton() {
    return cy.contains('Load Times & Disposal Sites').find('i');
  }

  containerLoadTimesAndDisposalSites() {
    return cy.contains('Load Times & Disposal Sites').parent();
  }

  startFieldLoad1() {
    return cy.get('#loads-lc-start-time-0');
  }

  startOne() {
    return cy.get('#loads-start-time-0');
  }

  startFieldLoad2() {
    return cy.get('#loads-start-time-1');
  }

  mileageStartLoad1() {
    return cy.get('tbody').eq(2).find('input[formcontrolname="startMileage"]');
  }

  getMileageFieldLoad1() {
    return cy.get('#loads-finish-mileage-0');
  }

  mileageStartLoad2() {
    return cy.get('tbody').eq(3).find('input[formcontrolname="startMileage"]');
  }

  getFinishFieldLoad1() {
    return cy.get('#loads-finish-time-0');
  }

  getFinishFieldLoad2() {
    return cy.get('#loads-finish-time-1');
  }

  getLiftsField() {
    return cy.get('input[formcontrolname="lifts"]');
  }

  lifts1() {
    return cy.get('input#loads-lifts-0');
  }

  getMileageFieldLoad2() {
    return cy.get('#loads-finish-mileage-1');
  }

  getTicketField() {
    return cy.get('#loads-ticket-number-0');
  }

  getTicketFieldLoad2() {
    return cy.get('#loads-ticket-number-1');
  }

  getQuantityField() {
    return cy.get('#loads-lc-quantity-0');
  }

  getQuantityFieldLoad1() {
    return cy.get('#loads-quantity-0');
  }

  getTimeInFieldLoad1() {
    return cy.get('#loads-in-time-0');
  }

  getTimeOutLoad1() {
    return cy.get('#loads-out-time-0');
  }

  mileageLoad3() {
    return cy.get('#loads-mileage-0');
  }

  getContainerLoad2() {
    return cy.get('loads').find('p-table').eq(1).find('div').first();
  }

  getSiteDropDownContainer() {
    return cy.get('p-dropdown[formcontrolname="site"]');
  }

  getSiteDropDownLabel() {
    return this.getSiteDropDownContainer().find('span').first();
  }

  getSiteDropDownSearchField() {
    return cy.get('.p-dropdown-filter-container').find('input');
  }

  getSaveButton() {
    return cy.get('#route-closing-details-save-buton');
  }

  verifyTableIsPresentInLoadTimesSection() {
    this.containerLoadTimesAndDisposalSites().find('p-table').should('be.visible');
  }

  setTotalLifts() {
    this.getTotalLifts().then($totLiftsText => {
      this.getLiftsField().type($totLiftsText);
    });
  }

  // -------------------------------CLOSE ROUTE SECTION --------------------------

  getReturnFieldInCloseRoute() {
    return cy.get('#close-start-time');
  }

  getEndMilageFieldInCloseRoute() {
    return cy.get('#close-finish-mileage');
  }

  getClockOutFieldInCloseRoute() {
    return cy.get('#close-finish-time');
  }

  inputDataToEndMileage(inputValue: string) {
    this.getEndMilageFieldInCloseRoute().type('{ctrl}a');
    this.getEndMilageFieldInCloseRoute().type(inputValue);
  }

  inputDataClockOut() {
    this.getReturnFieldInCloseRoute().type('1000');
    this.getClockOutFieldInCloseRoute().type('1100');
    cy.wait(3000);
    this.getEndMilageFieldInCloseRoute().type('1400');
  }

  verifySaveDisabled() {
    this.getSaveButton().should('be.disabled');
  }

  // -------------------Supplemental Service DropDown Disabled ----------------------------
  serviceDropdownForSupplemental() {
    return cy
      .get('.extra-service-tag')
      .contains('SUPPLEMENTAL')
      .parentsUntil('p-table')
      .last()
      .within(() => {
        cy.get('p-dropdown[formcontrolname="serviceCode"]');
      });
  }

  // ---------------------------- REPLACE DRIVER ----------------------------

  getReplaceDriverButton() {
    return cy.get('#replacement-driver-button');
  }

  getReplaceTruckButton() {
    return cy.get('#replacement-truck-button');
  }

  newDriverStartTime() {
    return cy.get('#driver-start-time');
  }

  previousDriverEndTime() {
    return cy.get('#driver-finish-time');
  }

  replacementDriverMilage() {
    return cy.get('#driver-finish-mileage');
  }

  replacementDriverDropdown() {
    return cy.get(`p-dropdown[inputid='employee1'] span`).first();
  }

  replaceFirstDriver() {
    return cy.get(':nth-child(6) > .p-ripple > .ng-star-inserted');
  }

  replaceNonHighlightedDriver() {
    return cy.get(`p-dropdown[inputid='employee1'] span`).eq(3);
  }

  driverToReplace(driverName) {
    return cy.get('p-dropdownitem').find('span').contains(driverName);
  }

  replaceDriverBackButton() {
    return cy.get('#replacement-back-button');
  }

  replaceDriverSubmitButton() {
    return cy.get('#replacement-driver-submit-button');
  }

  // ------------------------- REPLACE TRUCK ---------------------------
  getReplaceTruckModal() {
    return cy.get('replacement-modal');
  }

  newTruckStartTime() {
    return cy.get('#truck-start-time');
  }

  newTruckStartMilage() {
    return cy.get('#truck-start-mileage');
  }

  previousTruckEndTime() {
    return cy.get('#truck-finish-time');
  }

  previousTruckEndMilage() {
    return cy.get('#truck-finish-mileage');
  }

  newTruckDropdown() {
    return cy.get("p-dropdown[inputid='truck-number'] span").first();
  }

  truckToReplace() {
    return cy.get('p-dropdownitem').eq(0).find('li').eq(0);
  }

  truckReplace() {
    return cy.get('p-dialog').find('li').eq(0);
  }

  replaceNonHighlightedTruck() {
    return cy.xpath(`//p-dropdownitem//li[contains(@class,'highlight')]/following::li[1]/span`);
  }

  replaceTruckPopUpDetails(
    prevTruckEndTime,
    newTruckStartTime,
    prevTruckEndMileage,
    newTruckStartMileage
  ) {
    this.previousTruckEndTime().clear().type(prevTruckEndTime);
    this.newTruckStartTime().clear().type(newTruckStartTime);
    this.newTruckDropdown().click();
    this.truckToReplace().click();
    this.newTruckStartMilage().clear().type(newTruckStartMileage);
    this.previousTruckEndMilage().clear().type(prevTruckEndMileage);
  }

  // ------------------------IFTA MILEAGE MODULE ----------------------------

  milage() {
    return cy.xpath("//div[contains(@class,'modal-body')]/div[1]");
  }

  mileageInput1() {
    return cy.get('#ifta-mileage-0');
  }

  IFTAMileageModule() {
    this.milage()
      .invoke('text')
      .then(totalMileagetext => {
        const totalMileage = totalMileagetext.substr(
          totalMileagetext.indexOf(':') + 2,
          totalMileagetext.length
        );

        cy.get('#ifta-mileage-0').clear();
        cy.get('#ifta-mileage-0').type(totalMileage);
      });
  }

  // ---------------- compare mileage between End and Close modals -------------------------------

  closeInputMileage() {
    return cy
      .get('.modal-body')
      .find('.ifta-mileage-modal__fields-container')
      .find('.ifta-mileage-modal__line')
      .first()
      .find('.ifta-mileage-modal__line-field.middle')
      .find('span');
  }

  getIFTAMileageCloseModule() {
    return this.closeInputMileage();
  }

  // ---------------------------- B-TICKET ---------------------------

  getTicketLoadByName(ticketName) {
    return cy.get('tr[formarrayname="tickets"]').find('td').contains(ticketName).parent();
  }

  getTicketNumberInputField() {
    return cy.get('input[formcontrolname="ticketNumber"]');
  }

  getTicketQuantityInputField() {
    return cy.get('input[formcontrolname="quantity"]');
  }

  getContractGroupButtonOnTicket() {
    return cy.get('.table-ticket-btn');
  }

  getContractGroupCellOnTicket() {
    return cy.get('.contract-group-cell');
  }

  ticketLoad2() {
    return cy.xpath('//tr[3]//td[7]//input[1]');
  }

  quantityLoad2() {
    return cy.xpath('//tr[3]//td[8]//input[1]');
  }

  inputTicketNumberForTicket(ticketName: string, number: string) {
    this.getTicketLoadByName(ticketName).within(() => {
      this.getTicketNumberInputField().type(number);
    });
  }

  inputQuantityForTicket(ticketName: string, qty: string) {
    this.getTicketLoadByName(ticketName).within(() => {
      this.getTicketQuantityInputField().type(qty);
    });
  }

  clickContactGroupButtonForTicket(ticketName: string) {
    this.getTicketLoadByName(ticketName).within(() => {
      this.getContractGroupButtonOnTicket().first().click();
    });
  }

  verifyContractGroupOnTicket(ticketName: string) {
    this.getTicketLoadByName(ticketName).within(() => {
      this.getContractGroupCellOnTicket();
    });
  }

  bTicketInputFields() {
    this.getTicketField().type('4');
    this.getQuantityFieldLoad1().type('1');
  }

  getTicketLoad1() {
    return cy.xpath('//tr[2]//td[7]//input[1]');
  }

  getQuantityLoad1() {
    return cy.xpath('//tr[2]//td[8]//input[1]');
  }

  bTicketInputFirstField() {
    this.getTicketLoad1().type('4');
    this.getQuantityLoad1().type('1');
  }

  bTicketInputSecondField() {
    this.ticketLoad2().type('3');
    this.quantityLoad2().type('1');
  }

  //  --------------------------RESEQUENCE --------------------

  sourceStop() {
    return cy.get('div.ui-table-scrollable-body > table > tbody > tr:nth-child(1)');
  }

  destinationStop() {
    return cy.get('div.ui-table-scrollable-body > table > tbody > tr:nth-child(2)');
  }

  dragResequenceStop() {
    const dataTransfer = new DataTransfer();

    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('tr.resequence-row-enabled')
      .eq(1)
      .trigger('mousedown', { eventConstructor: 'MouseEvent', force: true })
      .trigger('dragstart', { dataTransfer });

    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('tr.resequence-row-enabled')
      .eq(0)
      .trigger('mousemove', { eventConstructor: 'MouseEvent', force: true })
      .trigger('mouseup', { eventConstructor: 'MouseEvent', force: true })
      .trigger('dragenter')
      .trigger('dragover', { dataTransfer })
      .trigger('drop');

    cy.get('tr.resequence-row-enabled').eq(1).trigger('dragend');
  }

  // ------------------------- LOAD SUSPEND --------------------------

  serviceCodeDropdown(sequence: string) {
    return cy
      .get('.account-info-col')
      .contains(` ${sequence} `)
      .parent()
      .find('p-dropdown[formcontrolname="serviceCode"]');
  }

  getServiceCodeDropdownForNewRecordByAcctNumber(accountNumber: string) {
    const containsStatement = `:contains(${accountNumber})`;

    return cy
      .get('.account-info-container')
      .filter(containsStatement)
      .last()
      .parent()
      .find('p-dropdown[formcontrolname="serviceCode"]');
  }

  changeServiceCode(elem, expectedServiceCode) {
    const dropdownTextTrimmed = elem.text().trim().substr(0, 3);
    const expectedServiceCodeTrimmed = expectedServiceCode.trim().substr(0, 3);

    cy.log(`dropdown: ${dropdownTextTrimmed} expected: ${expectedServiceCodeTrimmed}`);
    if (dropdownTextTrimmed !== expectedServiceCodeTrimmed) {
      cy.wrap(elem).click();
      cy.get('input.p-dropdown-filter').clear();
      cy.get('input.p-dropdown-filter').type(expectedServiceCode);
      cy.get('li').should('not.have.attr', 'class', 'p-disabled');
      cy.get('li').contains(expectedServiceCode).click();

      if (!expectedServiceCode.includes('SUSPEND')) {
        homepage.popUpMessage().should('be.visible');
        homepage.popUpMessage().should('not.exist');
      }
      cy.wait(10000);
    }
  }

  selectServiceInServiceCodeDropdown(sequence: string, expectedServiceCode: string) {
    this.serviceCodeDropdown(sequence).then(elem => {
      this.changeServiceCode(elem, expectedServiceCode);
    });
  }

  selectServiceInServiceCodeDropdownInLCLoad(load, expectedServiceCode) {
    this.getLoadLargeContainerByIndex(load - 1)
      .find('p-dropdown[formcontrolname="serviceCode"]')
      .then(elem => {
        this.changeServiceCode(elem, expectedServiceCode);
      });
  }

  verifyServiceCodeForRecord(recordType, serviceCode, account, overrideQueryData = false) {
    const serviceCodeElement = this.getServiceCodeElement(
      recordType,
      serviceCode,
      account,
      overrideQueryData
    );

    serviceCodeElement
      .should('be.visible')
      .invoke('text')
      .then(dropdownValue => {
        expect(serviceCode).to.be.equal(dropdownValue);
      });
  }

  // Extracted method to get Service Code Element
  getServiceCodeElement(recordType, serviceCode, account, overrideQueryData) {
    return overrideQueryData
      ? recordType === 'old'
        ? this.serviceCodeDropdown(serviceCode)
        : this.getServiceCodeDropdownForNewRecordByAcctNumber(account)
      : recordType === 'old'
        ? this.serviceCodeDropdown(queryData?.sequence)
        : this.getServiceCodeDropdownForNewRecordByAcctNumber(queryData?.account);
  }

  serviceCodeSendKeys(sequence: string) {
    return cy.xpath(
      `//div[@class="account-info-col"][text()=" ${sequence} "]/../div[@class='account-info-col']//input[starts-with(@class, 'ui-dropdown-filter')]`
    );
  }

  serviceCodeSendKeysPupTrailer() {
    return cy.get('input.ui-dropdown-filter');
  }

  serviceCodeValue(text) {
    return cy.get('p-dropdownitem').find('span').contains(text);
  }

  suspendDialogue() {
    return cy.get("div[role='dialog']");
  }

  dropdownValue(expectedServiceCode: any) {
    this.serviceCodeDropdown(queryData.sequence).click();
    cy.wait(2000);
    this.serviceCodeSendKeys(queryData.sequence).clear();
    cy.wait(2000);
    cy.log(`Enter the Service Code as :${expectedServiceCode}`);
    this.serviceCodeSendKeys(queryData.sequence).type(expectedServiceCode);
    cy.wait(2000);
    this.serviceCodeValue(expectedServiceCode).click();
  }

  verifySusLoadPage(loadpage) {
    return cy.contains('p', loadpage);
  }

  verifySuspendLoadPage(value: any) {
    this.verifySusLoadPage(value).should('be.visible');
  }

  assignSuspendLoadRoute(assign) {
    const buttonToClick = assign === 'Yes' ? 'input#assign-true' : 'input#assign-false';

    cy.get(buttonToClick).click();

    return this;
  }

  clickChooseRouteDropdown() {
    return cy.get('p-dropdown[formcontrolname="targetRouteNumber"]');
  }

  dropdownValueSpan(differentRoute) {
    return cy.get('p-dropdownitem').find('span').contains(differentRoute);
  }

  chooseRoute(route: string) {
    this.clickChooseRouteDropdown().should('be.visible');
    if (route === 'Different route') {
      this.clickChooseRouteDropdown().click();
      this.dropdownValueSpan(queryData.routeNumberDifferent).click();

      return this;
    }

    return this;
  }

  fillSuspendLoadAssignRoute(assign: string, route: string) {
    this.assignSuspendLoadRoute(assign);
    if (assign === 'Yes') {
      return this.chooseRoute(route);
    }
    this.dropDownSuspensionReasonCode().should('not.have.text', 'empty');
  }

  radioButtonSuspendBefore() {
    return cy.get('input#before');
  }

  radioButtonSuspendAfter() {
    return cy.get('input#after');
  }

  dropDownSuspensionReasonCode() {
    return cy.get('p-dropdown[formcontrolname="reasonCode"]');
  }

  fillSuspendLoadSuspension(suspension: string) {
    const radioButton =
      suspension === 'before' ? this.radioButtonSuspendBefore() : this.radioButtonSuspendAfter();

    radioButton.click();
  }

  invisibilityOfSusupendDialog() {
    this.suspendDialogue().should('not.exist');
  }

  verifySuccessMessage(message) {
    this.modalContent().find('p.alert-success').should('have.text', message);
  }

  verifyOldLoadRecord(value: any) {
    this.serviceCodeDropdown(queryData.sequence)
      .should('be.visible')
      .invoke('text')
      .then(dropdownValue => {
        expect(value).to.be.equal(dropdownValue);
      });
  }

  verifynewRecord(value: any) {
    this.getServiceCodeDropdownForNewRecordByAcctNumber(queryData.account)
      .should('be.visible')
      .invoke('text')
      .then(dropdownValue => {
        expect(dropdownValue).to.be.equal(value);
      });
  }

  // -----------------------------MULTIPLE TRUCK AND DRIVER ----------------------

  openRoutedetails(clockIn, leaveYard, beginMileage) {
    this.getOpenRouteTable().should('be.visible').scrollIntoView();
    this.getClockInCell().clear().type(clockIn);
    this.getLeaveCell().clear().type(leaveYard);
    this.getBeginMileageCell().clear().type(beginMileage);
  }

  ticketOne() {
    return cy.get('input#loads-lc-ticket-number-0');
  }

  timeInOne() {
    return cy.get('#loads-lc-in-time-0');
  }

  timeOutOne() {
    return cy.get('#loads-lc-out-time-0');
  }

  finishOne() {
    return cy.get('#loads-lc-finish-time-0');
  }

  receiptOne() {
    return cy.get('#loads-lc-receipt-0');
  }

  insertQuantity(quantity: string) {
    return this.getQuantityFieldLoad1().type(quantity);
  }

  insertQuantityLC(quantity: string) {
    return this.getQuantityField().type(quantity);
  }

  changeSite(type) {
    this.getSiteDropDownLabel().click();
    this.getSiteDropDownSearchField().click();
    this.getSiteDropDownSearchField().type(type);
    this.getSiteDropDownSearchField().type('{downarrow}');
    this.getSiteDropDownSearchField().type('{enter}');
  }

  // =================== SWG input ====================

  enterLoadDataForPUPTrailerByIndex(index, startLoad, ticketNo, quantity, finishLoad, receipt) {
    this.getLoadLargeContainerByIndex(index).within(() => {
      this.getStartTimeInputField().clear().type(startLoad);
      this.siteNumberDropdown().then($siteText => {
        if ($siteText.text().trim() === '') {
          if ($siteText.text().trim() === '') {
            if ($siteText.text().trim() === '') {
              this.siteNumberDropdown().click().type('{downarrow},{enter}');
            }
          }
        }
      });
      this.getTicketNumberInputField().clear({ force: true }).type(ticketNo);
      this.getQuantityInputField().clear().type(quantity);
      this.getFinishTimeInputField().then($inputField => {
        if ($inputField.not('disabled')) {
          this.getFinishTimeInputField().clear().type(finishLoad);
        }
      });
      if (receipt !== 'None') {
        const result = this.getReceiptInputField().should('be.visible');

        if (result) {
          this.getReceiptInputField().clear().type(receipt);
        }
      } else {
        this.getReceiptInputField().click();
      }
    });
  }

  swingMessage() {
    return cy.get('.alert-routeClose.ng-star-inserted').last();
  }

  startTwo() {
    return cy.get('#loads-lc-start-time-1');
  }

  startThree() {
    return cy.get('#loads-lc-start-time-2');
  }

  startFour() {
    return cy.get('#loads-lc-start-time-3');
  }

  ticketTwo() {
    return cy.get('input#loads-lc-ticket-number-1');
  }

  quantityTwo() {
    return cy.get('#loads-lc-quantity-1');
  }

  timeInTwo() {
    return cy.get('#loads-lc-in-time-1');
  }

  timeOutTwo() {
    return cy.get('#loads-lc-out-time-1');
  }

  finishTwo() {
    return cy.get('#loads-lc-finish-time-1');
  }

  finishThree() {
    return cy.get('#loads-lc-finish-time-2');
  }

  ticketFour() {
    return cy.get('input#loads-lc-ticket-number-3');
  }

  quantityFour() {
    return cy.get('#loads-lc-quantity-3');
  }

  timeInFour() {
    return cy.get('#loads-lc-in-time-3');
  }

  timeOutFour() {
    return cy.get('#loads-lc-out-time-3');
  }

  finishFour() {
    return cy.get('#loads-lc-finish-time-3');
  }

  receiptTwo() {
    return cy.get('#loads-lc-receipt-1');
  }

  receiptThree() {
    return cy.get('#loads-lc-receipt-2');
  }

  receiptFour() {
    return cy.get('#loads-lc-receipt-3');
  }

  ticketThree() {
    return cy.get('input#loads-lc-ticket-number-2');
  }

  quantityThree() {
    return cy.get('#loads-lc-quantity-2');
  }

  timeInThree() {
    return cy.get('#loads-lc-in-time-2');
  }

  timeOutThree() {
    return cy.get('#loads-lc-out-time-2');
  }

  replacement() {
    return cy.get('button#route-closing-details-replacement-button');
  }

  scrollUp() {
    this.replacement().type('{pageup}');
  }

  endButton() {
    return cy.get('button#route-closing-details-end-close-buton');
  }

  // ---------------------PUP Trailer Validations-----------------------------

  enterThirdLoadDataWithPupTrailerAfterSuspend(startLoad, finishLoad, receipt) {
    this.startThree().clear();
    this.startThree().type(startLoad);
    this.finishThree().clear();
    this.finishThree().type(finishLoad);

    const result = this.receiptThree().should('exist');

    if (result) {
      this.receiptThree().clear();

      this.receiptThree().type(receipt);
    }
  }

  verifyTimeInTimeoutEnabled() {
    this.timeInThree().should('be.disabled');
    this.timeOutThree().should('be.disabled');
  }

  verifyTimeInTimeoutEnabledforLoad2() {
    this.timeInTwo().should('be.enabled');
    this.timeOutTwo().should('be.enabled');
  }

  // ---------------------Same Timein and timeout for Pup Trailer--------------------------------------

  inputLoadForPupTrailerLarge2forTimeinTimeout() {
    this.startTwo().type('{ctrl}a');
    this.startTwo().type('0501');
    this.ticketTwo().type('{ctrl}a');
    this.ticketTwo().type('Q3');
    this.quantityTwo().type('{ctrl}a');
    this.quantityTwo().type('1');
    this.finishTwo().type('{ctrl}a');
    this.finishTwo().type('0505');

    const result = this.receiptTwo().should('exist');

    if (result) {
      this.receiptTwo().type('{ctrl}a');
      this.receiptTwo().type('11000');
    }
  }

  timeInContainerA() {
    return cy.get('.pup-trailer-table-1').find('#loads-lc-in-time-0');
  }

  timeOutContainerA() {
    return cy.get('.pup-trailer-table-1').find('#loads-lc-out-time-0');
  }

  timeInContainerB() {
    return cy.get('.pup-trailer-table-2').find('#loads-lc-in-time-1');
  }

  timeOutContainerB() {
    return cy.get('.pup-trailer-table-2').find('#loads-lc-out-time-1');
  }

  // -----------------------DE23703-------------------------------------

  finishTimeContainerB() {
    return cy.get('.pup-trailer-table-2').find('#loads-lc-finish-time-1');
  }

  // ------------------------Test Cases---------------------------

  headerVerifyClosingRoute() {
    return cy.get('h1.section-title').contains('Route');
  }

  clickSus(susvalue: any) {
    return cy.get(`li[aria-label='${susvalue}']>span`);
  }

  verifyDropdownValue(expectedServiceCode: any) {
    this.headerVerifyClosingRoute().should('be.visible');
    this.selectServiceInServiceCodeDropdown(queryData.sequence, expectedServiceCode);
  }

  routeTable() {
    return cy.get('p-table').find('.ui-table.ui-widget');
  }

  routeTableIsDisplayed() {
    this.routeTable().should('be.visible');
  }

  routeNumber(route: string) {
    return cy.get('a').contains(route);
  }

  selectRouteNumber(route: string) {
    if (route === 'queried') {
      this.routeNumber(queryData.routeNumber).should('not.be.disabled');
      this.routeNumber(queryData.routeNumber).click();

      return true;
    }
    this.routeNumber(route).click();

    return true;
  }

  verifyTextDisplayed(addedData: string) {
    this.getBeginMileageCell().should('be.visible');
    this.getBeginMileageCell().should('have.value', addedData);
  }

  verifyStatus(rNum: string, statusUpdated: string) {
    let complete;

    this.getStatusByRouteNumber(rNum, statusUpdated).then(statusByRouteNumber => {
      complete = statusByRouteNumber.attr('innerText');
    });
    expect(complete).to.equals(statusUpdated);
    this.getStatusByRouteNumber(rNum, statusUpdated);
  }

  waitForStatus(route: string) {
    return cy
      .get('.ui-table.ui-widget')
      .find('a')
      .contains(route)
      .parentsUntil('tr')
      .last()
      .parent()
      .within(() => {
        cy.get('td').last();
      });
  }

  modalContent() {
    return cy.get('.p-dialog', { timeout: 10000 });
  }

  confirmYes() {
    return cy.get('button').contains('Yes');
  }

  confirmNo() {
    return cy.get('button').contains('No');
  }

  updateClockRtnTime(newReturnTime: string) {
    this.getReturnFieldInCloseRoute().clear().type(newReturnTime);

    return this;
  }

  moduleIFTA() {
    return cy.get('.ifta-mileage-modal');
  }

  verifyIFTAPopupIsPresent() {
    this.moduleIFTA().should('exist');
    this.moduleIFTA().should('be.visible');

    return this;
  }

  iftaOKBtn() {
    return cy.get('#ifta-submit-button');
  }

  milesRem() {
    return cy.get('.ifta-mileage-modal__line.text-success');
  }

  verifyMileRemValue(milesRemValue: any) {
    this.iftaOKBtn().should('not.be.disabled');
    this.milesRem()
      .invoke('text')
      .then(elText => {
        const textMilage = elText.split(': ')[1].trim();

        return expect(textMilage).to.equal(milesRemValue);
      });
  }

  verifyOKDisabled() {
    return this.iftaOKBtn()
      .should('be.disabled')
      .then(() => {
        cy.log(`OK Button is disabled and Miles Difference is not zero `);
      });
  }

  verifyUpdatedServiceCode(newServiceCode) {
    return db_routes.validateServiceCodeInDB(newServiceCode);
  }

  getDBCount() {
    return db_routes.getLoadCount();
  }

  mileageInput2() {
    return cy.get('#ifta-mileage-1');
  }

  replaceTruckMileage(mileage: string) {
    this.mileageInput2().clear().type(mileage);
  }

  updateLoadLCStartTime(newLoadStartTime: string) {
    this.startOne().clear();
    this.startOne().type(newLoadStartTime);
  }

  updateLoadStartTime(newLoadStartTime: string) {
    this.startFieldLoad1().clear();
    this.startFieldLoad1().type(newLoadStartTime);
  }

  verifyStatusComplete(route: string, status: string) {
    this.getStatusForRouteNumber(route)
      .invoke('text')
      .then(elemText => {
        return expect(elemText).to.equal(status);
      });
  }

  load2Table() {
    return cy.get('p-table').eq(1).find('table').eq(0);
  }

  removeButton() {
    return cy.get('button.remove-btn');
  }

  removeExtraLoadTable() {
    this.load2Table().should('be.visible');
    this.load2Table().within(() => {
      this.removeButton().click();
    });

    return this;
  }

  navigateToDifferentRouteNumber() {
    this.getRouteNumberLink(queryData.routeNumberDifferent).click();

    return this;
  }

  // ================== Pup Trailer =================

  pupTrailerButton() {
    return cy.get('#loads-lc-pup-trailer-button');
  }

  pupTrailerMessage() {
    return cy.get('.alert-warning.ng-star-inserted');
  }

  pupTrailerFirstCheckbox() {
    return cy.get('.p-checkbox-box').first();
  }

  pupTrailerLastCheckbox() {
    return cy.get('.p-checkbox-box').last();
  }

  pupTrailerOkButton() {
    return cy.get('#pup-trailer-submit-button');
  }

  pupTrailerAlert() {
    return cy.get('.p-toast-summary');
  }

  pupTrailerAlertDetail() {
    return cy.get('.p-toast-detail');
  }

  unlinkButton() {
    return cy.get('button.pup-unlink-btn');
  }

  // ================== Pup Trailer to link 2nd and 3rd stops=================

  pupTrailerSecondCheckbox() {
    return cy.get('pup-trailer-modal').find('p-checkbox').eq(1);
  }

  pupTrailerThirdCheckbox() {
    return cy.get('pup-trailer-modal').find('p-checkbox').eq(2);
  }

  // ================ Contract Group ===================

  getContractGroupModal() {
    return cy.get('contract-group-modal');
  }

  contractGroupSelectCheckboxNumber() {
    return cy.get('p-checkbox input#contract-list-checkbox-1');
  }

  contractGroupOkButton() {
    return cy.get('#contract-submit-button');
  }

  contractGroupDisplayedOnUI() {
    return cy.get('.table-load-caption.load-assignment');
  }

  contractGroup() {
    return cy.get('#loads-contract-group-button-0').find('.fa-plus-square');
  }

  selectRecordInContractGoupModalByNumber() {
    this.contractGroupSelectCheckboxNumber().scrollIntoView();
    this.contractGroupSelectCheckboxNumber().click({ force: true });
    this.contractGroupOkButton().should('not.be.disabled');
    this.contractGroupOkButton().click();
    this.getContractGroupModal().should('not.be.visible');
  }

  // -----------------------Container Group for LC--------------------

  containerGroupLC() {
    return cy.get('.account-info-col:nth-child(6)');
  }

  // ================ Replecement Truck New validation ===================
  inputLoadForLoad3LCNoDisposal(startLoadThree, finishLoadThree, receiptThree) {
    this.startThree().clear().type(startLoadThree);
    this.finishThree().clear().type(finishLoadThree);

    const result = this.receiptTwo().should('exist');

    if (result) {
      this.receiptThree().clear().type(receiptThree);
    }
  }

  inputLoadForLoad2LCNoDisposal(startLoadTwo, finishLoadTwo, receiptTwo) {
    this.startTwo().clear().type(startLoadTwo);
    this.finishTwo().clear().type(finishLoadTwo);

    const result = this.receiptTwo().should('exist');

    if (result) {
      this.receiptTwo().clear().type(receiptTwo);
    }
  }

  replacementDriverLC(prevDriverEndTime, newDriverStartTime) {
    this.newDriverStartTime().type(newDriverStartTime);
    this.previousDriverEndTime().type(prevDriverEndTime);

    this.replacementDriverDropdown().click();
    this.replaceFirstDriver().scrollIntoView().click();
  }

  replacementDriverSC(previousDriverEndTime, newDriverStartTime, millage?) {
    let replaceDriver;

    this.previousDriverEndTime().clear().type(previousDriverEndTime);
    this.newDriverStartTime().clear().type(newDriverStartTime);
    if (millage) {
      cy.get('#driver-finish-mileage').type(millage);
    }
    this.replacementDriverDropdown().then(replacementDriverDropdown => {
      replaceDriver = replacementDriverDropdown.text();
      cy.log('replace driver');
    });
    this.replacementDriverDropdown().click({ force: true });
    cy.log('clicking on the dropdown');
    if ((replaceDriver === 'Select Driver') !== null) {
      cy.log('cheking if condition');
      this.replaceFirstDriver().click({ force: true });
      cy.log('Clicking on tne replace driver');
    } else {
      this.replaceNonHighlightedDriver().click({ force: true });
    }
  }

  enterLoadDataLCByIndex(
    index,
    startLoad,
    ticketNo,
    quantity,
    dispTimeIn,
    dispTimeOut,
    finishLoad,
    receipt
  ) {
    this.getLoadLargeContainerByIndex(index).within(() => {
      this.getStartTimeInputField().clear().type(startLoad);
      this.siteNumberDropdown().then($siteText => {
        if ($siteText.text().trim() === '') {
          this.siteNumberDropdown().click().type('{downarrow},{enter}');
        }
      });
      this.getTicketNumberInputField().clear().type(ticketNo);
      this.getQuantityInputField().clear().type(quantity);
      this.getTimeInInputField().clear().type(dispTimeIn);
      this.getTimeOutInputField().clear().type(dispTimeOut);

      this.getFinishTimeInputField().clear().type(finishLoad);
      if (receipt !== 'None') {
        const result = this.getReceiptInputField().should('be.visible');

        if (result) {
          this.getReceiptInputField().clear().type(receipt);
        }
      } else {
        this.getReceiptInputField().click();
      }
    });
  }

  replacementValidation() {
    return cy.get('.alert-routeClose.ng-star-inserted');
  }

  // --------------------------Replacement Driver Validation-----------------------//

  replacementDriverValidation() {
    return cy.get('.alert-warning.form-error.ng-star-inserted');
  }

  cancelOnReplaceDriver() {
    return cy.get('button').contains('Cancel');
  }

  // -------------------- SWG Finish Load disabled--------------------

  enterFirstLoadDataLCSWG(startLoad, ticketNo, quantity, dispTimeIn, dispTimeOut, receipt) {
    this.startFieldLoad1().type(startLoad);
    this.siteNumberDropdown().click();
    this.getSiteDropDownSearchField().click();
    this.getSiteDropDownSearchField().type('{downarrow}');
    this.getSiteDropDownSearchField().type('{enter}');
    this.ticketOne().type(ticketNo);
    this.getQuantityField().type(quantity);

    this.timeInOne().type(dispTimeIn);
    this.timeOutOne().type(dispTimeOut);
    const result = this.receiptOne().should('exist');

    if (result) {
      this.receiptOne().type(receipt);
    }
  }

  serviceCodeChangeMessage(message) {
    this.modalContent()
      .find('p.confirm-modal__message')
      .invoke('text')
      .then($elText => {
        expect($elText.trim()).to.equal(message);
      });
  }

  // ----------------Special Waste column-----------------------------

  specialWasteColumn() {
    return cy.get('h3').contains('Special Handling:');
  }

  // -------------------------------Disposal Button--------------------------------

  disposalButton() {
    return cy.get('button').contains(' Disposal');
  }

  disposalBTicketButton() {
    return cy.get('.table-ticket-btn').last();
  }

  // =============== verify resequence CG,compactor and Size ===========

  getContainerGroupInLoadTable() {
    return cy
      .get('p-table[formarrayname="loadLC"]')
      .first()
      .find('.account-info-container')
      .find(' .account-info-col')
      .eq(5);
  }

  getContainerSizeInLoadTable() {
    return cy
      .get('p-table[formarrayname="loadLC"]')
      .first()
      .find('.account-info-container')
      .find('.account-info-col')
      .eq(1);
  }

  getCompactorInLoadTable() {
    return cy
      .get('p-table[formarrayname="loadLC"]')
      .first()
      .find('.account-info-container')
      .find('.account-info-col')
      .eq(2);
  }

  getContainerGroupInResequenceModal() {
    return cy
      .get('resequence-modal')
      .find('p-table')
      .find('.resequence-row-enabled')
      .first()
      .find('.p-datatable-reorderablerow-handle')
      .eq(3);
  }

  getContainerSizeInResequenceModal() {
    return cy
      .get('resequence-modal')
      .find('p-table')
      .find('.resequence-row-enabled')
      .first()
      .find('.p-datatable-reorderablerow-handle')
      .eq(4);
  }

  getCompactorInResequenceModal() {
    return cy
      .get('resequence-modal')
      .find('p-table')
      .find('.resequence-row-enabled')
      .first()
      .find('.p-datatable-reorderablerow-handle')
      .eq(5);
  }

  compareContainerSizeInLoadTableAndResequenceModal() {
    this.getContainerSizeInLoadTable()
      .invoke('text')
      .then(elemText => {
        const elemTextTrimmed = elemText.split(' ')[1];

        cy.wrap(elemTextTrimmed).as('containerSizeText');
      });
    this.getContainerSizeInResequenceModal().invoke('text').as('containerResqSizeText');

    cy.get('@containerSizeText').then(containerSizeText => {
      cy.get('@containerResqSizeText').then(containerResqSizeText => {
        expect(containerSizeText).to.equal(containerResqSizeText);
      });
    });
  }

  compareCompactorInLoadTableAndResequenceModal() {
    this.getCompactorInLoadTable()
      .invoke('text')
      .then(elemText => {
        const elemTextTrimmed = elemText.trim();

        cy.wrap(elemTextTrimmed).as('containerCompactorText');
      });

    this.getCompactorInResequenceModal()
      .invoke('text')
      .then(elemText => {
        const elemTextTrimmed = elemText.trim();

        cy.wrap(elemTextTrimmed).as('containerResCopactorText');
      });

    cy.get('@containerCompactorText').then(containerCompactorText => {
      cy.get('@containerResCopactorText').then(containerResCopactorText => {
        expect(containerCompactorText).to.equal(containerResCopactorText);
      });
    });
  }

  compareContainerGroupInLoadTableAndResequenceModal() {
    this.getContainerGroupInLoadTable()
      .invoke('text')
      .then(elemText => {
        const elemTextTrimmed = elemText.trim();

        cy.wrap(elemTextTrimmed).as('containerGrpHeaderText');
      });
    this.getContainerGroupInResequenceModal().invoke('text').as('containerResqGrpText');

    cy.get('@containerGrpHeaderText').then(containerGrpHeaderText => {
      cy.get('@containerResqGrpText').then(containerResqGrpText => {
        expect(containerGrpHeaderText).to.equal(containerResqGrpText);
      });
    });
  }

  // Verify that conatiner group, size and compactor are the same
  // in load table and in resequence modal
  verifyContainerInfo() {
    this.compareContainerGroupInLoadTableAndResequenceModal();
    this.compareContainerSizeInLoadTableAndResequenceModal();
    this.compareCompactorInLoadTableAndResequenceModal();
  }

  // -------------------------------Route close modal for single and multiple select--------------------------------
  routeCloseCheckBox() {
    return cy.get('p-tablecheckbox').find("div[class='p-checkbox-box p-component']").first();
  }

  firstRouteCloseCheckBox() {
    return cy.get('p-tablecheckbox').find("div[class='p-checkbox-box p-component']").first();
  }

  nextRouteCloseCheckBox() {
    return cy.get('p-tablecheckbox').find("div[class='p-checkbox-box p-component']").last();
  }

  closeSelectedRouteButton() {
    return cy.contains('Close Selected Routes');
  }

  closeSelectedRoutesButton() {
    return cy.get('#filters').find('button');
  }

  closeRouteCount() {
    return cy.get('.caption-right').last();
  }

  closeSelectedRoute() {
    this.closeSelectedRouteButton()
      .invoke('text')
      .then($elButtonText => {
        expect($elButtonText.trim()).to.equal('Close Selected Routes (1)');
      });
  }

  closeButtonOnModal() {
    this.endButton().scrollIntoView();
    this.endButton()
      .invoke('text')
      .then($endButtonText => {
        expect($endButtonText.trim()).to.equal('Close');
      });
  }
  closeButtonOnModal1() {
    this.endButton().click();
  }

  clickCloseSelectedRouteButton() {
    this.closeSelectedRouteButton().click();
  }

  firstEndedRouteSelected() {
    this.firstRouteCloseCheckBox().should('not.be.disabled');
    this.firstRouteCloseCheckBox().click();
  }

  nextEndedRouteSelected() {
    this.nextRouteCloseCheckBox().should('not.be.disabled');
    this.nextRouteCloseCheckBox().click();
  }

  countEndedRoutes() {
    this.closeRouteCount().should('exist');
    this.closeRouteCount()
      .invoke('text')
      .then(countText => {
        cy.log(`countText : ${countText}`);
        expect(countText).to.equal('1 of 1');
      });
  }

  closeMultipleRoutesbutton() {
    this.closeSelectedRoutesButton().should('not.be.disabled');
    this.closeSelectedRoutesButton().click({ multiple: true });
  }

  leftCount() {
    this.closeRouteCount().should('exist');
    this.closeRouteCount()
      .invoke('text')
      .then(leftCountText => {
        cy.log(`leftCountText : ${leftCountText}`);
        expect(leftCountText).to.equal('1 of 1');
      });
  }

  // -------------------------------Closing Route Errors Page--------------------------------
  getMileageLoad3() {
    return cy.get('#loads-mileage-0');
  }

  submitButton() {
    return cy.get('#replacement-truck-submit-button');
  }

  cancelButton() {
    cy.get('#replacement-cancel-button');
  }

  disposalDD() {
    return cy.get('p-dropdown[formcontrolname="disposal"]');
  }

  selectedDisposalOption() {
    return cy.get('li[aria-label="Yes"]');
  }

  siteNumberDropdown() {
    return cy.get('p-dropdown[formcontrolname="site"]').first();
  }

  closeRouteTable() {
    return cy.get('.table-group-col > close-route');
  }

  getLoadLargeContainerByIndex(index) {
    return cy.get('p-table[formarrayname="loadLC"]').eq(index);
  }

  getReceiptInputField() {
    return cy.get('input[formcontrolname="receipt"]');
  }

  getLoadSmallContainerByIndex(index) {
    return cy.get('p-table[formarrayname="load"]').eq(index);
  }

  getStartTimeInputField() {
    return cy.get('p-calendar[formcontrolname="startTime"]').find('input');
  }

  getMileageFieldSmallContainer() {
    return cy.get('input[formcontrolname="startMileage"]');
  }

  getFinishTimeInputField() {
    return cy.get('p-calendar[formcontrolname="finishTime"]').find('input');
  }

  getLiftsFieldSmallContainer() {
    return cy.get('input[formcontrolname="lifts"]');
  }

  getFinishMileageFieldSmallContainer() {
    return cy.get('input[formcontrolname="finishMileage"]');
  }

  getTicketNumberFieldSmallContainer() {
    return cy.get('input[formcontrolname="ticketNumber"]');
  }

  getQuantityInputField() {
    return cy.get('input[formcontrolname="quantity"]');
  }

  getTimeInInputField() {
    return cy.get('p-calendar[formcontrolname="inTime"]').find('input');
  }

  getTimeOutInputField() {
    return cy.get('p-calendar[formcontrolname="outTime"]').find('input');
  }

  getOutMileageFieldSmallContainer() {
    return cy.get('input[formcontrolname="mileage"]');
  }

  stopOneTable() {
    return cy.xpath("//p-table[contains(@formarrayname,'load')]", { timeout: 60000 });
  }

  getLCStopTable() {
    return cy.get('p-table[formarrayname="loadLC"] > div');
  }

  getPuptrailerLoadTable() {
    return cy.get('p-table[formarrayname="loadLC"] > div');
  }

  startOneSC() {
    return cy.xpath(
      '//*[@id="route-closing-form"]//p-table[@formarrayname="load"][1]//table//tbody//p-calendar[@formcontrolname="startTime"]//span/input'
    );
  }

  downTimeReason() {
    return cy.xpath('//p-dropdown[@placeholder="Reason"]');
  }

  downTimeReasonLabel(reason: any) {
    return cy.contains('span', reason);
  }

  downTimeStart() {
    return cy.get('#down-time-start-time-0');
  }

  downTimeFinish() {
    return cy.get('#down-time-finish-time-0');
  }

  downTimePlusButton() {
    return cy.contains('h2', 'Down Time').find('i');
  }

  downTimeRouteTable() {
    return cy.get('down-time').find('table');
  }

  start2() {
    return cy.xpath(
      '//*[@id="route-closing-form"]//p-table[2]//table/tbody/tr/td[1]/p-calendar/span/input'
    );
  }

  startMileage2() {
    return cy.xpath('//*[@id="route-closing-form"]//p-table[2]//table/tbody/tr/td[2]/input');
  }

  finish2() {
    return cy.xpath(
      '//*[@id="route-closing-form"]//p-table[2]//table/tbody/tr/td[3]/p-calendar/span/input'
    );
  }

  lifts2() {
    return cy.xpath('//*[@id="route-closing-form"]//p-table[2]//table/tbody/tr/td[4]/input');
  }

  finishMileage2() {
    return cy.xpath('//*[@id="route-closing-form"]//p-table[2]//table/tbody/tr/td[5]/input');
  }

  noDisposalCheckBox() {
    return cy.get('p-checkbox[formcontrolname="noDisposal"]');
  }

  quantity2() {
    return cy.xpath('//*[@id="route-closing-form"]//p-table[2]//table/tbody/tr/td[8]/input');
  }

  disposalTimeIn2() {
    return cy.xpath(
      '//*[@id="route-closing-form"]//p-table[2]//table/tbody/tr/td[10]/p-calendar/span/input'
    );
  }

  puptrailerCheckbox(stop) {
    return cy.xpath(`//tr[${stop}]//td[2]/../td/p-checkbox`);
  }

  disposalTimeOut2() {
    return cy.xpath(
      '//*[@id="route-closing-form"]//p-table[2]//table/tbody/tr/td[11]/p-calendar/span/input'
    );
  }

  disposalMileage2() {
    return cy.xpath('//*[@id="route-closing-form"]//p-table[2]//table/tbody/tr/td[12]/input');
  }

  noDisposalCheckBoxLoad2() {
    return cy.get('p-checkbox[formcontrolname="noDisposal"]').eq(1);
  }

  breakStart() {
    return cy.get('#breaks-start-time-0');
  }

  breakFinish() {
    return cy.get('#breaks-finish-time-0');
  }

  breakTimePlusButton() {
    return cy.contains('h2', 'Breaks').find('i');
  }

  breakRouteTable() {
    return cy.get('breaks').find('tbody');
  }

  dCheckBox() {
    return cy.get('div.ui-chkbox-box ui-widget ui-corner-all ui-state-default');
  }

  replacementMessage() {
    return cy.get('p.alert-warning.form-error.ng-star-inserted');
  }

  back() {
    return this.cancel().prev();
  }

  cancel() {
    return cy.contains('button', 'Cancel');
  }

  // Error Message #8: "Close Route Mileage must be greater than or equal to Most Recent Replacement Truck Start Mileage"
  replaceTruckPopup() {
    this.newTruckStartTime().type('{ctrl}a');
    this.newTruckStartTime().type('1017');
    this.previousTruckEndTime().type('{ctrl}a');
    this.previousTruckEndTime().type('1016');
    let replaceTruck;

    this.newTruckDropdown().then(Act_replaceTruck => {
      replaceTruck = Act_replaceTruck.text();
    });
    this.newTruckDropdown().click();
    if (replaceTruck === 'Select Truck') {
      this.truckReplace().click();
    } else {
      this.replaceNonHighlightedTruck().scrollIntoView().click();
    }
    this.newTruckStartMilage().type('{ctrl}a');
    this.newTruckStartMilage().type('190');
    this.previousTruckEndMilage().type('{ctrl}a');
    this.previousTruckEndMilage().type('170');
    this.submitButton().click();
    this.back().click();
    this.cancel().click();
  }

  // Error #9: Close Route Mileage must be greater than or equal to Most Recent Replacement Driver Mileage
  verifyreplaceDriverMileage() {
    this.previousDriverEndTime().clear();
    this.previousDriverEndTime().type('10:20');
    this.newDriverStartTime().clear();
    this.newDriverStartTime().type('10:24');
    let replaceDriver;

    this.replacementDriverDropdown().then(Act_replaceDriver => {
      replaceDriver = Act_replaceDriver.text();
    });
    this.replacementDriverDropdown().click();

    if (replaceDriver === 'Select Driver') {
      this.replaceFirstDriver().click();
    } else {
      this.replaceNonHighlightedDriver().scrollIntoView().click();
    }

    this.replacementDriverMilage().clear();
    this.replacementDriverMilage().type('220');
    this.button('Submit').click();
    this.button('Back').click();
    this.cancel().click();
  }

  // Error #26: Close route End Mileage must be greater than or equal to Last  Disposal Mileage
  verifyMileageWithLoad() {
    this.closeRouteTable().should('be.visible').should('not.be.disabled');
    this.getReturnFieldInCloseRoute().clear().type('1030');
    this.getClockOutFieldInCloseRoute().clear().type('1035');
    this.getEndMilageFieldInCloseRoute().clear().type('120');
  }

  enterFirstLoadBlockWithNoDisposalSC(startTime, startMileage, finishTime, finishMileage) {
    this.stopOneTable().should('be.visible');

    this.startOneSC().type(startTime);
    this.mileageStartLoad1().clear().type(startMileage);
    this.getFinishFieldLoad1().type(finishTime);

    this.totLifts().then(totLiftsValue => {
      const totalLiftsValue = totLiftsValue.text();

      cy.log(`Total Lifts value:${totalLiftsValue}`);
      this.lifts1().clear().type(totalLiftsValue);
    });
    this.getMileageFieldLoad1().clear().type(finishMileage);
    this.noDisposalCheckBox().should('be.visible');
    cy.document().then($document => {
      const documentResult = $document.querySelectorAll(
        `p-checkbox[formcontrolname="noDisposal"] div[aria-checked="true"]`
      );

      cy.log(`length: ${documentResult.length}`);
      if (documentResult.length === 0) {
        this.noDisposalCheckBox().click();
      }
    });
  }

  // Error Message #28: "Start Load Mileage must be greater than or equal to most recent Replacement Truck Start Mileage"
  enterSecondLoadBlockWithNoDisposalSC(startTime, startMileage, finishTime, lifts, finishMileage) {
    this.loadTimePlusButton().click();

    this.start2().clear().type(startTime);
    this.startMileage2().clear();
    this.startMileage2().type(startMileage);

    this.finish2().clear().type(finishTime);
    this.lifts2().clear();
    this.lifts2().type(lifts);
    this.finishMileage2().clear();
    this.finishMileage2().type(finishMileage);
    this.noDisposalCheckBoxLoad2().click();
  }

  submitReplacement() {
    this.button('Submit').should('be.enabled').click({ force: true });

    this.replaceDriverBackButton().should('be.enabled').click({ force: true });

    this.button('Cancel').should('be.enabled').click({ force: true });
    this.getReplacementPopup().should('not.exist');
  }

  createDownTimeInput() {
    this.downTimePlusButton().click();
    this.downTimeRouteTable().should('exist');
    this.downTimeRouteTable().trigger('mouseover').click();
  }

  fillInvalidReason() {
    this.downTimeRouteTable().should('be.visible');
    this.downTimeStart().type('10:15');
    this.downTimeFinish().type('10:30');
  }

  fillDownTimeInput(reason) {
    this.downTimeStart().clear().type('02:25');

    this.downTimeFinish().clear().type('02:45');

    this.downTimeReason().click();
    cy.wait(2000);
    this.downTimeReasonLabel(reason).click();
  }

  fillValidDownTime(reason) {
    this.downTimeRouteTable().should('not.be.disabled');
    this.downTimeStart().type('{ctrl}a');
    this.downTimeStart().type('09:00');
    this.downTimeFinish().type('{ctrl}a');
    this.downTimeFinish().type('09:30');
    this.downTimeReason().should('not.be.disabled');
    this.downTimeReason().click();
    cy.wait(2000);
    this.downTimeReasonLabel(reason).click();
  }

  fillDownTimeValues(startTime, finishTime, reason) {
    this.downTimeRouteTable().should('be.visible');
    this.downTimeStart().clear();
    this.downTimeStart().type(startTime);
    this.downTimeFinish().clear();
    this.downTimeFinish().type(finishTime);
    this.downTimeReason().should('be.visible');
    this.downTimeReason().click();
    cy.wait(2000);
    this.downTimeReasonLabel(reason).click();
  }

  fillOpenBlockWithDD() {
    this.getOpenRouteTable().should('be.visible');
    cy.wait(2000);
    this.getClockInCell().type('01:50');
    this.getLeaveCell().type('03:00');
    this.getBeginMileageCell().type('100');
    cy.document().then($document => {
      const documentResult = $document.querySelectorAll(
        `p-checkbox[formcontrolname="noDisposal"] div[aria-checked="true"]`
      );

      cy.log(`length: ${documentResult.length}`);
      if (documentResult.length === 1) {
        this.noDisposalCheckBox().click();
      }
    });
    this.disposalDD().click();
    this.selectedDisposalOption().click({ force: true });
  }

  closeRouteDetails(returnTime, clockOut, endMilage) {
    this.closeRouteTable().should('be.visible');
    this.getReturnFieldInCloseRoute().clear();
    this.getReturnFieldInCloseRoute().type(returnTime);
    this.getClockOutFieldInCloseRoute().clear();
    this.getClockOutFieldInCloseRoute().type(clockOut);
    this.getEndMilageFieldInCloseRoute().clear();
    this.getEndMilageFieldInCloseRoute().type(endMilage);
  }

  inputLoadBlockForLoadTC() {
    this.getTotalLifts().then($totLiftsText => {
      this.stopOneTable().should('exist');
      this.stopOneTable().trigger('mouseover');
      this.startOneSC().type('{ctrl}a');
      this.startOneSC().type('0500');
      this.getMileageFieldLoad1().clear().type('1100');
      this.getFinishFieldLoad1().clear().type('0600');
      this.lifts1().clear();
      this.lifts1().type($totLiftsText);
      this.getMileageFieldLoad2().clear().type('1200');
      this.getTicketField().clear().type('3');
      this.getQuantityFieldLoad1().clear().type('1');
      this.getTimeInFieldLoad1().clear().type('0610');
      this.getTimeOutLoad1().clear().type('0630');
      this.mileageLoad3().clear();
      this.mileageLoad3().type('1350');
    });
  }

  enterDataSmallContainer(
    load,
    startTime,
    startMileage,
    finishTime,
    finishMileage,
    disposalTimeIn,
    disposalTimeOut,
    disposalEndMileage,
    lifts
  ) {
    this.totLifts().then(totLiftsValue => {
      this.getLoadSmallContainerByIndex(load).within($elLoad => {
        this.getStartTimeInputField().clear().type(startTime);
        this.getMileageFieldSmallContainer().clear().type(startMileage);
        this.getFinishTimeInputField().clear().type(finishTime);
        if (load === 0) {
          const totalLiftsValue = totLiftsValue.text();

          cy.log(`Total Lifts value:${totalLiftsValue}`);
          this.getLiftsFieldSmallContainer().clear().type(totalLiftsValue);
        } else {
          this.getLiftsFieldSmallContainer().clear().type(lifts);
        }
        this.getFinishMileageFieldSmallContainer().clear().type(finishMileage);

        if (
          $elLoad.find('p-checkbox[formcontrolname="noDisposal"] div[aria-checked="true"]').length
        ) {
          cy.get(`p-checkbox[formcontrolname="noDisposal"] div[aria-checked="true"] span`).click();
        }
        this.siteNumberDropdown().then($siteText => {
          if ($siteText.text().trim() === '') {
            this.siteNumberDropdown().click().type('{downarrow},{enter}');
          }
        });
        this.getTicketNumberFieldSmallContainer()
          .clear()
          .type(load + 1);
        this.getQuantityInputField().clear().type('1');
        this.getTimeInInputField().clear().type(disposalTimeIn);
        this.getTimeOutInputField().clear().type(disposalTimeOut);
        this.getOutMileageFieldSmallContainer().clear().type(disposalEndMileage);
      });
    });
  }

  createBreakInput() {
    this.breakTimePlusButton().click();
    this.breakRouteTable().should('exist');
    this.breakRouteTable().trigger('mouseover');
    // Ensuring this object exist, because code does not click anywhere afterwards.
    this.breakRouteTable().should('exist');
  }

  fillBreaksInputEmpty(startTime: string, finishTime: string) {
    // Ensuring object is visible instead of clickable.
    this.breakRouteTable().should('be.visible');

    this.breakStart().clear().type(startTime);

    this.breakFinish().clear().type('{backspace}');
  }

  fillBreaksInput(startTime: string, finishTime: string) {
    // Ensuring object is visible instead of clickable.
    this.breakRouteTable().should('be.visible');

    this.breakStart().clear().type(startTime);

    this.breakFinish().clear().type(finishTime);
  }

  firstLoadWithDisposalDrpDown(
    disposalTimeIn: string,
    disposalTimeOut: string,
    disposalEndMileage: string
  ) {
    this.stopOneTable().should('exist');
    this.getTicketField().clear().type('3');
    this.getQuantityFieldLoad1().clear().type('1');
    this.getTimeInFieldLoad1().type(disposalTimeIn);
    this.getTimeOutLoad1().type(disposalTimeOut);
    this.getMileageLoad3().clear();
    this.getMileageLoad3().type(disposalEndMileage);
  }

  secondLoadWithLift(
    startTime2,
    startMileage2,
    finishTime2,
    finishMileage2,
    disposalTimeIn2,
    disposalTimeOut2,
    disposalEndMileage2
  ) {
    this.getContainerLoad2().should('be.visible');
    this.getContainerLoad2().trigger('mouseover');
    this.start2().type(startTime2);
    this.startMileage2().clear().type(startMileage2);
    this.finish2().type(finishTime2);
    this.totLifts().then(totLiftsValue => {
      const totalLiftsValue = totLiftsValue.text();

      cy.log(`Total Lifts value:${totalLiftsValue}`);
      this.lifts2().clear().type(totalLiftsValue);
    });
    this.finishMileage2().clear().type(finishMileage2);
    this.getTicketFieldLoad2().clear().type('3');
    this.quantity2().clear().type('1');
    this.disposalTimeIn2().type(disposalTimeIn2);
    this.disposalTimeOut2().type(disposalTimeOut2);
    this.disposalMileage2().clear().type(disposalEndMileage2);
  }

  // Error for Disposal First
  fillDDDisposalTimeYes(time: string) {
    this.stopOneTable().should('exist');
    this.stopOneTable().trigger('mouseover');
    this.getTicketField().clear().type('3');
    this.getQuantityField().clear().type('1');

    this.getTimeInFieldLoad1().clear().type(time);
    this.getTimeOutLoad1().clear().type('0600');
    this.mileageLoad3().clear().type('1350');
  }

  // Error Message #29: "Start Load Mileage must be greater than or equal to most recent Replacement Truck Start Mileage"
  // Renamed from replaceDriverPopup()
  replaceDriverPopupError() {
    this.newDriverStartTime().clear();
    this.newDriverStartTime().type('04:50');
    this.previousDriverEndTime().clear();
    this.previousDriverEndTime().type('04:30');

    // ======
    let replaceDriver;

    this.replacementDriverDropdown().then(Act_replaceTruck => {
      replaceDriver = Act_replaceTruck.text();
    });
    this.replacementDriverDropdown().click();
    if (expect(replaceDriver).to.eq('Select Driver')) {
      this.replaceFirstDriver().scrollIntoView();
      this.replaceFirstDriver().click();
    } else {
      this.replaceNonHighlightedDriver().scrollIntoView();
      this.replaceNonHighlightedDriver().click();
    }
    this.replacementDriverMilage().clear();
    this.replacementDriverMilage().type('110');
    this.button('Submit').click();
    cy.wait(2000);
    this.cancel().click();
  }

  // Error Message #30: "Start Load Mileage must be greater than or equal to Previous Load Disposal Out Mileage"
  load2StartMileageVsDisposalMileage(mileage) {
    this.loadTimePlusButton().click();
    this.getContainerLoad2().should('exist');
    this.getContainerLoad2().trigger('mouseover');
    this.start2().type('{ctrl}a');
    this.start2().type('0700');
    this.startMileage2().clear();
    this.startMileage2().type(mileage);
    this.finish2().type('{ctrl}a');
    this.finish2().type('0800');
    this.lifts2().clear();
    this.lifts2().type('0');
    this.finishMileage2().clear();
    this.finishMileage2().type('1320');
    this.getTicketFieldLoad2().clear().type('Q3');
    this.quantity2().clear();
    this.quantity2().type('1');
    this.disposalTimeIn2().type('{ctrl}a');
    this.disposalTimeIn2().type('0810');
    this.disposalTimeOut2().type('{ctrl}a');
    this.disposalTimeOut2().type('0830');
    this.disposalMileage2().clear();
    this.disposalMileage2().type('1380');
  }

  inputLoadBlockWithValidLoadTimeAndNoDisposal() {
    // To DO: getTotalLifts() lives in another page.
    this.stopOneTable().should('exist');
    this.stopOneTable().trigger('mouseover');
    this.startOneSC().type('{ctrl}a');
    this.startOneSC().type('0400');
    this.mileageStartLoad1().clear().type('1100');
    this.getFinishFieldLoad1().clear().type('1150');
    this.lifts1().clear();

    this.getMileageFieldLoad2().clear().type('1200');

    this.noDisposalCheckBox().click();

    this.noDisposalCheckBox().click();
  }

  replaceDriverPopUpDetails(PreviousDriverEndTime, NewDriverStartTime, RplDriverMileage) {
    this.previousDriverEndTime().clear();
    this.previousDriverEndTime().type(PreviousDriverEndTime);
    this.newDriverStartTime().clear();
    this.newDriverStartTime().type(NewDriverStartTime);
    this.replacementDriverMilage().clear();
    this.replacementDriverMilage().type(RplDriverMileage);
  }

  inputLoadWithDisposal() {
    this.dCheckBox().click();
    this.getTicketField().clear().type('3');
    this.getQuantityField().clear().type('5');

    this.getTimeInFieldLoad1().clear().type('0945');
    this.getTimeOutLoad1().clear().type('1000');
    this.mileageLoad3().clear();
    this.mileageLoad3().type('100');
    cy.log('I filled input fields with values for Load & Disposal block ');
  }

  // Error #52: Replacement Truck Times should be correct.
  replaceTruckInputBlocks() {
    this.newTruckStartTime().type('{ctrl}a');
    this.newTruckStartTime().type('0530');
  }

  closeRouteWithValidMileage() {
    this.getReturnFieldInCloseRoute().clear().type('1040');
    this.getEndMilageFieldInCloseRoute().clear().type('300');
  }

  closeRouteWithInvalidReturnTime() {
    this.closeRouteTable().should('exist');
    this.getReturnFieldInCloseRoute().clear().type('0800');
    this.getClockOutFieldInCloseRoute().clear().type('1110');
    this.getEndMilageFieldInCloseRoute().clear().type('170');
  }

  clearCloseRouteDatas() {
    this.closeRouteTable().should('exist');
    // Instead of verifying it's clickable, checking if it's visible and enabled.
    this.getOpenRouteTable().should('be.visible').and('not.be.disabled');
    this.getReturnFieldInCloseRoute().clear();
    this.getClockOutFieldInCloseRoute().clear();
    this.getEndMilageFieldInCloseRoute().clear();
  }

  clickReplacePopUpBackButton() {
    this.replaceDriverBackButton().click();
  }

  inputLoadBlockForErrorVerification() {
    this.getTotalLifts().then($totLiftsText => {
      this.stopOneTable().should('be.visible').should('not.be.disabled');
      this.stopOneTable().trigger('mouseover');
      this.startOneSC().type('{ctrl}a');
      this.startOneSC().type('0920');
      this.mileageStartLoad1().clear().type('120');
      this.getFinishFieldLoad1().clear().type('0930');
      this.lifts1().clear().type($totLiftsText);
      this.getMileageFieldLoad2().clear().type('140');
      this.getTicketField().clear().type('3');
      this.getQuantityField().clear().type('5');

      this.getTimeInFieldLoad1().clear().type('0945');
      this.getTimeOutLoad1().clear().type('1000');
      this.mileageLoad3().clear();
      this.mileageLoad3().type('160');
    });
  }

  verifyRouteExists(route: string, overrideRouteGet = false) {
    const routeNumber = overrideRouteGet ? route : homepage.getRouteNumber(route);

    this.getRouteNumberLink(routeNumber).should('be.visible');
  }
  timeInDisposalFielddisabled() {
    return cy.xpath("//input[@id ='loads-lc-in-time-1']['disabled']");
  }
}

const instance = new RouteClosing();

Object.freeze(instance);
export default instance;
