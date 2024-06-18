import createRoutesPage from '@pages/createRoutesPage';
import homePage from '@pages/homePage';
import db_routes from '@support/database_routes';

let createdRouteNum: string;

describe('Create Alternate Routes', () => {
  before(() => {
    cy.fixture('queryData').as('queryData');
  });

  beforeEach(() => {
    cy.visit(`/operations?networkId=automation&token=${Cypress.env('secrets').riseToken}`);

    // When I click "Home" page in sidebar
    homePage.clickPageInSideBar('Home');
    cy.log('Clicked Home page in Sidebar');
    cy.get('body').click(0, 0);

    // When I am on the Home Page
    homePage.waitForHomePageLoaded();

    // When I select "CREATEROUTE" division
    homePage.selectDivision('CREATEROUTE');

    // When I click "Create/Print Routes" page in sidebar
    homePage.clickPageInSideBar('Create/Print Routes');
    cy.log('Clicked Create/Print Routes page in Sidebar');
    cy.get('body').click(0, 0);

    // And I select an available route 1
    const routeCount = 1;

    for (let i = 1; i <= routeCount; i++) {
      createRoutesPage.availableRoute(routeCount).then(returnRoute => {
        createdRouteNum = returnRoute.text();
      });
      createRoutesPage.selectAvailableRoute();
    }
  });

  it(
    'should create alternate routes',
    { tags: ['@TC_AlternateRoute_US36067', '@Feature_1.2', '@create', '@nonregression'] },
    function () {
      // And I click "Alternate Route Day" button
      homePage.clickButton('Alternate Route Day');
      cy.log('I click on Alternate Route Day button');
      cy.wait(3000);

      // When I click a date "25" on alternate route day modal
      homePage.selectAlternateDate('25');
      cy.wait(5000);

      // When  I click footer "Create" button
      homePage.clicFooterButton('Create');

      // And I see the success message "Your request to create the selected routes has been accepted."
      homePage.validateSuccessMessage(
        'Your request to create the selected routes has been accepted.'
      );

      // When I click "Create/Print Routes" page in sidebar
      homePage.clickPageInSideBar('Create/Print Routes');
      cy.log('Clicked Create/Print Routes page in Sidebar');
      cy.get('body').click(0, 0);

      // Then I should see selected route 1 in Available Routes as disabled
      cy.log(createdRouteNum);
      createRoutesPage.verifyAvailableRoutes(createdRouteNum, 1);

      // And I select a date "25" on Create Routes page
      createRoutesPage.selectDateForCreateRoute('25');

      // And I verify the created route is appeared in Created Routes section
      createRoutesPage.createdRoutes(createdRouteNum).scrollIntoView().should('be.visible');

      // And I retrieve the route number created from DB with "CREATEROUTE" division
      db_routes.getRouteNumFromDB(this.queryData.infoProdivision, createdRouteNum);
      cy.log('retrieved the route number created from DB');

      // And Check the DB to "SELECT" the field "COUNT(ard.`SEQUENCE`),arh.STATUS,arh.ROUTE_NUM" from the "ROUTES.ACTIVE_ROUTE_DETAILS" table
      this.queryData.queryAction = 'SELECT';
      this.queryData.queryResultField = 'COUNT(ard.`SEQUENCE`),arh.STATUS,arh.ROUTE_NUM';
      this.queryData.queryFromTable = 'ROUTES.ACTIVE_ROUTE_DETAILS';

      // And Verify the value of stops and route status as a "CREATE_COMPLETE" in DB
      createRoutesPage.getRouteNumberInCreateRoutePanel(createdRouteNum);
      createRoutesPage.verifyRouteCreated(createdRouteNum, 'CREATE_COMPLETE');
    }
  );
});
