import dbUtil from '@support/dbUtil';

const rc_GenerateDBQueryDate = dd => {
  const today = new Date();
  let mm = today.getMonth() + 1;
  const yyyy = today.getFullYear();

  if (dd < 10) {
    dd = `0${dd}`;
  }
  if (mm < 10) {
    mm = parseInt(`0${mm}`, 10);
  }

  return `${yyyy}-${mm}-${dd}`;
};

const rc_GenerateUIRouteDate = date => {
  date = `${date}`;
  const dd = `${date.toString().substring(8, 10)}`;

  return dd.charAt(0) === '0' ? dd.charAt(1) : dd;
};

Cypress.Commands.add('routeClosing_filterRouteByNum', (routeNumber: string) => {
  cy.contains('Select Route').click();
  cy.get('.p-multiselect-header').find('#rc-route-number-filter').clear();
  cy.get('.p-multiselect-header').find('#rc-route-number-filter').type(routeNumber);
  cy.get('div.p-multiselect-header.ng-star-inserted').find('p-checkbox').click();
  cy.get('body').click();
});

Cypress.Commands.add(
  'routeClosing_selectRouteClosingForDivision',
  { prevSubject: 'optional' },
  (prevData: object, testData: object) => {
    if (prevData) {
      testData = prevData;
    }
    // @ts-ignore
    const queryData = testData.queryData;

    cy.url().then(url => {
      if (!url.includes('networkId=automation')) {
        cy.visit(`/operations?networkId=automation&token=${Cypress.env('secrets').riseToken}`);
      }
      cy.log(`Setting up starting state for route closing test using testData`, testData);

      cy.log('testData', testData);

      cy.log(`And I select division ${queryData.infoProdivision}`);
      const divisionNumber = queryData.infoProdivision;

      cy.get('.p-dropdown-label').click();
      cy.get('input.p-dropdown-filter').type(divisionNumber);
      cy.intercept('GET', `**routes/v2/divisions/${divisionNumber}/routes/lob-descriptions`).as(
        `getRoutesForDivision${divisionNumber}`
      );
      cy.get(`[role="option"][aria-label=${divisionNumber}]`).click();
      cy.wait(`@getRoutesForDivision${divisionNumber}`);

      const page = 'Route Closing';

      cy.get('.sidebar-links-container').click();
      cy.get('span.sidebar-text').contains(page).invoke('show');
      cy.get('span.sidebar-text').contains(page).click();
      cy.get('body').click(0, 0);
      cy.log(`on home page for division: ${queryData.infoProdivision}`);
    });

    return cy.wrap(testData);
  }
);

Cypress.Commands.add('routeClosing_selectDate', (routeDate: object) => {
  cy.log('And I select a date "queried"');

  cy.intercept('GET', '**/active/routes/summary*').as('getRoutes');
  cy.intercept('POST', '**appmonitors/**').as('appMonitors');
  cy.intercept('GET', `**routes/v2/divisions/**/active/routes/summary?startDate=**`).as(
    'getActiveRoutesSummaryForDate'
  );

  cy.get('#date').should('exist');
  cy.get('#date').click();
  cy.get('.p-datepicker-calendar')
    .find('td')
    .not('.p-datepicker-other-month')
    .contains(` ${routeDate} `)
    .click();

  cy.wait('@getActiveRoutesSummaryForDate');
  cy.log(`Date ${routeDate} is selected`);
  cy.wait('@appMonitors');
  cy.get('.alert-pending').should('not.exist');
});

Cypress.Commands.add('routeClosing_selectDateFromString', (routeDate: string) => {
  cy.log('And I select a date "queried"');
  cy.intercept('GET', '**/active/routes/summary*').as('getRoutes');
  cy.intercept('POST', '**appmonitors/**').as('appMonitors');
  cy.intercept('POST', '**appmonitors/**').as('appMonitors');
  cy.get('#date').click();
  cy.intercept('GET', `**routes/v2/divisions/**/active/routes/summary?startDate=**`).as(
    'getActiveRoutesSummaryForDate'
  );
  cy.get('#date').should('exist');
  cy.get('.p-datepicker-calendar')
    .find('td')
    .not('.p-datepicker-other-month')
    .contains(` ${routeDate} `)
    .click();
  cy.wait('@getActiveRoutesSummaryForDate');
  cy.log(`Date ${routeDate} is selected`);
  cy.wait('@appMonitors');
  cy.wait('@appMonitors');
  cy.get('.alert-pending').should('not.exist');
});

