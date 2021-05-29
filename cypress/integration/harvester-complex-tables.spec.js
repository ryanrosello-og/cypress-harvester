/// <reference types="cypress" />

context('Harvester', () => {
  beforeEach(() => {
    cy.visit('./cypress/fixtures/complex_wonky_table.html');
  });

  it('cy.fixture() - load a fixture', () => {
    cy.get('#complex')
      .scrapeTable()
      .then((f) => {
        cy.log(f);
      });
  });

  it('cy.fixture() - load a fixture', () => {
    cy.get('#even-more-complex')
      .scrapeTable()
      .then((f) => {
        cy.log(f);
      });
  });
});
