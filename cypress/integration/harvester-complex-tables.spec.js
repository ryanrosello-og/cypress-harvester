/// <reference types="cypress" />

context('Harvester', () => {
  beforeEach(() => {
    // cy.visit('./cypress/fixtures/test_tables.html');
    cy.visit('./cypress/fixtures/complex_wonky_table.html');
    // cy.visit(
    //   'https://www.health.qld.gov.au/hrpolicies/wage-rates/wage-rates-clinical-assistants'
    // );
  });

  it('cy.fixture() - load a fixture', () => {
    cy.get('#complex')
      .scrapeTable2()
      .then((f) => {
        cy.log('done');
        cy.log(f);
      });
  });

  xit('cy.fixture() - load a fixture', () => {
    cy.get('#complex')
      .scrapeTable()
      .then((f) => {
        cy.log('done');
        cy.log(f);
      });
  });

  xit('cy.fixture() - load a fixture', () => {
    cy.get('table')
      .eq(0)
      .scrapeTable({ rowIndexForHeadings: 1 })
      .then((f) => {
        cy.log(f);
      });
  });
});
