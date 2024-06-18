describe('My Cypress Test', () => {
  beforeEach(() => {
    // cy.getRoutesQuery('example').as('exampleQuery');
    // cy.fixture('divisions').as('divisions');
    // cy.wrap(`/operations?networkId=automation&token=${Cypress.env('secrets').riseToken}`).as(
    //   'riseURL'
    // );
    // cy.visit(`/operations?networkId=automation&token=${Cypress.env('secrets').riseToken}`);
    cy.nav('home', { auth: true });
    cy.setDivision('620');
    // cy.log(Cypress.env('riseURL'));
  });

  it('should visit the homepage', { tags: ['@grepTest'] }, function () {
    const divisionsTestCaseData = this.divisions[Cypress.env('env')];

    cy.log(JSON.stringify(divisionsTestCaseData.COMMHUBDIVISIONS));
    expect(String(this.riseURL)).to.include('eyJ');
  });

  it('should be able to log the queryResults', function () {
    this.exampleQuery = this.exampleQuery.replace(
      '${divisions}',
      this.divisions[Cypress.env('env')].IFTA_DIVISION
    );

    cy.routesQuery(this.exampleQuery).then((results: any) => {
      cy.log(results);
    });
  });

  it.only('test test', () => {
    cy.nav('activeRoutes');
    // cy.visit(`/operations?networkId=automation&token=${Cypress.env('secrets').riseToken}`);
    // cy.nav();
    // cy.initialLoad();

    // cy.get(`p-dropdown[placeholder="Select Division"]`, { timeout: 10000 })
    //   .should('be.visible')
    //   .click();
    // cy.get('input.p-dropdown-filter').type('015');
    // cy.get(`[role="option"][aria-label='015']`).click();

    // cy.get('span.sidebar-text').contains('Active Routes').click({ force: true });
    cy.url().then(url => {
      cy.log(url);
    });
  });
});
