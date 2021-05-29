/// <reference types="cypress" />

context('Harvester', () => {
  beforeEach(() => {
    // cy.visit('https://example.cypress.io/commands/aliasing')
    cy.visit('./cypress/fixtures/test_tables.html');
  });

  it('cy.fixture() - load a fixture', () => {
    cy.get('.cells-have-elements')
      .scrapeTable()
      .then((f) => {
        cy.log(f);
      });
  });

  xit('using command', () => {
    cy.get('table[id="main_table_countries_today"]')
      .should('be.visible')
      .scrapeTable({ rowIndexForHeadings: 0 });
  });

  xit('using command', () => {
    cy.get('table[id="main_table_countries_today"]')
      .scrapeTable({ rowIndexForHeadings: 0 })
      .then((extractedTable) => {
        cy.log(extractedTable);
        expect(extractedTable.numberOfRecords).to.eq(238);
        expect(extractedTable.columnHeadings).to.deep.eq([
          'First Name',
          'Last Name',
          'Gender',
          'Age',
        ]);
      });
  });
});
