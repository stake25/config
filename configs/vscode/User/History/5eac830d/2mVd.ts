// added support plugin for drag and drop
import '@4tw/cypress-drag-drop';
import dbUtil from '@support/dbUtil';
import { queryData } from '@fixtures/queryData';
require('dotenv').config();

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --

// import {IFTA_DIVISION} from '@support/constants'

// Cypress.Commands.add('getDivisionNumber', (division) => {
// })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
// -- This is a dual command --
//
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
// commands.js
import 'cypress-log-to-output';
import { closeSync } from 'node:fs';

// //////// COMMAND DEFINITIONS ///////////////////
Cypress.Commands.add('setDivision', (division: string) => {
  cy.session(`division-${division}`, () => {
    window.sessionStorage.setItem('lastDivision', division);
  });
});

Cypress.Commands.add('getDivision', () => {
  return cy.wrap(window.sessionStorage.getItem('lastDivision'));
});

Cypress.Commands.add('nav', (page: string) => {
  return cy.fixture('urls').then(urls => {
    cy.visit(`${urls[page]}?networkId=automation&token=${Cypress.env('secrets').riseToken}`);

    return cy
      .get(`img[alt='Republic Services company logo']`, { timeout: 10000 })
      .should('be.visible');
  });
});

Cypress.Commands.add('getRoutesQuery', (queryName: string) => {
  cy.readFile(`cypress/fixtures/queries/routes/${queryName}.sql`).then(query => {
    return cy.wrap(query);
  });
});

Cypress.Commands.add('routesQuery', (query: string) => {
  return cy.task('createMySQLConnection', query).then((recordset: any[]) => {
    if (recordset.length < 1) {
      throw new Error(`There are no values in the results for the query:
        ${query}
        \n Check the database data!`);
    }

    return cy.wrap(recordset);
  });
});

Cypress.Commands.add('odsQuery', (queryName: string) => {
  cy.readFile(`cypress / fixtures / queries / ods / ${queryName}.sql`).then(query => {
    return cy.task('createMSSQLConnection', query);
  });
});

Cypress.Commands.add('generateDBQueryDate', (date: string) => {
  const dd = Number(queryData.routeDateUI ? date === 'queried' : date);

  const today = new Date();
  let mm = today.getMonth() + 1;
  const yyyy = today.getFullYear();

  if (dd < 10) {
    date = `0${String(dd)}`;
  }
  if (mm < 10) {
    mm = parseInt(`0${mm}`, 10);
  }

  return cy.wrap(`${yyyy} - ${mm} - ${date}`);
});

Cypress.Commands.add('getButton', (text: string) => {
  return cy.contains('button[type="button"]', text);
});

Cypress.Commands.add('getButtonSpan', (text: string) => {
  return cy.contains('button[type="button"] span', text);
});

Cypress.Commands.add('getRouteNoForCancelRouteWithData', (division: string) => {
  division = dbUtil.getDivisionNumber(division);
  const query = `SELECT SEQUENCE, INFOPRO_DIV, ROUTE_DATE, ROUTE_NUM, REV_DIST_CODE
    FROM ROUTES.ACTIVE_ROUTE_DETAILS as ard
    INNER JOIN ACTIVE_ROUTE_HEADER as arh
      ON arh.PK_ACTIVE_ROUTE_HEADER_ID = ard.XPK_ACTIVE_ROUTE_HEADER_ID
    INNER JOIN ROUTE_CLOSE_ACTIVITY as rca
      ON ard.PK_ACTIVE_ROUTE_DETAILS_ID = rca.XPK_ACTIVE_ROUTE_DETAILS_ID
      AND INFOPRO_DIV IN ${division}
      AND DAY(ROUTE_DATE) = DAY(CURRENT_DATE) + 1
      AND MONTH(ROUTE_DATE) = MONTH(CURRENT_DATE)
      AND ROUTE_FORMAT IN('R', 'C', 'I')
      AND ROUTE_DELAY_FLAG IS NULL
      AND arh.TRUCK_NUM IS NOT NULL
      AND arh.EMP1_DETAILS IS NOT NULL
      AND rca.START_TIME IS NOT NULL
      AND arh.STATUS = 'UPDATE_COMPLETE'
    GROUP BY ROUTE_DATE
    LIMIT 1`;

  cy.log(query);
  cy.task('createMySQLConnection', query).then((recordset: any) => {
    if (recordset.length < 1) {
      throw new Error('There are no values in the results. Check the database data!');
    }
    cy.log(recordset);
    const rec = recordset;

    const results = Object.values(rec[0]);

    queryData.infoProdivision = String(results[1]);
    queryData.routeDateUI = dbUtil.generateUIRouteDate(results[2]);

    dbUtil.generateDBQueryDate(queryData.routeDateUI);
    queryData.routeNumber = String(results[3]);
    queryData.revDistCode = String(results[4]);
    queryData.sequence = String(results[0]);

    cy.log(
      `TestData:::
    Division: ${queryData.infoProdivision}   
      RouteDate: ${queryData.routeDateUI}   
      RouteNo: ${queryData.routeNumber}   
      LOB: ${queryData.revDistCode}   
      Sequence : ${queryData.sequence}`
    );
  });
});

Cypress.Commands.add('selectDivision', (division: string) => {
  cy.get(`p-dropdown[placeholder = "Select Division"]`).click();
  cy.get('input.p-dropdown-filter');
  cy.get(`[role="option"][aria-label='${division}']`).click();
});
