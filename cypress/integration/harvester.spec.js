/// <reference types="cypress" />

context('Harvester', () => {
  beforeEach(() => {
    cy.visit('./cypress/fixtures/test_tables.html');
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

  it('determines the correct number of rows in the table', () => {
    cy.get('#simpleTable')
      .scrapeTable()
      .then((extractedTable) => {
        expect(extractedTable.numberOfRecords).to.eq(0);
      });
  });

  it('retrieves the correct table cell values', () => {
    cy.get('#simpleTable')
      .scrapeTable()
      .then((extractedTable) => {
        expect(extractedTable.data).to.deep.eq([]);
      });
  });

  it('handles merged cells', () => {
    cy.get('#mergedCells')
      .scrapeTable()
      .then((extractedTable) => {
        expect(extractedTable.data).to.deep.eq([]);
      });
  });

  it('handles blank column name', () => {
    cy.get('#blankColumnName')
      .scrapeTable()
      .then((extractedTable) => {
        expect(extractedTable.data).to.deep.eq([]);
      });
  });

  it('returns no record when a blank table is encountered', () => {
    cy.get('#emptyTable')
      .scrapeTable()
      .then((extractedTable) => {
        expect(extractedTable.data).to.deep.eq([]);
      });
  });

  it('returns no records when a table only contains the header row', () => {
    cy.get('#onlyHeaders')
      .scrapeTable()
      .then((extractedTable) => {
        expect(extractedTable.data).to.deep.eq([]);
      });
  });

  it('appends numeric sequence for duplicate column names', () => {
    cy.get('#repeatedColumnNames')
      .scrapeTable()
      .then((extractedTable) => {
        expect(extractedTable.data).to.deep.eq([]);
      });
  });

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
