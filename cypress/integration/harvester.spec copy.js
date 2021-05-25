/// <reference types="cypress" />

context('Harvester', () => {
  beforeEach(() => {
    // cy.visit('https://www.worldometers.info/coronavirus/');
    cy.visit('http://www.bom.gov.au/cgi-bin/climate/extremes/daily_extremes.cgi')
  });

  it('using command', () => {
    cy.get('table[summary="Table of daily extremes"]').should('be.visible')
      .harvest({ rowIndexForHeadings: 0 })
  });

  xit('using command', () => {
    cy.get('table[id="main_table_countries_today"]')
      .harvest({ rowIndexForHeadings: 0 })
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