Cypress.Commands.add(
  'routeClosing_selectLob',
  { prevSubject: 'optional' },
  (prevData: object, testData: object) => {
    if (prevData) {
      testData = prevData;
    }
    // @ts-ignore
    const queryData = testData.queryData;
    const lob = queryData.revDistCode ? queryData.revDistCode : null;

    cy.intercept('POST', '**appmonitors/**').as('appMonitors');

    if (lob) {
      cy.log(`And I select LOB ${lob}`);
      cy.get(
        // eslint-disable-next-line max-len
        `p-multiselect[inputid='lob']`
      ).click();
      cy.get('.p-multiselect-filter').type(lob);
      cy.get('span[class="ng-star-inserted"]').contains(lob).click({ multiple: true });
      cy.get('#filters').scrollIntoView();
      cy.get('body').click(0, 0);
      cy.log('Selected LOB');
    }
    cy.wait('@appMonitors');

    return cy.wrap(testData);
  }
);

Cypress.Commands.add(
  'routeClosing_selectRoute',
  { prevSubject: 'optional' },
  (prevData: object, testData: object) => {
    if (prevData) {
      testData = prevData;
    }
    // @ts-ignore
    const queryData = testData.queryData;
    const routeNumber = queryData.routeNumber;

    cy.log(`And I filter for route ${routeNumber}`);
    cy.get(
      // eslint-disable-next-line max-len
      `p-multiselect[inputid='route-number']`
    ).click();
    cy.get('#rc-route-number-filter').type(routeNumber);
    cy.get('span[class="ng-star-inserted"]').contains(routeNumber).click({ multiple: true });
    cy.get('#filters').scrollIntoView();
    cy.get('body').click(0, 0);
    cy.log('Selected Route');

    cy.log(`And I select route ${routeNumber}`);
    cy.intercept('GET', '**routes/v1/divisions/**/routes/**/active/disposals/trux**').as('getTrux');

    cy.contains('a', routeNumber).click();
    cy.log('Route selected');

    cy.log('And I wait for "open" route details to load');
    cy.wait('@getTrux');
    cy.get(
      '#route-closing-form > div.btn-group.section-container > div.btn-group-col.ng-star-inserted'
    ).then($button => {
      if ($button.text().includes('Reopen')) {
        cy.log('Route Closed, Reopening');
        cy.get(
          '#route-closing-form > div.btn-group.section-container > div.btn-group-col.ng-star-inserted'
        ).click();
      }
    });
    cy.get('#open-clock-in').should('not.have.attr', 'disabled');
    cy.get('#route-closing-details-save-buton', { timeout: 60000 }).should('be.visible');
    cy.contains('Load Times & Disposal Sites').parent().find('p-table').should('be.visible');
    cy.log('Route details loaded');

    return cy.wrap(testData);
  }
);

Cypress.Commands.add('routeClosing_selectRouteFromString', (routeNumber: string) => {
  const regex = new RegExp(`${routeNumber.toString().charAt(0)}\\d{3}`);

  cy.log(`And I filter for route ${routeNumber}`);
  cy.get(`p-multiselect[inputid='route-number']`).click();
  cy.get('#rc-route-number-filter').clear();
  cy.log('Verifying that the filter dropdown contains the first digit of the route number', regex);
  cy.get(':nth-child(1) > .p-ripple > .ng-star-inserted').invoke('text').should('match', regex);
  cy.get('#rc-route-number-filter').type(routeNumber);
  cy.contains('p-multiselectitem', routeNumber).click();

  cy.log(`And I select the route ${routeNumber}`);
  cy.contains('a', routeNumber).click();
});

