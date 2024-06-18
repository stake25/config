/* eslint-disable no-unused-vars */
declare namespace Cypress {
  interface Chainable {
    // commands.ts
    generateDBQueryDate(date: string): Cypress.Chainable;
    getButton(test: string): Cypress.Chainable;
    getButtonSpan(test: string): Cypress.Chainable;
    getRouteNoForCancelRouteWithData(division: string): void;
    getRoutesQuery(queryName: string): Cypress.Chainable;

    /**
     * Navigate to a page via readable names
     * @param {string} page - the page to navigate to
     * @returns {Cypress.Chainable}
     * @example cy.nav('activeRoutes');
     */
    nav(page: string): Cypress.Chainable;

    /**
     * A command to take a string query and run it against the ODS database
     * @param {string} queryName - The name of the file that contains the query
     * @returns {Cypress.Chainable} - The results of the query
     * @example cy.odsQuery('example.sql');
     */
    odsQuery(queryName: string): Cypress.Chainable;
    routesQuery(queryName: string): Cypress.Chainable;
    selectDivision(division: string): void;
    setDivision(session: string): void;
    getDivision(session: string): Cypress.Chainable;

    // commands_activeRoutes.ts
    /**
     * Select a date on the active routes page
     * @param {string} date - the date to select
     * @returns {void} - No return value as this is an action
     * @example cy.activeRoutes_selectDate('16');
     */
    activeRoutes_selectDate(date: string): void;

    /**
     * Filter the route by route number
     * @function activeRoutes_filterRouteByNum
     * @param {string} routeNumber - The route number to filter by
     * @returns {void}  - No return value as this is an action
     * @example cy.activeRoutes_filterRouteByNum('4127');
     */
    activeRoutes_filterRouteByNum(routeNumber: string): void;

    /**
     * Navigate directly to a route details page
     * @param {string} date - the date the route is run
     * @param {string} routeNumber - the route number of the route
     * @returns {void}  - No return value as this is an action
     */
    activeRoutes_navRoute(date: string, routeNumber: string): void;

    // commands_serviceRecords.ts
    serviceRecords_beginServiceRecordsTests(divisionNumber: string): void;

    // commands_support.ts
    support_beginSupportTests(divisionNumber: string): void;

    // commands_dbUtil.ts
    dbUtil_getDivisionNumber(division: string): Cypress.Chainable;
    dbUtil_getCustomerDetail(divisionNumber?: string): Cypress.Chainable;
    dbUtil_getLobNumber(lob: string): Cypress.Chainable;
    dbUtil_executeSQLQuery(query: string): Cypress.Chainable;
    dbUtil_generateDBQueryDate(dd?: any): Cypress.Chainable;

    // commands_routeClosing.ts
    routeClosing_selectRouteClosingForDivision(testData: object): Cypress.Chainable;
    routeClosing_selectRouteClosingForDivision_v2(testData: object): Cypress.Chainable;
    routeClosing_selectDate(testData?: object): Cypress.Chainable;
    routeClosing_selectLob(testData?: object): Cypress.Chainable;
    routeClosing_V2_selectLob(testData?: object): Cypress.Chainable;
    routeClosing_V2_selectRoute(testData?: object): Cypress.Chainable;
    routeClosing_selectRoute(testData?: object): Cypress.Chainable;
    routeClosing_generateDBQueryDate(qd?: object): Cypress.Chainable;
    routeClosing_setStartState(testData: object): void;
    routeClosing_setStartState_v2(testData: object): void;
    routeClosing_getTestDataToVerifySequenceOrderFromDB(divisionNumber?: string): Cypress.Chainable;
    routeClosing_getRouteTestDataRC(divisionNumber?: string): Cypress.Chainable;
    routeClosing_getRouteTestDataSC(divisionNumber?: string): Cypress.Chainable;
    routeClosing_getMultipleEndedRoutes(divisionNumber?: string): Cypress.Chainable;
    routeClosing_getSuspendTestData(
      serviceCode: string,
      divisionNumber?: string
    ): Cypress.Chainable;
    routeClosing_getPupTrailerData(loads: string, divisionNumber?: string): Cypress.Chainable;
    routeClosing_getFailedStatusTestData(divisionNumber?: string): Cypress.Chainable;
    routeClosing_getDBDataForvalidations(
      status: string,
      divisionNumber?: string
    ): Cypress.Chainable;

    // commands_routeMaintenance.ts
    routeMaintenance_getContainerWithCompactor(
      container: string,
      compactor: string,
      divisionNumber?: string
    ): Cypress.Chainable;
    routeMaintenance_beginRouteMaintenanceTests(divisionNumber: string): void;

    // commands_webDispatch.ts
    webDispatch_beginWebDispatchTests(divisionNumber: string, routeDate: string): void;
    webDispatch_getWebDispatchData(divisionNumber?: string): Cypress.Chainable;

    // commands_createRoutes.tx
    createRoute_generateDBQueryDate(date: string, queryData: object): Cypress.Chainable;
    createRoutes_getRouteNoForCancelRouteWithData(
      divisionNumber?: string,
      queryData?: object
    ): Cypress.Chainable;
  }
}
