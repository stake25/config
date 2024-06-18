import activeRoutesPage from '@pages/activeRoutesPage';
import dbUtils from '@support/dbUtil';
import homePage from '@pages/homePage';
import db_routes from '@support/database_routes';

describe('2023 - Portal Enhancements & Automation - Active Routes Page', () => {
  beforeEach(() => {
    // setup intercepts
    cy.intercept(
      'GET',
      'https://vehicles-services.riseqa1.awsext.repsrv.com/vehicles/v1/divisions/**/transfer-trucks**'
    ).as('getTransferTrucks');
    cy.intercept('GET', '**/active/routes/summary*').as('getRoutes');

    cy.log(`Given I get the testdata from DB to proceed with Active Route Service Event with CD 
      "NONIFTA" division`);

    cy.fixture('divisions').then(divisions => {
      const division = divisions[Cypress.env('env')].NONIFTA_DIVISION;

      cy.routesQuery('getRouteNoForActiveRouteServiceEventWithCD', {
        '${division}': division
      }).then(resultset => {
        cy.wrap(resultset).as('route');
        cy.wrap(new Date(resultset[0].ROUTE_DATE)).as('routeDate');
      });
    });

    //   [
    //     {
    //         "SEQUENCE": 2,
    //         "INFOPRO_DIV": "902",
    //         "ROUTE_DATE": "2024-06-13T04:00:00.000Z",
    //         "ROUTE_NUM": 4252,
    //         "REV_DIST_CODE": "3J",
    //         "STATUS": null,
    //         "ACCOUNT": "208244",
    //         "SITE": "00001",
    //         "CONTAINER_GRP": 3
    //     }
    //   ]
    // db_routes.getRouteNoForActiveRouteServiceEventWithCD('NONIFTA');
  });

  it(
    `Blocked and NO Service buttons should be disabled for DEL and NCL for Resi routes with 
    Container Delivery`,
    { tags: ['@TC_DisableBlockedAndNoserviceforCA_US86742', '@regression', '@activeRoutes'] },
    function () {
      // navigate to the Active Routes page
      cy.log('When I am on the Active Routes Page');
      cy.nav('activeRoutes', this.route[0].INFOPRO_DIV);
      cy.wait('@getTransferTrucks');

      // select the date queried
      cy.log('And I select a date "queried"');
      cy.activeRoutes_selectDate(this.routeDate.getUTCDate().toString());
      cy.wait('@getRoutes');

      // filter and click the route number from the db result
      cy.activeRoutes_filterRouteByNum(this.route[0].ROUTE_NUM.toString());
      cy.contains('a', this.route[0].ROUTE_NUM.toString()).click();

      // select the stop checkbox that corresponds to the route sequence
      cy.get('active-route-details').find('.p-checkbox-box').eq(this.route[0].SEQUENCE).click();

      // validate the blocked and no service buttons are disabled
      cy.contains('Blocked').should('be.disabled');
      cy.contains('No Service').should('be.disabled');
    }
  );
});