Cypress.Commands.add('routeClosing_setStartState', (testData: object) => {
  cy.url().then(url => {
    if (!url.includes('networkId=automation')) {
      cy.visit(`/operations?networkId=automation&token=${Cypress.env('secrets').riseToken}`);
    }
    cy.log(`Setting up starting state for route closing test using testData`, testData);
    // @ts-ignore
    const queryData = testData.queryData;

    cy.log('testData', testData);

    cy.log(`And I select division ${queryData.infoProdivision}`);
    // cy.intercept('GET', `**vehicles/v1/divisions/${queryData.infoProdivision}/vehicles**`).as(
    //   'getVehicles'
    // );
    const divisionNumber = queryData.infoProdivision;

    cy.get('.p-dropdown-label').click();
    cy.get('input.p-dropdown-filter').type(divisionNumber);
    cy.intercept('GET', `**routes/v2/divisions/${divisionNumber}/routes/lob-descriptions`).as(
      `getRoutesForDivision${divisionNumber}`
    );
    cy.get(`[role="option"][aria-label=${divisionNumber}]`).click();
    cy.wait(`@getRoutesForDivision${divisionNumber}`);

    const page = 'Route Closing';

    cy.get('.sidebar-links-container').click();
    cy.get('span.sidebar-text').contains(page).invoke('show');
    cy.get('span.sidebar-text').contains(page).click();
    cy.get('body').click(0, 0);
    // cy.wait('@getVehicles');
    cy.log(`on home page for division: ${queryData.infoProdivision}`);

    let day = queryData.routeDateUI;

    if (!day) {
      let regex = /\d{4}-/i;

      day = queryData.sequence.replace(regex, '');
      regex = /-.*/i;
      day = day.replace(regex, '');
      if (day.charAt(0) === '0') {
        day = day.slice(1);
      }
    }

    cy.log(`And I select a date ${day}`);
    cy.intercept('POST', '**appmonitors/**').as('appMonitors');
    cy.intercept('GET', `**routes/v2/divisions/**/active/routes/summary?startDate=**`).as(
      'getActiveRoutesSummaryForDate'
    );
    cy.get('#date').click();
    cy.get('#date').should('exist');
    cy.get('.p-datepicker-calendar')
      .find('td')
      .not('.p-datepicker-other-month')
      .contains(` ${day} `)
      .click();
    cy.wait('@getActiveRoutesSummaryForDate');
    cy.log(`Date ${day} is selected`);

    const lob = queryData.revDistCode ? queryData.revDistCode : null;

    cy.wait('@appMonitors');

    if (lob) {
      cy.log(`And I select LOB ${lob}`);
      cy.get(
        // eslint-disable-next-line max-len
        `p-multiselect[inputid='lob']`
      ).click();
      cy.wait(3000);
      cy.get('.p-multiselect-filter').type(lob);
      cy.get('span[class="ng-star-inserted"]').contains(lob).click({ multiple: true });
      cy.get('#filters').scrollIntoView();
      cy.get('body').click(0, 0);
      cy.log('Selected LOB');
    }

    const routeNumber = queryData.routeNumber;

    cy.log(`And I filter for route ${routeNumber}`);
    cy.get(
      // eslint-disable-next-line max-len
      `p-multiselect[inputid='route-number']`
    ).click();
    cy.get('#rc-route-number-filter').type(routeNumber);
    cy.get('span[class="ng-star-inserted"]').contains(routeNumber).click({ multiple: true });
    cy.get('#filters').scrollIntoView();
    cy.get('body').click(0, 0);
    cy.log('Selected Route');

    cy.log(`And I select route ${routeNumber}`);
    cy.intercept('GET', '**routes/v1/divisions/**/routes/**/active/disposals/trux**').as('getTrux');

    cy.contains('a', routeNumber).click();
    cy.log('Route selected');

    cy.log('And I wait for "open" route details to load');
    cy.wait('@getTrux');
    cy.get(
      '#route-closing-form > div.btn-group.section-container > div.btn-group-col.ng-star-inserted'
    ).then($button => {
      if ($button.text().includes('Reopen')) {
        cy.log('Route Closed, Reopening');
        cy.get(
          '#route-closing-form > div.btn-group.section-container > div.btn-group-col.ng-star-inserted'
        ).click();
      }
    });
    cy.get('#open-clock-in').should('not.have.attr', 'disabled');
    cy.get('#route-closing-details-save-buton', { timeout: 60000 }).should('be.visible');
    cy.contains('Load Times & Disposal Sites').parent().find('p-table').should('be.visible');
    cy.log('Route details loaded');
  });

  Cypress.Commands.add(
    'routeClosing_generateDBQueryDate',
    { prevSubject: 'optional' },
    (prevData: object, qd?: object) => {
      // @ts-ignore
      const divisionNumber = prevData && prevData.divisionNumber ? prevData.divisionNumber : null;
      // @ts-ignore
      const queryData = prevData && prevData.queryData ? prevData.queryData : qd;
      // @ts-ignore
      const lineOfBusiness = prevData && prevData.lineOfBusiness ? prevData.lineOfBusiness : null;

      let dd = queryData.routeDateUI;
      const today = new Date();
      let mm = today.getMonth() + 1;
      const yyyy = today.getFullYear();

      if (dd < 10) {
        dd = `0${dd}`;
      }
      if (mm < 10) {
        mm = parseInt(`0${mm}`, 10);
      }
      queryData.routeDate = `${yyyy}-${mm}-${dd}`;

      return cy.wrap({ divisionNumber, queryData, lineOfBusiness });
    }
  );

  Cypress.Commands.add(
    'routeClosing_getRouteTestDataRC',
    { prevSubject: 'optional' },
    (prevData: object, divisionNumber?: string) => {
      // @ts-ignore
      divisionNumber = prevData && prevData.divisionNumber ? prevData.divisionNumber : null;
      // @ts-ignore
      const queryData = prevData && prevData.queryData ? prevData.queryData : null;
      // @ts-ignore
      const lineOfBusiness = prevData && prevData.lineOfBusiness ? prevData.lineOfBusiness : null;

      cy.fixture('queries/getRouteTestDataRC.txt').then(query => {
        query = query.replace('$divisionNumber', divisionNumber);

        cy.log(query);
        cy.task('createMySQLConnection', query).then((recordset: any) => {
          if (recordset.length < 1) {
            throw new Error('There are no values in the results. Check the database data!');
          }
          cy.log(recordset);
          const results: any = Object.values(recordset[0]);

          queryData.infoProdivision = results[0];
          const dd = `${results[1].toString().substring(8, 10)}`;

          queryData.routeDateUI = dd.charAt(0) === '0' ? dd.charAt(1) : dd;
          queryData.routeNumber = results[3];
          queryData.revDistCode = results[2];
          cy.log(
            // eslint-disable-next-line max-len
            `TestData:::  Division: ${queryData.infoProdivision}   RouteDate:${queryData.routeDateUI}   RouteNo:${queryData.routeNumber}   LOB: ${queryData.revDistCode}`
          );
        });

        return cy.wrap({ divisionNumber, queryData, lineOfBusiness });
      });
    }
  );
});

