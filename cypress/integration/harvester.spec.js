/// <reference types="cypress" />

context('Harvester', () => {
  beforeEach(() => {
    cy.visit('./cypress/fixtures/test_tables.html');
  });

  it('applies data conversion to specified column indexes', () => {
    cy.get('#numerics')
      .scrapeTable({
        decimalColumns: [1, 2],
      })
      .then((table) => {
        expect(table.data).to.deep.eq([
          {
            month: 'January',
            savings: 100,
            balance: 150.3,
          },
          {
            month: 'February',
            savings: 80.55,
            balance: 99.3,
          },
          {
            month: 'Sum',
            savings: -180,
            balance: -220,
          },
        ]);
      });
  });

  it('writes the content of the dataTable to file', () => {
    cy.get('#simpleTable')
      .scrapeTable({
        exportFileName: 'scrapedData.json',
        exportFilePath: 'cypress/downloads',
      })
      .then((table) => {
        expect(table.info).to.contain('Data table successfully saved to');
      });
  });

  it('able to add timestamp to the export file', () => {
    cy.get('#simpleTable')
      .scrapeTable({
        exportFileName: 'scrapedData.json',
        exportFilePath: 'cypress/downloads',
        includeTimestamp: true,
      })
      .then((table) => {
        expect(table.info).to.match(
          /\d{4}-\d{2}-\d{2}T\d{6}.*Z_scrapedData.json/
        );
      });
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
        expect(extractedTable.numberOfRecords).to.eq(3);
      });
  });

  it('retrieves the correct table cell values', () => {
    cy.get('#simpleTable')
      .scrapeTable()
      .then((extractedTable) => {
        expect(extractedTable.data).to.deep.eq([
          {
            first_name: 'Russell',
            last_name: 'Hobbs',
            gender: 'Male',
            age: '50',
          },
          {
            first_name: 'John',
            last_name: 'Campbell',
            gender: 'Male',
            age: '22',
          },
          {
            first_name: 'Kate',
            last_name: 'Smith',
            gender: 'Female',
            age: '33',
          },
        ]);
      });
  });

  it('handles merged cells', () => {
    cy.get('#mergedCells')
      .scrapeTable()
      .then((extractedTable) => {
        expect(extractedTable.data).to.deep.eq([
          {
            first_name: 'Russell Hobbs',
            last_name: 'Russell Hobbs',
            gender: 'Male',
            age: '50',
          },
        ]);
      });
  });

  it('handles blank column name', () => {
    cy.get('#blankColumnName')
      .scrapeTable()
      .then((extractedTable) => {
        expect(extractedTable.columnHeadings).to.deep.eq([
          'first_name',
          'last_name',
          'column_name_2',
          'age',
        ]);
        expect(extractedTable.data).to.deep.eq([
          {
            first_name: 'Russell',
            last_name: 'Hobbs',
            column_name_2: 'Male',
            age: '50',
          },
        ]);
      });
  });

  it('returns no record when a blank table is encountered', () => {
    cy.get('#emptyTable')
      .scrapeTable()
      .then((extractedTable) => {
        expect(extractedTable.data).to.deep.eq([]);
        expect(extractedTable.numberOfRecords).to.eq(0);
      });
  });

  it('returns no records when a table only contains the header row', () => {
    cy.get('#onlyHeaders')
      .scrapeTable()
      .then((extractedTable) => {
        expect(extractedTable.numberOfRecords).to.eq(0);
        expect(extractedTable.data).to.deep.eq([]);
        expect(extractedTable.columnHeadings).to.deep.eq([
          'first_name',
          'last_name',
          'gender',
          'age',
        ]);
      });
  });

  it('appends numeric sequence for duplicate column names', () => {
    cy.get('#repeatedColumnNames')
      .scrapeTable()
      .then((extractedTable) => {
        expect(extractedTable.columnHeadings).to.deep.eq([
          'first_name',
          'last_name',
          'last_name_2',
          'age',
        ]);
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

  it('throw an error when the locator does not yeild a <table>', () => {
    cy.get('#notATable')
      .scrapeTable()
      .then((table) => {
        expect(table.info).to.eq(
          '!!! The element encountered was not a <table>'
        );
      });
  });
});
