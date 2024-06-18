import homepage from '@pages/homePage';
import { queryData } from '@fixtures/queryData';
import db_routes from '@support/database_routes';

let stopsBeforeSplit: number;
let firstContainerQuantity;
let firstContainerQuantityNumber: number;

class ActiveRoutes {
  routeNumberLink(routeNumber: string) {
    return cy.contains('a', new RegExp(`^\\s${routeNumber}\\s$`));
  }

  getNumberOfPagesInPaginator() {
    return cy
      .get('.p-paginator-pages')
      .find('button')
      .then(elem1 => {
        let totalPageNum;
        const pages1 = elem1.length;

        cy.get('.p-paginator-bottom>button.p-paginator-last').then(arrow => {
          let pages2;

          if (!arrow.hasClass('ui-state-disabled')) {
            cy.wrap(arrow).click();
            cy.get('.p-paginator-pages')
              .find('button')
              .then(elem2 => {
                pages2 = elem2.length - 1;
                totalPageNum = pages1 + pages2;
                cy.get('.p-paginator-bottom>button.p-paginator-first').click();
                cy.wrap(totalPageNum);
              });
          } else {
            cy.wrap(pages1);
          }
        });
      });
  }

  // This is a function to click on the next page until the route is found (deals with pagination)
  clickUntilRouteIsPresent(route, retries) {
    /**
     *
     * @param retries
     */
    function retryUntilStatusVerified(retries) {
      cy.log(`PRINTING RETRIES: ${retries}`);
      if (retries === 0) {
        throw "route wasn't found on any pages";
      }

      let isPresent = false;
      const list = [];

      return cy
        .get('tbody>tr>td>a')
        .each($td => {
          list.push($td.text());
          cy.log($td.text());

          if ($td.text().trim() === route.toString().trim()) {
            cy.log('***FOUND YOU***');
            isPresent = true;
            cy.log(`Length inside is ${list.length}`);
          }
        })
        .then(() => {
          cy.log(`Length is ${list.length}`);

          return cy.wrap(isPresent);
        })
        .then(isPresent => {
          if (!isPresent) {
            cy.log('clicking on next page');
            cy.get('.p-paginator-next').click();

            return retryUntilStatusVerified(retries - 1);
          }
          cy.log(`*********** STATUS ${isPresent} *********`);
          cy.contains('tr>td>a', `${route}`).should('be.visible');

          return cy.contains('tr>td>a', `${route}`).click({ force: true });
        });
    }

    return retryUntilStatusVerified(retries);
  }

  selectRouteUpdated(route: string, overrideGetRouteNumber = false) {
    route = overrideGetRouteNumber ? route : homepage.getRouteNumber(route);
    cy.log(route);

    homepage.isElementPresentWithParent('.p-datatable', '.p-paginator-pages').then(isPresent => {
      if (isPresent) {
        cy.get('.p-paginator-next').then($nextButton => {
          if ($nextButton.is(':disabled')) {
            this.routeNumberLink(route).should('be.visible');
            this.routeNumberLink(route).click({ force: true });
          } else {
            this.getNumberOfPagesInPaginator().then(number => {
              this.clickUntilRouteIsPresent(route, number);
            });
          }
        });
      } else {
        this.routeNumberLink(route).should('be.visible');
        this.routeNumberLink(route).click({ force: true });
      }
    });
  }

  getRouteSequenceTable() {
    return cy.get("p-table[datakey='sequence']").find('.p-datatable-thead');
  }

  getRouteSequenceTableBody() {
    return cy.get("p-table[datakey='sequence']").find('tbody.p-datatable-tbody');
  }

  blockedButton() {
    return cy.contains('div>.detail-btns', 'Blocked');
  }

  noServiceButton() {
    return cy.contains('div>.detail-btns', 'No Service');
  }

  splitButton() {
    return cy.contains('div>.detail-btns', 'Split');
  }

  supplementalButton() {
    return cy.contains('div>.detail-btns', 'Supplemental');
  }

  additionalButton() {
    return cy.contains('div>.detail-btns', 'Additional');
  }

  verifyButtonstoBePresent() {
    this.blockedButton().should('be.visible');
    this.noServiceButton().should('be.visible');
    this.splitButton().should('be.visible');
    this.additionalButton().should('be.visible');
    this.supplementalButton().should('be.visible');
  }

  searchSeqNumber() {
    return cy.get('input[placeholder="Sequence Number"]');
  }

  selectCheckBoxForSequence(sequence: string) {
    cy.wait(2000);
    sequence = homepage.getSequence(sequence);
    this.searchSeqNumber().clear();
    this.searchSeqNumber().type(sequence);
  }

  additionalBinDD() {
    return cy.get('p-dropdown[formcontrolname="quantity"]').first();
  }

  additionalQuantity(qty) {
    return cy.get(`li[aria-label="${qty}"]`);
  }

  additionalCodeDD() {
    return cy.get('p-dropdown[formcontrolname="serviceCode"]');
  }

  additionalCodeCurrValue() {
    return cy.get("p-dropdown[formcontrolname='serviceCode'] span");
  }

  firstAdditionalCodeValue() {
    return cy.get(`p-dropdownitem:nth-child(1) span`);
  }

  secAdditionalCodeValue() {
    return cy.get(`p-dropdown[formcontrolname='serviceCode'] p-dropdownitem:nth-child(2) span`);
  }

  additionalText() {
    return cy.get('textarea#additional-comments-1');
  }

  fillAdditionalModuleText(text: string) {
    this.additionalText().should('be.visible').clear().type(text);
  }

  fillAdditionalModule(qty: string) {
    this.additionalBinDD().click();
    this.additionalQuantity(qty).click();

    this.additionalCodeDD().first().click();
    this.firstAdditionalCodeValue().click();
  }

  serviceCodeFilter() {
    return cy.get(`input.p-dropdown-filter`);
  }

  fillAdditionalModuleWithServiceCode(qty: string, serviceCode: string) {
    this.additionalBinDD().click();
    this.additionalQuantity(qty).click();
    cy.wait(3000);
    this.additionalCodeDD().click();
    this.serviceCodeFilter().type(serviceCode);
    this.firstAdditionalCodeValue().click({ force: true });
  }