Cypress.Commands.add(
  'routeClosing_getRouteTestDataSC',
  { prevSubject: 'optional' },
  (prevData: object, divisionNumber?: string) => {
    // @ts-ignore
    divisionNumber = prevData && prevData.divisionNumber ? prevData.divisionNumber : null;
    // @ts-ignore
    const queryData = prevData && prevData.queryData ? prevData.queryData : null;
    // @ts-ignore
    const lineOfBusiness = prevData && prevData.lineOfBusiness ? prevData.lineOfBusiness : null;

    cy.fixture('queries/getRouteTestDataSC.txt').then(query => {
      query = query.replace('$divisionNumber', divisionNumber);

      cy.log(query);
      cy.task('createMySQLConnection', query).then((recordset: any) => {
        if (recordset.length < 1) {
          throw new Error('There are no values in the results. Check the database data!');
        }
        cy.log(recordset);
        const results: any = Object.values(recordset[0]);

        queryData.infoProdivision = results[0];
        queryData.routeDateUI = rc_GenerateUIRouteDate(results[1]);
        queryData.routeDate = rc_GenerateDBQueryDate(queryData.routeDateUI);
        queryData.routeNumber = results[2];
        queryData.sequence = results[3];
        queryData.revDistCode = results[4];
        queryData.serviceCode = results[5];
        cy.log(
          `TestData:::  Division: ${queryData.infoProdivision}  RouteDate:${queryData.routeDateUI}  
          RouteNo:${queryData.routeNumber}  Sequence:${queryData.sequence}  
          ServiceCode:${queryData.serviceCode}  LOB: ${queryData.revDistCode}`
        );
      });

      return cy.wrap({ divisionNumber, queryData, lineOfBusiness });
    });
  }
);

