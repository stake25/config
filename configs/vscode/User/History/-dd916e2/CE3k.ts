Cypress.Commands.add(
  'activeRoutes_beginActiveRoutesTests',
  (divisionNumber: string, routeDate: string) => {
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

    cy.wait('@getRoutes', { timeout: 5000 });
  }
);

Cypress.Commands.add('activeRoutes_selectDate', (routeDate: string) => {
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

Cypress.Commands.add('activeRoutes_filterRouteByNum', (routeNumber: string) => {
  cy.log(`And I filter for route ${routeNumber}`);
  cy.get(`p-multiselect[inputid='route-number']`).click();
  cy.get('#ar-route-number-filter').type(routeNumber);
  cy.contains('p-multiselectitem', routeNumber).click();
});

Cypress.Commands.add('activeRoutes_selectRoute', (routeNumber: string) => {
  cy.activeRoutes_filterRouteByNum(routeNumber);

  cy.log(`And I select the route ${routeNumber}`);
  cy.contains('a', routeNumber).click();
});

Cypress.Commands.add(
  'activeRoutes_getNumberOfStops',
  (division: string, routeDate: string, routeNumber: string) => {
    const query = `SELECT count(sequence)
      FROM ROUTES.ACTIVE_ROUTE_HEADER as arh
        INNER JOIN ROUTES.ACTIVE_ROUTE_DETAILS as ard
        ON arh.PK_ACTIVE_ROUTE_HEADER_ID = ard.XPK_ACTIVE_ROUTE_HEADER_ID
        AND INFOPRO_DIV='${division}'
        AND ROUTE_DATE='${routeDate}'
        AND arh.ROUTE_NUM='${routeNumber}';`;

    cy.log(query);

    cy.task('createMySQLConnection', query).then((recordset: any) => {
      if (recordset.length < 1) {
        throw new Error('There are no values in the results. Check the database data!');
      }
      cy.log(recordset);
      const rec: any = recordset;
      const results: any = Object.values(rec[0]);
      const sequenceCount = results[0];

      cy.log(`SequenceCount Current Route: ${sequenceCount}`);

      return cy.wrap(sequenceCount);
    });
  }
);

Cypress.Commands.add(
  'activeRoutes_validateServiceRecordings',
  (
    divisionNumber: string,
    routeDate: string,
    routeNumber: string,
    sequence: string,
    actionCode: string
  ) => {
    const validationQuery = `SELECT
    se.ACTION_CD STATUS,
    ard.SEQUENCE
    FROM
    ROUTES.ACTIVE_ROUTE_HEADER as arh
    INNER JOIN ROUTES.ACTIVE_ROUTE_DETAILS as ard ON
    arh.PK_ACTIVE_ROUTE_HEADER_ID = ard.XPK_ACTIVE_ROUTE_HEADER_ID
    INNER JOIN ROUTES.SERVICE_EVENTS AS se ON
    ard.PK_ACTIVE_ROUTE_DETAILS_ID = se.XPK_ACTIVE_ROUTE_DETAILS_ID
    WHERE INFOPRO_DIV='${divisionNumber}' 
    AND ROUTE_DATE='${routeDate}' 
    AND ROUTE_NUM = '${routeNumber}' 
    AND se.ACTION_CD = '${actionCode}' 
    AND ard.SEQUENCE = '${sequence}'`;

    cy.log(validationQuery);

    cy.task('createMySQLConnection', validationQuery).then((recordset: any) => {
      if (recordset.length < 1) {
        throw new Error('There are no values in the results. Check the database data!');
      }
      cy.log(recordset);
      const rec: any = recordset;
      const results: any = Object.values(rec[0]);

      cy.log(`Actual: ${results[0]}   Expected:${actionCode}`);
      expect(results[0]).equal(actionCode);
    });
  }
);

Cypress.Commands.add(
  'activeRoutes_getSecondSequence',
  (divisionNumber: string, routeDate: string, routeNumber: string, sequence: string) => {
    const additionalQuery = `
    SELECT
      ard.SEQUENCE
    FROM
      ROUTES.ACTIVE_ROUTE_DETAILS as ard
    INNER JOIN ROUTES.ACTIVE_ROUTE_HEADER as arh ON
      arh.PK_ACTIVE_ROUTE_HEADER_ID = ard.XPK_ACTIVE_ROUTE_HEADER_ID
    INNER JOIN ROUTES.SERVICE_EVENTS AS se ON
      se.XPK_ACTIVE_ROUTE_DETAILS_ID = ard.PK_ACTIVE_ROUTE_DETAILS_ID
      WHERE INFOPRO_DIV = '${divisionNumber}'
      AND ROUTE_DATE = '${routeDate}'
      AND ROUTE_NUM = '${routeNumber}'
      AND ard.QUANTITY = 1
      AND se.ACTION_CD NOT IN ( 
        'BLOCK_REROUTE', 
        'SUPPLEMENTAL', 
        'NO_SERVICE', 
        'BLOCK_RETRY', 
        'ADDITIONAL_EXT', 
        'SPLIT' )
      AND se.ACTION_CD = 'LIFT'
      AND NOT ard.SEQUENCE = ${sequence}
      GROUP BY
	  ROUTE_DATE, se.LAST_UPDATE_DTM
    LIMIT 1
    `;

    cy.dbUtil_executeSQLQuery(additionalQuery).then(results => {
      cy.log('Additional sequence: ', results[0]);

      return cy.wrap(results[0]);
    });
  }
);