  selectCheckBoxAgainForSequence() {
    this.searchSeqNumber().type('{enter}');
  }

  removeButtonRow(row) {
    return cy.get(`tr:nth-child(${row})>td:nth-child(6)>button:nth-child(1)`);
  }

  clickRemoveButton(row) {
    this.removeButtonRow(row).should('be.visible');
    this.removeButtonRow(row).click();
  }

  removeButtonForServiceCode(serviceCode) {
    return cy
      .get('div[role="dialog"] table.p-datatable-table tr')
      .last()
      .contains('td', serviceCode)
      .siblings('td')
      .contains('button', 'Remove');
  }

  clickRemove(serviceCode) {
    this.removeButtonForServiceCode(serviceCode).should('be.enabled').click();
  }

  getSuccessMessage(message) {
    return cy.get('p').contains(message);
  }

  getServiceEvenetsDialog() {
    return cy.contains('.ng-trigger', 'Service Events');
  }

  splitQtyDropdown() {
    return cy.get('p-dropdown[inputid="split-quantity"]');
  }

  splitQty(num: string) {
    return cy.contains('li>span', `${num}`);
  }

  selectSplitQty(num: string) {
    this.splitQtyDropdown().click();
    this.splitQty(num).click();
  }

  splitRouteNumberDropDown() {
    return cy.get('p-dropdown[formcontrolname="routeNumber"]');
  }

  splitRouteNumber(routeNumber: string) {
    return cy.get(`p-dropdownitem>li[aria-label="${routeNumber}"]`);
  }

  selectRouteToTransfer(routeNumber: string) {
    routeNumber = homepage.getRouteNumber(routeNumber);
    this.splitRouteNumberDropDown().click();
    this.splitRouteNumber(routeNumber).click();
  }

  verifyContainerQuantity(sequence: string) {
    sequence = homepage.getSequence(sequence);
    this.searchSeqNumber().type(sequence);
    cy.wait(3000);
    const tdValues = [];
    let containerQtyFromUI;

    cy.get('.p-datatable-tbody')
      .find('tr')
      .find('td')
      .each($td => {
        tdValues.push($td.text());
      })
      .then(tdValues => {
        cy.log(`Container Quantity : ${tdValues[3].innerText}`);
        containerQtyFromUI = tdValues[3].innerText;
        db_routes.validateContainerQuantityInDB(containerQtyFromUI);
      });
  }

  supplementalText() {
    return cy.get('#supplemental-comments-1'); // To add this element once we branch to STG2
  }

  fillSupplementalModuleText(text: string) {
    cy.xpath(`//p[text()="Supplemental"]`).should('be.visible');
    this.supplementalText().should('be.visible').clear().type(text);
  }

  supplementalQty() {
    // To add this element once we branch to STG2
    return cy.get(`p-dropdown[formcontrolname="quantity"]`).first();
  }

  supplementalQtySelected(qty: any) {
    return cy.get(`li[aria-label='${qty}']`);
  }

  supplementalService() {
    return cy.get(`p-dropdown[formcontrolname='serviceCode']`);
  }

  getDropdownOption(val: string) {
    return cy.get(`li[aria-label='${val}']`);
  }

  fillSupplementalModuleBin(qty: string) {
    this.supplementalQty().type(qty);
    this.getDropdownOption(qty).click();
    this.supplementalQtySelected(qty).should('be.visible').click({ force: true });
  }

  currSupplementalService() {
    return cy.get(`p-dropdown[formcontrolname='serviceCode'] span`);
  }

  firstServiceCode() {
    return cy.get(`p-dropdownitem:nth-child(1) span`);
  }

  secondServiceCode() {
    return cy.get(`p-dropdownitem:nth-child(2) span`);
  }

  fillSupplementalModuleDD() {
    this.supplementalService().click();
    this.firstServiceCode().click({ force: true });
  }

  plusButton(sequence: string) {
    return cy.contains('tbody>tr>td:nth-child(2)', `${sequence}`).find('i');
  }

  selectSequence(sequence: string) {
    sequence = homepage.getSequence(sequence);
    this.searchSeqNumber().clear().type(sequence).type('{enter}');
    this.plusButton(sequence).scrollIntoView().should('be.visible').click({ force: true });
  }

  accountLink(link: string) {
    cy.log(`Link value${link}`);

    return cy
      .get('tr')
      .contains('td:nth-child(2)', `${link}`)
      .parent()
      .next()
      .find('td:nth-child(6)');
  }

  getAccountInformationTag() {
    return cy.contains('ul>li>a>span', 'Account Information');
  }

  getCustomerName() {
    return cy.contains('.info-text>div>label', 'Customer Name:');
  }

  goToAccountLink(sequence: string) {
    sequence = homepage.getSequence(sequence);
    this.accountLink(sequence)
      .find('a')
      .should('contain.text', 'Account-Site-Container Group')
      .click({ force: true });
    this.getAccountInformationTag().should('be.visible');
    this.getCustomerName().should('be.visible');
  }
  getAccount() {
    return cy.get(`p-tabpanel[header='Account Information'] h1`).contains('Account Number: ');
  }

  getSiteNumber() {
    return cy.get('.header>div:nth-child(2) p-dropdown span');
  }

  getContainerGroup() {
    return cy.get('.header>div:nth-child(3) p-dropdown span');
  }

  noServiceReasonText() {
    return cy.get('#no-service-action-text-1');
  }

  fillNoServiceModuleText(text: string) {
    this.noServiceReasonText().should('be.visible').click().clear().type(text);
  }

  noServiceReasonCodeDD() {
    return cy.get("p-dropdown[formcontrolname='actionReasonCode']").first();
  }

  noServiceSelectedReasonDD(reason: string) {
    return cy.contains('.p-dropdown-items>p-dropdownitem>li>span', `${reason}`);
  }

  fillNoServiceModuleDD(reason: string) {
    this.noServiceReasonCodeDD().click();
    this.noServiceSelectedReasonDD(reason).click();
  }

  noServiceBinDD() {
    return cy.contains('Select quantity');
  }

  noServiceBinDD2() {
    return cy.get('[formcontrolname="quantity"').last();
  }