Cypress.Commands.add(
  'routeClosing_getSuspendTestData',
  { prevSubject: 'optional' },
  (prevData: object, serviceCode: string, divisionNumber?: string) => {
    // @ts-ignore
    divisionNumber = prevData && prevData.divisionNumber ? prevData.divisionNumber : null;
    // @ts-ignore
    const queryData = prevData && prevData.queryData ? prevData.queryData : null;
    // @ts-ignore
    const lineOfBusiness = prevData && prevData.lineOfBusiness ? prevData.lineOfBusiness : null;

    cy.fixture('queries/getSuspendTestData.txt').then(query => {
      query = query.replace('$divisionNumber', divisionNumber);
      query = query.replace('$serviceCode', serviceCode);

      cy.log(query);
      cy.task('createMySQLConnection', query).then((recordset: any) => {
        if (recordset.length < 1) {
          throw new Error('There are no values in the results. Check the database data!');
        }
        cy.log(recordset);
        const results: any = Object.values(recordset[0]);

        queryData.infoProdivision = results[0];
        queryData.routeDateUI = rc_GenerateUIRouteDate(results[1]);
        queryData.routeDate = rc_GenerateDBQueryDate(queryData.routeDateUI);
        queryData.routeNumber = results[2];
        queryData.sequence = results[3];
        queryData.route = results[4];
        queryData.serviceCode = results[5];
        cy.log(
          `TestData:::  Division: ${queryData.infoProdivision}  RouteDate:${queryData.routeDateUI}  
          RouteNo:${queryData.routeNumber}  Sequence:${queryData.sequence}  
          ServiceCode:${queryData.serviceCode}  LOB: ${queryData.revDistCode}`
        );
      });

      return cy.wrap({ divisionNumber, queryData, lineOfBusiness });
    });
  }
);

Cypress.Commands.add(
  'routeClosing_getPupTrailerData',
  { prevSubject: 'optional' },
  (prevData: object, loads: string, divisionNumber?: string) => {
    // @ts-ignore
    divisionNumber = prevData && prevData.divisionNumber ? prevData.divisionNumber : null;
    // @ts-ignore
    const queryData = prevData && prevData.queryData ? prevData.queryData : null;
    // @ts-ignore
    const lineOfBusiness = prevData && prevData.lineOfBusiness ? prevData.lineOfBusiness : null;

    cy.fixture('queries/getPupTrailerData.txt').then(query => {
      query = query.replace('$division', divisionNumber);
      query = query.replace('$loads', loads);
      cy.log(query);
      cy.task('createMySQLConnection', query).then((recordset: any) => {
        if (recordset.length < 1) {
          throw new Error('There are no values in the results. Check the database data!');
        }
        cy.log(recordset);
        const results: any = Object.values(recordset[0]);

        queryData.infoProdivision = results[2];
        queryData.routeDateUI = rc_GenerateUIRouteDate(results[3]);
        queryData.routeDate = rc_GenerateDBQueryDate(queryData.routeDateUI);
        queryData.routeNumber = results[1];
        queryData.sequence = results[5];
        queryData.revDistCode = results[4];
        queryData.serviceCode = results[6];
        queryData.quantity = results[0];

        cy.log(
          `TestData:::  Division: ${queryData.infoProdivision}  RouteDate:${queryData.routeDateUI}  
          RouteNo:${queryData.routeNumber}   LOB: ${queryData.revDistCode}  
          ServiceCode :${queryData.serviceCode}  Sequence: ${queryData.sequence}  
          Total Lifts: ${queryData.quantity}`
        );

        return cy.wrap({ divisionNumber, queryData, lineOfBusiness });
      });
    });
  }
);

