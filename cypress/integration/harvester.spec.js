/// <reference types="cypress" />

context('Harvester', () => {
  beforeEach(() => {
    cy.visit('./cypress/fixtures/test_table.html');
  });

  it('nah', () => {
    let rowIndexForHeadings = 0;
    cy.get('#simpleTable')
      .then(($e) => {
        let scrapped = [];
        let columnHeadings = [];
        var trows = $e[0].rows;
        Cypress.$.each(trows, (rowIndex, row) => {
          let o = new Object();

          Cypress.$.each(row.cells, (cellIndex, cell) => {
            if (rowIndex == rowIndexForHeadings) {
              columnHeadings[cellIndex] = cell.textContent;
            } else {
              o[columnHeadings[cellIndex]] = cell.textContent;
            }
          });

          if (rowIndex !== rowIndexForHeadings) {
            scrapped.push(o);
          }
        });
        return {
          dataTable: scrapped,
          columnHeadings: columnHeadings,
          numberOfRecords: scrapped.length,
        };
      })
      .then((extractedTable) => {
        cy.log(extractedTable);
      });
  });
});