  noServiceBinSelected(bin: string) {
    return cy.get(`li[role='option'][aria-label="${bin}"]`);
  }

  fillNoServiceModuleBin(bin: string) {
    this.noServiceBinDD().click({ force: true });
    cy.wait(1000);
    this.noServiceBinSelected(bin).click({ force: true });
  }

  reasonTextBox() {
    return cy.get('textarea[id="blocked-action-text-1"]');
  }

  reasonCodeDD() {
    return cy.get('p-dropdown[formcontrolname="actionReasonCode"]');
  }

  reasonCodeDropdown(reasonCode: string) {
    return cy.contains('div>ul>p-dropdownitem>li>span', `${reasonCode}`);
  }

  enterReason(reason: string, reasonCode: string) {
    this.reasonTextBox().click().clear().type(reason);
    this.reasonCodeDD().click();
    this.reasonCodeDropdown(reasonCode).click();
  }

  myInitialContainerQuantity() {
    return cy.get('table>tbody>tr>td:nth-child(4)');
  }

  getContainerQuantity() {
    this.myInitialContainerQuantity()
      .invoke('text')
      .then(containerQuantity => {
        firstContainerQuantity = containerQuantity;
        cy.log(`Container Quantity :${containerQuantity}`);
        firstContainerQuantityNumber = parseInt(firstContainerQuantity, 10);
      });
  }

  scheduledCompletionDate() {
    return cy.get('form>div:nth-child(5)>p-calendar');
  }

  getPlanDate() {
    return cy.get('td span.p-highlight');
  }

  getPlanDateMonth() {
    return cy.get('button.p-datepicker-month');
  }

  getPlanDateYear() {
    return cy.get('div.p-datepicker-title button.p-datepicker-year');
  }

  verifyScheduledCompletionDate() {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    const expectedDate = `${yyyy}-${mm}-${dd}`;

    cy.log(`Expected Schedule Completion Date :${expectedDate}`);
    this.scheduledCompletionDate().click();
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    this.scheduledCompletionDate().click();
    this.getPlanDate()
      .invoke('text')
      .then(date => {
        this.getPlanDateMonth()
          .invoke('text')
          .then(month => {
            this.getPlanDateYear()
              .invoke('text')
              .then(year => {
                const actualDate = `${year.trim()}-${months.indexOf(month.trim()) + 1}-${date}`;

                cy.log(`Actual Schedule Completion Date :${actualDate}`);

                expect(expectedDate).to.be.equal(actualDate);
              });
          });
      });
  }

  serviceExceptionCheckStatus() {
    return cy.get('.p-datatable-tbody > tr.ng-star-inserted > :nth-child(5)');
  }

  serviceExcepetionquantity() {
    return cy.get('tbody.p-datatable-tbody>tr>td:nth-child(5)');
  }

  reamainingContainerQuantity() {
    return cy.get('tbody.p-datatable-tbody>tr>td:nth-child(4)');
  }

  getRemainingContainerQuantity() {
    this.serviceExcepetionquantity()
      .invoke('text')
      .then(getSeQty => {
        getSeQty = getSeQty.substring(2, 3);
        cy.log(getSeQty);
        const getSeQtyNumber: number = parseInt(getSeQty, 10);

        this.reamainingContainerQuantity()
          .invoke('text')
          .then(remainingQty => {
            const getRemainingQtyNumber: number = parseInt(remainingQty, 10);
            const total = getSeQtyNumber + getRemainingQtyNumber;

            cy.log(total.toString());
            expect(total).to.eql(firstContainerQuantityNumber);
          });
      });
  }

  canNumber() {
    return cy
      .contains('div.form-section', 'This customer has')
      .find('p-dropdown[formcontrolname="quantity"]')
      .first();
  }

  quantity(qty: string) {
    return cy.contains('div>ul>p-dropdownitem>li>span', `${qty}`);
  }

  radioButtonNo() {
    return cy
      .contains('div.form-section', 'driver be returning')
      .find('label>input#block-reroute-1');
  }

  radioButtonYes() {
    return cy.contains('div.form-section', 'driver be returning').find('label>input#block-retry-1');
  }

  downTruckToggle() {
    return cy.get('div>input[type=checkbox]');
  }

  validateDownTruckToggleExists() {
    this.downTruckToggle().should('be.visible');
  }

  validateDownTruckToggleStatus(bool: string) {
    this.downTruckToggle().should('have.attr', 'aria-checked', bool);
  }

  clickDownTruckToggle() {
    this.downTruckToggle().click();
  }

  selectBinAndRadioButton(can: string, radio: string) {
    this.canNumber().trigger('mouseover').click();
    this.quantity(can).should('be.visible');
    this.quantity(can).click();
    let result: boolean;

    switch (radio) {
      case 'Yes':
        this.radioButtonYes().click();
        break;
      case 'No':
        this.radioButtonNo().click();
        break;
    }

    return result;
  }

  getEnableDate(date) {
    return cy.contains('td>span', `${date}`);
  }

  getDisableDate(date) {
    return cy.contains('td>span', `${date}`);
  }

  next() {
    return cy.get('span.ui-datepicker-next-icon');
  }

  previous() {
    return cy.get('span.ui-datepicker-prev-icon');
  }

  verifyFutureDates() {
    const today = new Date();
    const date = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    let lastDate = new Date(year, month, 0).getDate();

    cy.log(lastDate.toString());

    if (date !== 1 && date !== lastDate) {
      for (let i = date; i <= lastDate; i++) {
        cy.log(`enabled: ${i}`);
        this.getEnableDate(i).invoke('attr', 'class').should('not.contain', 'ui-state-disabled');
      }
      for (let i = date - 1; i >= 1; i--) {
        cy.log(`disabled: ${i}`);
        this.getDisableDate(i).invoke('attr', 'class').should('contain', 'p-disabled');
      }
    }

    if (date === lastDate) {
      for (let i = date - 1; i >= 1; i--) {
        this.getDisableDate(i).invoke('attr', 'class').should('contain', 'ui-state-disabled');
      }
      this.next().click();
      this.getPlanDateMonth()
        .invoke('text')
        .then(month => {
          this.getPlanDateYear()
            .invoke('text')
            .then(year => {
              lastDate = new Date(Number(year), Number(month), 0).getDate();
              cy.log(lastDate.toString());
              for (let i = 1; i <= lastDate; i++) {
                this.getEnableDate(i)
                  .invoke('attr', 'class')
                  .should('contain', 'ui-state-disabled');
              }
            });
        });
    }

    if (date === 1) {
      for (let i = date; i <= lastDate; i++) {
        this.getEnableDate(i).invoke('attr', 'class').should('not.contain', 'ui-state-disabled');
      }
      this.previous().click();
      this.getPlanDateMonth()
        .invoke('text')
        .then(month => {
          this.getPlanDateYear()
            .invoke('text')
            .then(year => {
              lastDate = new Date(Number(year), Number(month), 0).getDate();
              cy.log(lastDate.toString());
              for (let i = 1; i <= lastDate; i++) {
                this.getDisableDate(i)
                  .invoke('attr', 'class')
                  .should('contain', 'ui-state-disabled');
              }
            });
        });
    }
  }