Cypress.Commands.add(
  'routeClosing_getFailedStatusTestData',
  { prevSubject: 'optional' },
  (prevData: object, divisionNumber?: string) => {
    // @ts-ignore
    divisionNumber = prevData && prevData.divisionNumber ? prevData.divisionNumber : null;
    // @ts-ignore
    const queryData = prevData && prevData.queryData ? prevData.queryData : null;
    // @ts-ignore
    const lineOfBusiness = prevData && prevData.lineOfBusiness ? prevData.lineOfBusiness : null;

    cy.fixture('queries/getFailedStatusTestData.txt').then(query => {
      query = query.replace('$division', divisionNumber);
      cy.log(query);
      cy.task('createMySQLConnection', query).then((recordset: any) => {
        if (recordset.length < 1) {
          throw new Error('There are no values in the results. Check the database data!');
        }
        cy.log(recordset);
        const results: any = Object.values(recordset[0]);

        queryData.infoProdivision = results[0];
        queryData.routeDateUI = rc_GenerateUIRouteDate(results[3]);
        queryData.routeDate = rc_GenerateDBQueryDate(queryData.routeDateUI);
        queryData.routeNumber = results[2].ROUTE_NUM;
        queryData.revDistCode = results[5].REV_DIST_CODE;
        queryData.quantity = results[3].QUANTITY;
        queryData.sequence = results[4].SEQUENCE;

        cy.log(
          `TestData:::  Division: ${queryData.infoProdivision}   
          RouteDate:${queryData.routeDateUI}   
          RouteNo:${queryData.routeNumber}   LOB: ${queryData.revDistCode}   
          Sequence :${queryData.sequence}`
        );

        return cy.wrap({ divisionNumber, queryData, lineOfBusiness });
      });
    });
  }
);

Cypress.Commands.add(
  'routeClosing_getDBDataForvalidations',
  { prevSubject: 'optional' },
  (prevData: object, status: string, divisionNumber?: string) => {
    // @ts-ignore
    divisionNumber = prevData && prevData.divisionNumber ? prevData.divisionNumber : null;
    // @ts-ignore
    const queryData = prevData && prevData.queryData ? prevData.queryData : null;
    // @ts-ignore
    const lineOfBusiness = prevData && prevData.lineOfBusiness ? prevData.lineOfBusiness : null;

    cy.fixture('queries/getDBDataForvalidations.txt').then(query => {
      query = query.replace('$division', divisionNumber);
      query = query.replace('$status', status);
      cy.log(query);

      cy.task('createMySQLConnection', query).then((recordset: any) => {
        if (recordset.length < 1) {
          throw new Error('There are no values in the results. Check the database data!');
        }
        cy.log(recordset);
        const results: any = Object.values(recordset[0]);

        queryData.infoProdivision = results[0];
        queryData.routeDateUI = dbUtil.generateUIRouteDate(results[1]);
        queryData.routeDate = results[1];
        dbUtil.generateDBQueryDate(queryData.routeDateUI, true);
        queryData.routeNumber = results[2];
        queryData.revDistCode = results[3];
        cy.log(
          `TestData:::  Division: ${queryData.infoProdivision} RouteDate:${queryData.routeDateUI}
          RouteNo:${queryData.routeNumber} LOB:${queryData.revDistCode}`
        );

        return cy.wrap({ divisionNumber, queryData, lineOfBusiness });
      });
    });
  }
);

