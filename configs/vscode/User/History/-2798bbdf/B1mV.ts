import RoutesDbConnectionManager from '@support/database_routes';
import homepage from '@pages/homePage';

class RouteReady {
  public pageName: string = `Route Ready Page`;
  getPickADateBox() {
    cy.get('#dateFilter', { timeout: 60000 }).should('be.visible');
    cy.get('#dateFilter', { timeout: 300000 }).should('be.enabled');

    return cy.get('#dateFilter');
  }

  oracleDivisionDropdown() {
    return cy
      .get(`p-dropdown[formcontrolname="accountingDivision"]`, { timeout: 10000 })
      .should('be.visible');
  }

  getTextboxInOracleDivisionDropdown() {
    return cy.get('input.p-dropdown-filter').should('be.visible');
  }

  getOracleDivisionNumberElement(division: string) {
    return cy.get(`[role="option"][aria-label='${division}']`);
  }

  getInstructionMessage() {
    return cy.get('p.alert-warning').should('be.visible');
  }

  waitForRouteReadyPageLoaded() {
    this.getPickADateBox().should('be.visible');
  }

  getNextBusinessDay(): Date {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday

    // If today is Friday, add 3 days to get to Monday
    if (dayOfWeek === 5) {
      // Friday
      return new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000); // Adding milliseconds for days
    } else if (dayOfWeek === 6) {
      // Saturday
      return new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000); // Adding 2 days for Monday
    } // Any other day

    return new Date(today.getTime() + 24 * 60 * 60 * 1000); // Adding 1 day for next business day
  }
}
const instance = new RouteReady();

Object.freeze(instance);
export default instance;