  findUntilRouteIsPresent(route, retries) {
    /**
     *
     * @param retries
     */
    function retryUntilStatusVerified(retries) {
      if (retries === 0) {
        throw "route wasn't found on any pages";
      }

      let isPresent = false;
      const list = [];

      return cy
        .get('tbody>tr>td>a')
        .each($td => {
          list.push($td.text());
          cy.log($td.text());

          if ($td.text().trim() === route.toString().trim()) {
            cy.log('***FOUND YOU***');
            isPresent = true;
            cy.log(`Length inside is ${list.length}`);
          }
        })
        .then(() => {
          cy.log(`Length is ${list.length}`);

          return cy.wrap(isPresent);
        })
        .then(isPresent => {
          if (!isPresent) {
            cy.log('clicking on next page');
            cy.get('.p-paginator-next').click();

            return retryUntilStatusVerified(retries - 1);
          }
          cy.log(`*********** STATUS ${isPresent} *********`);
          cy.contains('tr>td>a', `${route}`).scrollIntoView().should('be.visible');
        });
    }

    return retryUntilStatusVerified(retries);
  }

  findRoute(route: string) {
    route = homepage.getRouteNumber(route);
    cy.log(route);

    homepage.isElementPresentWithParent('.p-datatable', '.p-paginator-pages').then(isPresent => {
      if (isPresent) {
        cy.get('.p-paginator-next').then($nextButton => {
          if ($nextButton.is(':disabled')) {
            this.routeNumberLink(route).should('be.visible');
          } else {
            this.getNumberOfPagesInPaginator().then(number => {
              this.findUntilRouteIsPresent(route, number);
            });
          }
        });
      } else {
        this.routeNumberLink(route).should('be.visible');
      }
    });
  }

  getCurrdriverName(routeNum) {
    return cy
      .contains('.p-datatable-wrapper>table>tbody>tr', `${routeNum}`)
      .find('td:nth-child(4)');
  }

  getConfirm() {
    return cy.contains('.ng-trigger .p-dialog-footer button', 'OK', { timeout: 10000 });
  }

  selectDriverName(routNum) {
    routNum = homepage.getRouteNumber(routNum);
    this.getCurrdriverName(routNum).click();
    this.getCurrdriverName(routNum).then(Actcurrdrivername => {
      const currdrivername = Actcurrdrivername.text();

      cy.get('p-dropdownitem').each($option => {
        if ($option.text() !== currdrivername) {
          cy.wrap($option).click();

          return false;
        }
      });
    });

    this.getConfirm().should('be.visible');
    this.getConfirm().click();
  }

  driverChangeDDCell() {
    return cy.get(
      '#active-routes>p-table tbody>tr:nth-child(1)>td:nth-child(4)>p-dropdown>div label'
    );
  }

  verifyChangedDriverName(routeNum) {
    routeNum = homepage.getRouteNumber(routeNum);
    this.getCurrdriverName(routeNum).then($driverName => {
      db_routes.validateDriverNameInDB($driverName.text());
    });
  }
  truckChangeDD(routeNum) {
    return cy
      .contains('.p-datatable-wrapper>table>tbody>tr', `${routeNum}`)
      .find('td:nth-child(3)');
  }

  selectTruckNumber() {
    return cy.get('.p-dropdown-items>p-dropdownitem:nth-child(2)>li>span');
  }

  selectTruckChangeDD(routeNum) {
    routeNum = homepage.getRouteNumber(routeNum);
    this.truckChangeDD(routeNum).click();
    this.truckChangeDD(routeNum).then(truckNumber => {
      const currTruckNum = truckNumber.text().trim();

      cy.get('p-dropdownitem').each($option => {
        if ($option.text() !== currTruckNum) {
          cy.log(`ui truck:${$option.text()}`);
          cy.log(`curr truck:${currTruckNum}`);
          cy.wrap($option).click();

          return false;
        }
      });
    });

    this.okButton().should('be.visible');
    this.okButton().click();
  }

  verifyChangedTruckValue(routeNum) {
    routeNum = homepage.getRouteNumber(routeNum);
    this.truckChangeDD(routeNum).then($truckNum => {
      db_routes.validateTruckNumberInDB($truckNum.text().trim());
    });
  }

  getTotalSequence() {
    return cy.get('.p-datatable-tbody tr');
  }

  verifySequenceAddition() {
    let actualValue;

    this.getTotalSequence().then((act_Value: any) => {
      actualValue = act_Value.length;
      cy.log(`Actual Count${actualValue}`);
      cy.log(`Query Data: ${queryData.totalSequence}`);
      const expectedValue = parseInt(queryData.totalSequence) + 2;

      expect(expectedValue).equal(actualValue);
    });
  }

  verifyAccountSiteContainerValue(sequence: string) {
    sequence = homepage.getSequence(sequence);
    this.accountLink(sequence)
      .find('a')
      .should('contain.text', `Account-Site-Container Group # ${queryData.accountSiteContainer}`);
  }
  noServiceMessage() {
    return cy.get('.alert-no-service.ng-star-inserted :nth-child(1)');
  }

  cancelButton() {
    return cy.contains('Cancel');
  }

  noServiceMessagemodal() {
    this.noServiceMessage().should('have.text', 'Cannot No Service stop');
    this.cancelButton().click({ force: true });
  }

