/// <reference types="cypress" />

context('Harvester', () => {
  beforeEach(() => {
    cy.visit('./cypress/fixtures/example.html');
  });

  it('determines if a date property is sorted asc', () => {
    cy.get('#date-columns')
      .should('have.length.above', 0)
      .scrapeTable({dateColumns: [0], dateFormat:'DD-MM-YYYY HH:MM:SS'})
      .then((table) => {
        expect(
          table.isPropertySorted(['created'], ['asc']),
          'created sorted in asc order'
        ).to.be.false;
      });
  });
});
