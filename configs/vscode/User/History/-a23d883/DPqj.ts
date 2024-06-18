/* eslint-disable no-unused-vars */
declare namespace Cypress {
  interface Chainable {
    // commands.ts ---------------------------------------------------------------------------------

    /**
     * A command to generate a date string in the format 'yyyy-mm-dd' from a given day of the month
     * @param {string} date - The day of the month to generate the date for
     * @returns {Cypress.Chainable} - The date string in the format 'yyyy-mm-dd'
     */
    generateDBQueryDate(date: string): Cypress.Chainable;
    getButton(test: string): Cypress.Chainable;
    getButtonSpan(test: string): Cypress.Chainable;
    getRouteNoForCancelRouteWithData(division: string): void;
    getRoutesQuery(queryName: string): Cypress.Chainable;

    /**
     * Navigate to a page via readable names
     * @param {string} page - the page to navigate to
     * @param division - the division to set before navigation (optional)
     * @returns {Cypress.Chainable}
     * @example cy.nav('activeRoutes');
     */
    nav(page: string, division?: string): Cypress.Chainable;

    /**
     * A command to take a string query and run it against the ODS database
     * @param {string} queryName - The name of the file that contains the query
     * @returns {Cypress.Chainable} - The results of the query
     * @example cy.odsQuery('example.sql');
     */
    odsQuery(queryName: string): Cypress.Chainable;

    /**
     * A command to take the name of a routes query stored in the fixtures folder as a sql file and
     * run it against the routes database
     * @param {string} queryName - The name of the file that contains the query without the .sql
     * extension
     * @param {object} replacements - An object containing the values to replace in the query
     * @returns {Cypress.Chainable} - The results of the query
     * @example cy.routesQuery('example', { $division: '1234' });
     */
    routesQuery(queryName: string, replacements?): Cypress.Chainable;

    selectDivision(division: string): void;
    setDivision(session: string): void;
    getDivision(session: string): Cypress.Chainable;

    // commands_activeRoutes.ts --------------------------------------------------------------------
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

    activeRoutes_beginActiveRoutesTests(divisionNumber: string, routeDate: string): void;
    activeRoutes_selectDate(routeDate: string): void;
    activeRoutes_selectRoute(routeNumber: string): void;
    activeRoutes_getNumberOfStops(
      division: string,
      routeDate: string,
      routeNumber: string
    ): Cypress.Chainable;

    activeRoutes_validateServiceRecordings(
      divisionNumber: string,
      routeDate: string,
      routeNumber: string,
      sequence: string,
      actionCode: string
    ): void;
    activeRoutes_getSecondSequence(
      divisionNumber: string,
      routeDate: string,
      routeNumber: string,
      sequence: string
    ): Cypress.Chainable;

    // commands_serviceRecords.ts ------------------------------------------------------------------
    serviceRecords_beginServiceRecordsTests(divisionNumber: string): void;

    // commands_support.ts -------------------------------------------------------------------------
    support_beginSupportTests(divisionNumber: string): void;

    // commands_dbUtil.ts --------------------------------------------------------------------------
    dbUtil_getDivisionNumber(division: string): Cypress.Chainable;
    dbUtil_getCustomerDetail(divisionNumber?: string): Cypress.Chainable;
    dbUtil_getLobNumber(lob: string): Cypress.Chainable;
    dbUtil_executeSQLQuery(query: string): Cypress.Chainable;
    dbUtil_generateDBQueryDate(dd?: any): Cypress.Chainable;

    // commands_routeClosing.ts --------------------------------------------------------------------
    routeClosing_selectRouteClosingForDivision(testData: object): Cypress.Chainable;
    routeClosing_selectRouteClosingForDivision_v2(testData: object): Cypress.Chainable;
    routeClosing_selectDate(testData?: object): Cypress.Chainable;
    routeClosing_selectDateFromString(routeDate: string): Cypress.Chainable;
    routeClosing_selectLob(testData?: object): Cypress.Chainable;
    routeClosing_V2_selectLob(testData?: object): Cypress.Chainable;
    routeClosing_V2_selectRoute(testData?: object): Cypress.Chainable;
    routeClosing_selectRoute(testData?: object): Cypress.Chainable;
    routeClosing_selectRouteFromString(routeNumber: string): Cypress.Chainable;
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
    routeClosing_getDifferentRoute(
      divisionNumber: string,
      routeDate: string,
      routeNum: string,
      lob: string
    ): Cypress.Chainable;

    /**
     * Update Service Code For Sequence Number in route closing
     * @returns void
     * @param sequence
     * @param serviceCode
     * @param waitOnServiceCode
     */
    routeClosing_updateServiceCode(
      sequence: number,
      serviceCode: string,
      waitOnServiceCode?: boolean
    ): void;
    /**
     * Fill out the suspend modal according to the given criteria
     * @returns void
     * @param sequence
     * @param assignRoute
     * @param disposalBefore
     * @param routeNumber
     */
    routeClosing_suspendLoad(
      sequence: number,
      assignRoute: boolean,
      disposalBefore: boolean,
      routeNumber?: string
    ): void;
    routeClosing_validateSuspendedLoad(
      divisionNumber: string,
      routeNumber: string,
      routeDate: string,
      sequence: number
    ): void;
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
    // commands_activeRoutes.ts
  }
}