  delayTime(time: String) {
    return cy.get(`li[aria-label='${time}'] span[class='ng-star-inserted']`);
  }

  popUpBox() {
    return cy.get('div[role="dialog"]');
  }

  blockMessage() {
    return cy.get('.alert-no-service.ng-star-inserted :nth-child(1)');
  }
  blockMessagemodal() {
    this.blockMessage().should('have.text', 'Cannot block stop');
  }

  splitMessage() {
    return cy.get('.alert-no-service.ng-star-inserted :nth-child(1)');
  }

  splitMessagemodal() {
    this.splitMessage().should('have.text', 'Cannot split stop');
    this.okButton().click({ force: true });
  }

  splitCanQty() {
    return cy.get(`label[for='split-quantity']`);
  }

  splitCanQtyMessage() {
    this.splitCanQty()
      .invoke('text')
      .then(splitCanQtyMessageDisplayed => {
        expect(splitCanQtyMessageDisplayed).contains(
          `has ${firstContainerQuantityNumber} quantity`
        );
      });
  }

  blockCanQty() {
    return cy.get(`label[for='blocked-quantity-1']`);
  }
  blockCanQtyMessage() {
    this.blockCanQty()
      .invoke('text')
      .then(noServiceCanQty => {
        expect(noServiceCanQty).contains(`has ${firstContainerQuantityNumber} can`);
      });
  }

  noServiceCanQty() {
    return cy.get(`label[for='no-service-quantity-1']`);
  }
  noServiceCanQtyMessage() {
    this.noServiceCanQty()
      .invoke('text')
      .then(noServiceCanQty => {
        expect(noServiceCanQty).contains(`has ${firstContainerQuantityNumber} can`);
      });
  }

  seqNumberColumn() {
    return cy.contains('div>table>thead>tr>th:nth-child(5)', 'Sequence #');
  }

  seqNumberColumnText() {
    this.seqNumberColumn().should('be.visible');
    this.seqNumberColumn().should('have.text', 'Sequence #');
  }

  fillAdditionalModuleforHRS(qty: string) {
    cy.xpath(`//p[text()="Additional"]`).should('be.visible');
    this.additionalBinDD().click();
    this.additionalQuantity(qty).click();

    this.additionalCodeDD().click();
    cy.contains('HRS - HOURS').click();
  }

  secondAccount() {
    return cy.get('.caption-right');
  }

  secondAccountCountAdditional() {
    this.secondAccount().should('have.text', '2 of 2');
  }

  secondSupplementalText() {
    return cy.get('div[role="dialog"]>div:nth-child(2)>div:nth-child(4) #supplemental-comments-2');
  }
  fillSupplementalModuleTextSecondAccount(text: string) {
    this.secondSupplementalText().should('be.enabled').click().clear().type(text);
  }

  reasonTextBoxMultiselect() {
    return cy.get('textarea[id="blocked-action-text-1"]');
  }

  reasonCodeDDMultiselect() {
    return cy.get('div>div:nth-child(2)>div>shared-blocked-form>form>div:nth-child(2)>p-dropdown');
  }

  reasonCodeDropdownMultiselect(reasonCode: string) {
    return cy.contains('p-dropdownitem>li>span', `${reasonCode}`);
  }

  enterReasonMultiselect(reason: string, reasonCode: string) {
    this.reasonTextBoxMultiselect().type(reason);
    this.reasonCodeDDMultiselect().click();
    this.reasonCodeDropdownMultiselect(reasonCode).click();
    cy.wait(2000);
  }

  reasonTextBoxMultiselect2() {
    return cy.get('textarea[id="blocked-action-text-2"]');
  }

  reasonCodeDDMultiselect2() {
    return cy.get('div.modal-body>div:nth-child(3) form>div:nth-child(2)>p-dropdown');
  }

  reasonCodeDropdownMultiselect2(reasonCode: string) {
    return cy.contains('p-dropdownitem', `${reasonCode}`);
  }

  enterReasonMultiselect2(reason: string, reasonCode: string) {
    cy.wait(1000);
    this.reasonTextBoxMultiselect2().type(reasonCode);
    this.reasonCodeDDMultiselect2().click();
    this.reasonCodeDropdownMultiselect2(reasonCode).click();
  }

  secondAccountCount() {
    this.secondAccount().should('have.text', '2 of 2');
  }

  noServiceReasonText2() {
    return cy.get('#no-service-action-text-2');
  }

  fillNoServiceModuleText2(text: string) {
    this.noServiceReasonText2().type(text);
  }

  noServiceReasonCodeDD2() {
    return cy.get('[formcontrolname="actionReasonCode"]').last();
  }

  fillNoServiceModuleDD2(reason: string) {
    this.noServiceReasonCodeDD2().click();
    this.noServiceSelectedReasonDD(reason).scrollIntoView();
    this.noServiceSelectedReasonDD(reason).click();
  }

  fillNoServiceModuleBin2(bin: string) {
    this.noServiceBinDD2().click();
    this.noServiceBinSelected(bin).scrollIntoView();
    this.noServiceBinSelected(bin).click();
  }

  verifyExceptionQty() {
    cy.get('.p-datatable-tbody > tr.ng-star-inserted > :nth-child(4)').contains('0');
    cy.get('.p-datatable-tbody > tr.ng-star-inserted > :nth-child(5)').contains('NOT OUT');
  }

  verifyStopCount(query) {
    cy.wait(3000);
    let totalCount = 0;

    homepage.isElementPresentWithParent('.p-datatable', '.p-paginator-pages').then(isPresent => {
      if (!isPresent) {
        cy.get(`.p-datatable-tbody`)
          .find('tr')
          .then(row => {
            cy.log(`Count of record in UI is ${row.length}`);
            totalCount = row.length;
            db_routes.verifyStopCountInDB(query, totalCount);
          });
      } else {
        cy.get('.p-paginator-last').should('be.visible').click();

        cy.get('.p-paginator-pages > button')
          .last()
          .invoke('text')
          .then(parseInt)
          .then(n => {
            cy.log(`the value of n ${n}`);
            for (let i = n; i >= 1; i--) {
              cy.contains('.p-paginator-pages>button', `${i}`).click({ force: true });

              cy.get(`.p-datatable-tbody`)
                .find('tr')
                .then(row => {
                  totalCount = totalCount + row.length;

                  if (i === 1) {
                    db_routes.verifyStopCountInDB(query, totalCount);
                  }
                });
            }
          });
      }
    });
  }