Cypress.Commands.add(
  'routeClosing_getMultipleEndedRoutes',
  { prevSubject: 'optional' },
  (prevData: object, divisionNumber?: string) => {
    // @ts-ignore
    divisionNumber = prevData && prevData.divisionNumber ? prevData.divisionNumber : null;
    // @ts-ignore
    const queryData = prevData && prevData.queryData ? prevData.queryData : null;
    // @ts-ignore
    const lineOfBusiness = prevData && prevData.lineOfBusiness ? prevData.lineOfBusiness : null;

    cy.fixture('queries/getMultipleEndedRoutes.txt').then(query => {
      query = query.replace('$division', divisionNumber);
      cy.log(query);

      cy.task('createMySQLConnection', query).then((recordset: any) => {
        if (recordset.length < 1) {
          throw new Error('There are no values in the results. Check the database data!');
        }
        cy.log(recordset);
        const results: any = Object.values(recordset[0]);

        queryData.infoProdivision = results[4];
        queryData.routeDateUI = rc_GenerateUIRouteDate(results[3]);
        queryData.routeDate = rc_GenerateDBQueryDate(queryData.routeDateUI);
        queryData.routeNumber = results[0];
        queryData.revDistCode = results[5];

        cy.log(
          `TestData:::  Division: ${queryData.infoProdivision}   
          RouteDate:${queryData.routeDateUI}   
          RouteNo:${queryData.routeNumber}   LOB: ${queryData.revDistCode}`
        );

        return cy.wrap({ divisionNumber, queryData, lineOfBusiness });
      });
    });
  }
);

Cypress.Commands.add(
  'routeClosing_selectRouteClosingForDivision_v2',
  { prevSubject: 'optional' },
  (prevData: object, testData: object) => {
    if (prevData) {
      testData = prevData;
    }
    // @ts-ignore
    const queryData = testData.queryData;

    cy.url().then(url => {
      if (!url.includes('networkId=automation')) {
        cy.visit(`/operations?networkId=automation&token=${Cypress.env('secrets').riseToken}`);
      }
      cy.log(`Setting up starting state for route closing test using testData`, testData);

      cy.log('testData', testData);

      cy.log(`And I select division ${queryData.infoProdivision}`);
      const divisionNumber = queryData.infoProdivision;

      cy.get('.p-dropdown-label').click();
      cy.get('input.p-dropdown-filter').type(divisionNumber);
      cy.intercept('GET', `**routes/v2/divisions/${divisionNumber}/routes/lob-descriptions`).as(
        `getRoutesForDivision${divisionNumber}`
      );
      cy.get(`[role="option"][aria-label=${divisionNumber}]`).click();
      cy.wait(`@getRoutesForDivision${divisionNumber}`);

      const page = '*NEW* Route Closing';

      cy.get('.sidebar-links-container').click();
      cy.get('span.sidebar-text').contains(page).invoke('show');
      cy.get('span.sidebar-text').contains(page).click();
      cy.get('body').click(0, 0);
      cy.log(`on home page for division: ${queryData.infoProdivision}`);
    });

    return cy.wrap(testData);
  }
);

Cypress.Commands.add(
  'routeClosing_V2_selectLob',
  { prevSubject: 'optional' },
  (prevData: object, testData: object) => {
    if (prevData) {
      testData = prevData;
    }
    // @ts-ignore
    const queryData = testData.queryData;

    const lob = queryData.revDistCode;

    cy.intercept('POST', '**appmonitors/**').as('appMonitors');

    if (lob) {
      cy.log(`And I select LOB ${lob}`);
      cy.get(
        // eslint-disable-next-line max-len
        `p-multiselect[inputid='lob']`
      ).click();
      cy.wait('@appMonitors');
      cy.get('.p-multiselect-filter').type(lob);
      cy.get('li.p-multiselect-item').contains(lob).click({ multiple: true });
    }

    return cy.wrap(testData);
  }
);

