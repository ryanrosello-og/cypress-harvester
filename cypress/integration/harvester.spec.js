/// <reference types="cypress" />

context('Harvester', () => {
  beforeEach(() => {
    cy.visit('./cypress/fixtures/test_table.html');
  });

  context('configuration [propertyNameConvention]', () => {
    it('cleans column headings when propertyNameConvention is not provided', () => {
      cy.get('#simpleTable')
        .scrapeTable({ propertyNameConvention: '' })
        .then((extractedTable) => {
          expect(extractedTable.columnHeadings).to.deep.eq([
            'First Name',
            'Last Name',
            'Gender',
            'Age',
          ]);
        });
    });

    it('able to format column names as camel case', () => {
      cy.get('#simpleTable')
        .scrapeTable({ propertyNameConvention: 'camelCase' })
        .then((extractedTable) => {
          expect(extractedTable.columnHeadings).to.deep.eq([
            'firstName',
            'lastName',
            'gender',
            'age',
          ]);
        });
    });

    it('able to format column names as snake case', () => {
      cy.get('#simpleTable')
        .scrapeTable({ propertyNameConvention: 'snakeCase' })
        .then((extractedTable) => {
          expect(extractedTable.columnHeadings).to.deep.eq([
            'first_name',
            'last_name',
            'gender',
            'age',
          ]);
        });
    });
  });

  it('determines the correct number of rows in the table', () => {});

  it('retrieves the correct table cell values', () => {});

  it('handles merged cells', () => {});

  it('appends numeric sequence for duplicate column names', () => {});

  it('show warning when locator return multiple tables', () => {
    cy.get('.duplicated-table')
      .scrapeTable()
      .then((table) => {
        expect(table.info).to.eq(
          '!!! More than one table found - data extracted from the first table.  Ensure your table locator produces exactly 1 unique table.'
        );
      });
  });
});
