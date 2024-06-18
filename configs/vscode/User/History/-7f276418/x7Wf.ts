Cypress.Commands.add('createRoute_generateDBQueryDate', (date: string, queryData: object) => {
  // @ts-ignore
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

  return cy.wrap(`${yyyy}-${mm}-${date}`);
});

Cypress.Commands.add(
  'createRoutes_getRouteNoForCancelRouteWithData',
  { prevSubject: 'optional' },
  (prevData: object, divisionNumber: string) => {
    // @ts-ignore
    divisionNumber = prevData && prevData.divisionNumber ? prevData.divisionNumber : null;
    // @ts-ignore
    const queryData = prevData && prevData.queryData ? prevData.queryData : null;

    cy.fixture('queries/getRouteNoForCancelRouteWithData').then(query => {
      query = query.replace('$division', divisionNumber);
      cy.routesQuery('getRouteNoForCancelRouteWithData' { '$division': divisionNumber}).then((recordset: any) => {
        if (recordset.length < 1) {
          throw new Error('There are no values in the results. Check the database data!');
        }
        cy.log(recordset);
        const rec = recordset;

        const results = Object.values(rec[0]);

        // @ts-ignore
        queryData.infoProdivision = String(results[1]);
        // @ts-ignore
        const dd = `${results[2].toString().substring(8, 10)}`;
        // @ts-ignore

        queryData.routeDateUI = dd.charAt(0) === '0' ? dd.charAt(1) : dd;

        queryData.routeNumber = String(results[3]);
        queryData.revDistCode = String(results[4]);
        queryData.sequence = String(results[0]);

        cy.log(
          // @ts-ignore
          // eslint-disable-next-line max-len
          `TestData:::  Division: ${queryData.infoProdivision}   RouteDate:${queryData.routeDateUI}   RouteNo:${queryData.routeNumber}   LOB: ${queryData.revDistCode}   Sequence : ${queryData.sequence}`
        );

        return cy.wrap(divisionNumber, queryData);
      });
    });
  }
);