  routeDelayDropdown(routeNum) {
    return cy.contains('td', `${routeNum}`).prev().find('p-dropdown');
  }

  okButton() {
    return cy.contains('OK');
  }

  selectRouteDelay(timeDelay: String, route: String) {
    queryData.timeDelay = timeDelay.substr(0, 1);

    cy.log(`time delay ${timeDelay}`);
    route = homepage.getRouteNumber(route);
    this.routeDelayDropdown(route).should('be.visible');
    this.routeDelayDropdown(route).click();
    this.delayTime(timeDelay).should('be.visible');
    this.delayTime(timeDelay).click();
    this.okButton().click();
  }

  verifyRowCount(query) {
    let totalCount = 0;

    homepage.isElementPresentWithParent('.p-datatable', '.p-paginator-pages').then(isPresent => {
      if (!isPresent) {
        cy.get(`.p-datatable-tbody`)
          .find('tr')
          .then(row => {
            cy.log(`Count of record in UI is ${row.length}`);
            totalCount = row.length;
            db_routes.verifyRecordCountInDB(query, totalCount);
          });
      } else {
        cy.get('.p-paginator-last').should('be.visible').click({ force: true });

        cy.get('.p-paginator-pages > button')
          .last()
          .invoke('text')
          .then(parseInt)
          .then(n => {
            cy.log(`the value of n ${n}`);
            for (let i = n; i >= 1; i--) {
              cy.contains('.p-paginator-pages>button', `${i}`).click({ force: true });

              cy.get(`.p-datatable-tbody`)
                .find('tr')
                .then(row => {
                  totalCount = totalCount + row.length;

                  if (i === 1) {
                    db_routes.verifyRecordCountInDB(query, totalCount);
                  }
                });
            }
          });
      }
    });
  }

  streetAddressSearchBar() {
    return cy.get('input[placeholder = "Street Address"]');
  }

  citySearchBar() {
    return cy.get('input[placeholder = "City"]');
  }

  stateSearchBar() {
    return cy.get('input[placeholder = "State"]');
  }

  zipCodeSearchBar() {
    return cy.get('input[placeholder = "Zip Code"]');
  }

  validateServiceExceptionColumn() {
    cy.get('table').contains('th', 'Service Exceptions').should('be.visible');
  }

  notOutTextBox() {
    return cy.get('input#not-out-action-text-1');
  }

  fillNotOutModuleText(text: string) {
    this.notOutTextBox().type(text);
  }

  extraServiceButton() {
    return cy.get('#active-route-details>p-table>div>div:nth-child(1)>div>div:nth-child(2)>button');
  }

  quantityValueFor(val: string) {
    return cy.get('tbody>tr').last().contains('td', `${val}`).next();
  }

  verifyQuantityValue() {
    let result;

    this.quantityValueFor('EXY')
      .invoke('text')
      .then(act_Value => {
        cy.log(act_Value);
        result = act_Value;
        expect(result).to.equal('0.75');
      });
  }

  serviceException(sequencequeryid: string) {
    return cy
      .contains('.p-datatable-tbody > tr.ng-star-inserted', ` ${sequencequeryid} `)
      .find('td:nth-child(5)');
  }

  selectCheckBoxForSequenceMultiSelectBlock(sequence: string) {
    const sequences: any[] = homepage.getSequences(sequence);

    for (const sequenceVal of sequences) {
      this.searchSeqNumber().type(',');
      this.searchSeqNumber().type(sequenceVal);
    }
  }

  additionalTextLC() {
    return cy.get('#additional-comments-1');
  }

  fillAdditionalModuleTextLC(text: string) {
    this.additionalTextLC().should('be.enabled').click().clear().type(text);
  }

  hrsServiceCode() {
    return cy.get('p-dropdown[formcontrolname="serviceCode"] p-dropdownitem:nth-child(11) span');
  }

  fillSupplementalModuleforHRS() {
    this.supplementalService().click();
    cy.contains('HRS - HOURS').click();
  }

  tab(tabName: string) {
    return cy.contains('span[class="p-tabview-title ng-star-inserted"]', `${tabName}`);
  }

  selectServiceRecording(tabName: string) {
    this.tab(tabName).should('be.visible').click({ force: true });
  }
  // ------------------------------------------------------------

  public pageName: string = `Active Routes Page`;
  popUpButton() {
    return cy.get('div[role="dialog"]');
  }

  popUpMessage() {
    return cy.get('.ui-dialog-content p');
  }

  delayPopUpMessage(routeNum: String) {
    const warningMessage = this.popUpMessage().invoke('attr', 'textContent');
    const messageReasult = warningMessage.contains(
      `trigger an automated notification to all customers on route ${routeNum}`
    );

    return messageReasult;
  }

  selectFullDayWeatherDelay(route: String) {
    queryData.timeDelay = 'W';
    route = homepage.getRouteNumber(route);
    this.routeDelayDropdown(route).should('be.visible');
    this.routeDelayDropdown(route).click();
    this.delayTime('Full Day Delay - Weather').should('be.visible');
    this.delayTime('Full Day Delay - Weather').click();
    const validateMessage = this.delayPopUpMessage(route);

    expect(validateMessage).to.equal(true);
    this.okButton().click();
  }

  selectFullDayDriverDelay(route: String) {
    queryData.timeDelay = 'D';
    route = homepage.getRouteNumber(route);
    this.routeDelayDropdown(route).should('be.visible');
    this.routeDelayDropdown(route).click();
    this.delayTime('Full Day Delay - No Driver').should('be.visible');
    this.delayTime('Full Day Delay - No Driver').click();
    const validateMessage = this.delayPopUpMessage(route);

    expect(validateMessage).to.equal(true);
    this.okButton().click();
  }

