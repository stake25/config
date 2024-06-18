import dbUtil from '@support/dbUtil';

describe('Active Routes - Page validate', () => {
  it(
    'Verify Routes in Active Route page',
    { tags: ['@TTC_ActiveRouteTable', '@regression', '@activeRoutes'] },
    function () {
      cy.fixture('divisions').as('divisions');
      cy.getRoutesQuery('getActiveRoutesData').then(query => {
        query = query.replace(
          '$divisionNumber',
          this.divisions[Cypress.env('env')].NONIFTA_DIVISION
        );
        query = query.replace(
          '$routeFormat',
          this.divisions[Cypress.env('env')].SMALL_CONTAINER_FORMAT
        );

        cy.dbUtil_executeSQLQuery(query).then(results => {
          const divisionNumber = results[0];
          const routeDate = dbUtil.generateUIRouteDate(results[1]);
          const routeNumber = results[2];

          cy.setDivision(divisionNumber);
          cy.nav('activeRoutes');
          cy.activeRoutes_selectDate(routeDate);
          cy.activeRoutes_selectRoute(routeNumber);
        });
      });

      cy.log('And I verify Route Sequence table is displayed');
      cy.get("p-table[datakey='sequence']").find('.p-datatable-thead').should('be.visible');
      cy.get("p-table[datakey='sequence']").find('tbody.p-datatable-tbody').should('be.visible');

      cy.log('Then I see Active Route Details table with stops');
      cy.contains('button', 'Blocked').should('be.disabled');
      cy.contains('button', 'No Service').should('be.disabled');
      cy.contains('button', 'Split').should('be.disabled');
      cy.contains('button', 'Additional').should('be.disabled');
      cy.contains('button', 'Supplemental').should('be.disabled');
    }
  );
});