Cypress.Commands.add(
  'routeClosing_V2_selectRoute',
  { prevSubject: 'optional' },
  (prevData: object, testData: object) => {
    if (prevData) {
      testData = prevData;
    }
    // @ts-ignore
    const queryData = testData.queryData;
    const routeNumber = queryData.routeNumber;

    cy.log(`And I filter for route ${routeNumber}`);
    cy.get('.p-element.p-datatable-tbody tr td a').contains(routeNumber).click({ multiple: true });

    cy.get('#open-clock-in').should('not.have.attr', 'disabled');

    return cy.wrap(testData);
  }
);

Cypress.Commands.add(
  'routeClosing_getDifferentRoute',
  (divisionNumber: string, routeDate: string, routeNum: string, lob: string) => {
    const query = `SELECT ROUTE_NUM FROM ACTIVE_ROUTE_HEADER as arh
      WHERE INFOPRO_DIV='${divisionNumber}' 
      AND ROUTE_DATE='${routeDate}' 
      AND ROUTE_NUM != '${routeNum}' 
      AND REV_DIST_CODE = '${lob}'
      ORDER BY ROUTE_NUM ASC LIMIT 1`;

    cy.log(query);

    cy.task('createMySQLConnection', query).then((recordset: any) => {
      if (recordset.length < 1) {
        throw new Error('There are no values in the results. Check the database data!');
      }
      cy.log(recordset);
      const rec: any = recordset;
      const results: any = Object.values(rec[0]);

      return cy.wrap(results[0]);
    });
  }
);

Cypress.Commands.add(
  'routeClosing_updateServiceCode',
  (sequence: number, serviceCode: string, waitOnServiceCode = true) => {
    cy.intercept('PUT', `**routes/v2/divisions/**/routes/**/active/stops/**`).as(
      'updateServiceCode'
    );
    sequence
      ? cy.get(`p-dropdown[formcontrolname="serviceCode"]`).eq(sequence).click()
      : cy.get(`p-dropdown[formcontrolname="serviceCode"]`).first().click();
    cy.get('input.p-dropdown-filter').type(serviceCode);
    cy.contains('p-dropdownitem', serviceCode).click();
    waitOnServiceCode ?? cy.wait('@updateServiceCode');
  }
);

Cypress.Commands.add(
  'routeClosing_suspendLoad',
  (sequence: number, assignRoute: boolean, disposalBefore: boolean, routeNumber?: string) => {
    sequence
      ? cy.get(`p-dropdown[formcontrolname="serviceCode"]`).eq(sequence).click()
      : cy.get(`p-dropdown[formcontrolname="serviceCode"]`).first().click();
    cy.get('input.p-dropdown-filter').clear();
    cy.get('input.p-dropdown-filter').type('SUS - SUSPEND');
    cy.contains('p-dropdownitem', 'SUS - SUSPEND').click();

    if (assignRoute) {
      cy.get('#assign-true').click();
      cy.get('p-dropdown[formcontrolname="targetRouteNumber"').click();
      cy.contains('p-dropdownitem', routeNumber).click();
    } else {
      cy.get('#assign-false').click();
    }

    if (disposalBefore) {
      cy.get('#before').click();
    } else {
      cy.get('#after').click();
    }

    cy.contains('button', 'OK').click();
  }
);

Cypress.Commands.add(
  'routeClosing_validateSuspendedLoad',
  (divisionNumber: string, routeNumber: string, routeDate: string, sequence: number) => {
    cy.log('Validating Suspended load in the Database');
    const validationQuery = `
          SELECT
          IS_SUSPENDED 
          FROM
            ROUTES.ACTIVE_ROUTE_DETAILS as ard
          INNER JOIN ROUTES.ACTIVE_ROUTE_HEADER as arh ON
            arh.PK_ACTIVE_ROUTE_HEADER_ID = ard.XPK_ACTIVE_ROUTE_HEADER_ID
          WHERE
            arh.INFOPRO_DIV = '${divisionNumber}'
            AND arh.ROUTE_NUM = '${routeNumber}'
            AND arh.ROUTE_DATE = '${routeDate}'
            AND ard.SEQUENCE = '${sequence}'`;

    cy.dbUtil_executeSQLQuery(validationQuery).then(results => {
      const isSuspended = results[0];

      expect(isSuspended).to.equal('1');
    });
  }
);