  selectFullDayTruckDelay(route: String) {
    queryData.timeDelay = 'T';
    route = homepage.getRouteNumber(route);
    this.routeDelayDropdown(route).should('be.visible');
    this.routeDelayDropdown(route).click();
    this.delayTime('Full Day Delay - No Truck').should('be.visible');
    this.delayTime('Full Day Delay - No Truck').click();
    const validateMessage = this.delayPopUpMessage(route);

    expect(validateMessage).to.equal(true);
    this.okButton().click();
  }

  selectFullDayDriverTruckDelay(route: String) {
    queryData.timeDelay = 'B';
    route = homepage.getRouteNumber(route);
    this.routeDelayDropdown(route).should('be.visible');
    this.routeDelayDropdown(route).click();
    this.delayTime('Full Day Delay - No Driver and No Truck').should('be.visible');
    this.delayTime('Full Day Delay - No Driver and No Truck').click();
    const validateMessage = this.delayPopUpMessage(route);

    expect(validateMessage).to.equal(true);
    this.okButton().click();
  }

  selectSixHourRouteDelay(route: String) {
    queryData.timeDelay = '6';
    route = homepage.getRouteNumber(route);
    this.routeDelayDropdown(route).should('be.visible');
    this.routeDelayDropdown(route).click();
    this.delayTime('6 Hour Delay').should('be.visible');
    this.delayTime('6 Hour Delay').click();
    const validateMessage = this.delayPopUpMessage(route);

    expect(validateMessage).to.equal(false);
    this.okButton().click();
  }

  // ROUTES
  rowTableValues() {
    return cy.get('tbody.ui-table-tbody');
  }

  totalPages() {
    return cy.get('.p-paginator-pages>a');
  }

  clickOnCurrentPage(page: any) {
    return cy.get(`.p-paginator-pages>a:nth-child(${page})`);
  }

  getCountOfAllRoutes() {
    const totalPages = this.totalPages.length;
    let routeCount = 0;

    if (totalPages > 0) {
      for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        routeCount = this.getRouteCount(currentPage, routeCount);
      }
    } else {
      routeCount = this.rowTableValues.length;
    }
    cy.log(`Total route values ${routeCount}`);

    return routeCount;
  }

  private getRouteCount(currentPage: number, routeCount: number) {
    this.clickOnCurrentPage(currentPage).should('be.visible');
    this.clickOnCurrentPage(currentPage).click({ force: true });
    const currentPageCount = this.rowTableValues.length;

    routeCount = currentPageCount + routeCount;

    return routeCount;
  }

  accountNumberLink(accountNumber: string) {
    return cy.xpath(`(//a[contains(text(),'${accountNumber}')]/preceding::td[1]//a)[1]`);
  }

  selectRoute(route: string) {
    route = homepage.getRouteNumber(route);
    this.routeNumberLink(route).should('be.visible');
    this.routeNumberLink(route).click({ force: true });

    cy.wait(4000);
    stopsBeforeSplit = this.getTotalStops();
  }

  selectAccountNumber(account: string) {
    account = homepage.getAccountNumber(account);
    this.accountNumberLink(account).should('be.visible');
    this.accountNumberLink(account).click({ force: true });
    cy.wait(4000);
  }

  selectRouteMan(route: string) {
    this.routeNumberLink(route).should('be.visible');
    this.routeNumberLink(route).click({ force: true });
    cy.wait(4000);
  }

  clickPage(pageNumber: number) {
    return cy.get(`.p-paginator-pages>a:nth-child(${pageNumber})`);
  }

  // --------------------------------ACTIVE ROUTES DETAIL PAGE---------------
  // BUTTONS IN DETAIL PAGE

  header1() {
    return cy.contains('table>thead>tr>th', 'Route Delay');
  }

  header2() {
    return cy.contains('table>thead>tr>th', 'Route Number');
  }

  header3() {
    return cy.contains('table>thead>tr>th', 'Truck Number');
  }

  header4() {
    return cy.contains('table>thead>tr>th', 'Driver Name');
  }

  header5() {
    return cy.contains('table>thead>tr>th', 'Units');
  }

  header6() {
    return cy.contains('table>thead>tr>th', 'Route Type');
  }

  header7() {
    return cy.contains('table>thead>tr>th', 'Line of Business');
  }

  header8() {
    return cy.contains('table>thead>tr>th', 'Service Exceptions');
  }

  // STOP TABLE
  stopCount() {
    return cy.get('.ui-table-tbody>tr');
  }

  getStopCount() {
    let sCount = 0;
    const totalPages = this.totalPages.length;

    if (totalPages > 1) {
      for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        this.clickPage(currentPage).click();
        cy.wait(2000);
        let stopcountUI = 0;

        stopcountUI = this.stopCount.length;
        cy.log(`*********stop count :${stopcountUI}`);
        cy.wait(5000);
        cy.log(`User is on the page: # ${currentPage} stopcount : ` + `stopcountUI`);
        sCount = sCount + stopcountUI;
        cy.log(`Total stop count : ${sCount}`);
      }
    } else {
      sCount = this.stopCount.length;
    }
    cy.log(`*********stop count :${sCount}`);
    cy.wait(4000);

    return sCount;
  }

  totalStops() {
    return cy.get('active-route-details table>tbody>tr');
  }

  getTotalStops() {
    return this.totalStops.length;
  }

  verifyStopsAfterSplit() {
    const totStops = this.getTotalStops();

    expect(totStops).to.equal(stopsBeforeSplit + 1);
  }

  checkBoxSequenceNumber(sequence: string) {
    const sequenceInt: number = parseInt(sequence, 10);

    cy.wait(2000);

    return cy.get(`.ui-table-tbody>tr:nth-child(${sequenceInt})>td>p-checkbox`);
  }

  getExpandAllPlusButton() {
    return cy.get('#expand-details-toggle');
  }

  containerGroup() {
    return cy.get('.ui-table-tbody>tr:nth-child(2)>td:nth-child(6)>a');
  }

  verifyContainerGroup() {
    this.getExpandAllPlusButton().should('be.visible').click();
    this.containerGroup().should('be.visible');
    this.containerGroup().should('contain.text', 'Container Group');
  }

  containerQuantity(sequence: string) {
    return cy.contains('tbody>tr', `${sequence}`).find('td:nth-child(4)');
  }

  // ----------------------------- BLOCKED MODULE-------------------------------------
  blockedModule() {
    return cy.get('div[role="dialog"]');
  }

  // ----------------------------- BLOCKED MODULE for Multiselect-------------------------------------

  canNumberMultiselect() {
    return cy.get('p-dropdown[formcontrolname="quantity"]').first();
  }

  canNumberMultiselect2() {
    return cy.get('p-dropdown[formcontrolname="quantity"]').eq(1);
  }

  quantityMultiselect(qty: string) {
    return cy.get(`li[aria-label="${qty}"]`);
  }

  radioButtonYesMultiselect() {
    return cy.get(`input[type='radio'][id='block-retry-1']`);
  }

  radioButtonYesMultiselect2() {
    return cy.get(`input[type='radio'][id='block-retry-2']`);
  }

  selectBinAndRadioButtonMultiselect(can: string, radio: string) {
    this.canNumberMultiselect().click();
    cy.wait(1000);
    this.quantityMultiselect(can).should('be.visible').click({ force: true });
    cy.wait(1000);
    let result: boolean;

    switch (radio) {
      case 'Yes':
        this.radioButtonYesMultiselect().click();
        break;
      case 'No':
        this.radioButtonNo().click();
        break;
    }

    return result;
  }

  selectBinAndRadioButtonMultiselect2(can: string, radio: string) {
    this.canNumberMultiselect2().should('be.visible').click();
    cy.wait(1000);
    this.quantityMultiselect(can).should('be.visible').click();
    switch (radio) {
      case 'Yes':
        this.radioButtonYesMultiselect2().click();
        break;
      case 'No':
        this.radioButtonNo().click();
        break;
    }
  }

  // ----------------------------- NO SERVICE MODULE-------------------------------------

  noServiceBinSelected2(bin: string) {
    return cy.contains('span', `${bin}`);
  }

  // ---------------------------- SPLIT MODULE-----------------------------------------------
  // ---------------------------------------ADDITIONAL MODULE -----------------------------

  // ------------------------SUPPLEMENTAL---------------------------
  supplementalModule() {
    return cy.get('[id="active-route-modals"]>supplemental-modal>p-dialog>div');
  }

  supplementalServiceSelected(service: string) {
    return cy.contains('span', `${service}`);
  }

  // -------------multiplee supplementals---------------

  // -------------Multiple Additional---------------

  secondAccountAdditional() {
    return cy.get('.caption-right');
  }

  secondAdditionalText() {
    return cy.get('#additional-comments-2');
  }
  fillAdditionalModuleTextSecondAccount(text: string) {
    this.secondAdditionalText().should('be.enabled').click().clear().type(text);
  }

  // --------------Service Exception--------------------
  serviceExceptionStatus(rowNo: string) {
    return cy.get(`tbody[class='ui-table-tbody'] tr:nth-child(${parseInt(rowNo)})>td:nth-child(5)`);
  }

  // -------------------------- Warning message modal -------------------

  // ---------------------------- Get Available Can Quantity ------------------

  // --------------------------EXTRA SERVICE TABLE--------------------------

  quantityValue() {
    return cy
      .get(
        'service-events-modal table[class="ui-table-scrollable-body-table"]>tbody>tr>td:nth-child(3)'
      )
      .last();
  }

  closeButton() {
    return cy.get(
      '[id="active-route-modals"]>service-events-modal>p-dialog>div>div:nth-child(3)>p-footer>button'
    );
  }
  extraServiceTable() {
    return cy.get('[id="active-route-modals"]>service-events-modal>p-dialog>div');
  }

  verifyExtraServiceTable() {
    for (let i = 0; i < 10; i++) {
      try {
        this.extraServiceTable().should('be.visible');
      } catch (e) {
        cy.wait(1000);
      }
    }
  }

  getAllDate() {
    return cy.get('p-calendar table tbody tr td');
  }

  getDisabledDate() {
    return cy.get('p-calendar table tbody tr td span');
  }

  getEnabledDate() {
    return cy.get('p-calendar table tbody tr td a');
  }

  verifyDisabledDates() {
    this.getAllDate().each($el => {
      $el.find('span');
    });
  }

  waitForActiveRoutesPage() {
    return cy.xpath(
      '//td/p-dropdown[contains(@class,"ui-inputwrapper-filled ng-untouched ng-pristine ng-valid")]'
    );
  }

  waitForActiveRoutesPageLoad() {
    for (let i = 0; i < 10; i++) {
      try {
        this.waitForActiveRoutesPage().should('be.visible');
      } catch (e) {
        cy.wait(1000);
      }
    }
  }

  routeNumLink() {
    return cy.get(
      '[id="active-routes"]>p-table>div>div>table>tbody>tr:nth-child(1)>td:nth-child(2)>a:nth-child(1)'
    );
  }

  selectRouteNumber() {
    this.routeTable().should('be.visible');
    this.routeTable().trigger('mousemove');
    this.routeNumLink().trigger('mousemove');
    this.routeNumLink().click();
  }

  selectCheckBoxSequence(sequence: string) {
    cy.wait(3000);
    const sequenceValue = homepage.getSequence(sequence);

    this.searchSeqNumber().type('{ctrl}a');
    this.searchSeqNumber().clear();
    this.searchSeqNumber().type(sequenceValue);
    cy.wait(3000);
    this.checkBoxSequenceNumber(sequenceValue).scrollIntoView();
    this.checkBoxSequenceNumber(sequenceValue).click();

    return sequenceValue;
  }

  // ================= container quantity count=====================
  getServiceExcepetionQuantity() {
    return this.serviceExcepetionquantity().invoke('attr', 'innerText');
  }

  // ------------------------------------Blocked and No service button disabled for DEL-------------
  DblockedButton() {
    return cy.contains('Blocked');
  }

  trailerNumberColumn() {
    return cy.get('.p-datatable-thead > tr.ng-star-inserted').contains('Trailer Number');
  }

  DnoServiceButton() {
    return cy.contains('No Service');
  }
  blockedAndNoserviceFieldsdisabled() {
    this.DblockedButton().should('be.disabled');
    this.DnoServiceButton().should('be.disabled');
  }
}
const instance = new ActiveRoutes();

Object.freeze(instance);
export default instance;
