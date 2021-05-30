/// <reference types="cypress" />

context('Harvester', () => {
  beforeEach(() => {
    cy.visit('./cypress/fixtures/test_tables.html');
  });

  it('applies data conversion to specified column [decimalColumns] config property', () => {
    cy.get('#numerics')
      .scrapeTable({
        decimalColumns: [1, 2],
      })
      .then((table) => {
        expect(table.getData()).to.deep.eq([
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
        expect(table.exportStatus).to.contain('Data table successfully saved');
      });
  });

  it('exposes table column names as [columnLabels]', () => {
    cy.get('#simpleTable')
      .scrapeTable()
      .then((table) => {
        expect(table.columnLabels).to.deep.eq([
          'First Name',
          'Last Name',
          'Gender',
          'Age',
        ]);
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
        expect(table.exportStatus).to.match(
          /\d{4}-\d{2}-\d{2}T\d{6}.*Z_scrapedData.json/
        );
      });
  });

  context('configuration [propertyNameConvention]', () => {
    it('cleans column headings when propertyNameConvention is not provided', () => {
      cy.get('#simpleTable')
        .scrapeTable({ propertyNameConvention: '' })
        .then((table) => {
          expect(table.columnLabels).to.deep.eq([
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
        .then((table) => {
          expect(table.propertyNames).to.deep.eq([
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
        .then((table) => {
          expect(table.propertyNames).to.deep.eq([
            'first_name',
            'last_name',
            'gender',
            'age',
          ]);
        });
    });
  });

  it('can remove newline characters from table cell using the config [removeAllNewlineCharacters] ', () => {
    cy.get('.cells-have-elements')
      .scrapeTable({ removeAllNewlineCharacters: true })
      .then((table) => {
        expect(table.getData()).to.deep.eq([
          {
            column_1: 'Row 1: Cell 1 Change',
            column_2: 'Row 1: Cell 2 Change',
          },
          {
            column_1: 'Row 2: Cell 1 Change',
            column_2: 'Row 2: Cell 2 Change',
          },
        ]);
      });
  });

  it('determines the correct number of rows in the table', () => {
    cy.get('#simpleTable')
      .scrapeTable()
      .then((table) => {
        expect(table.rowCount()).to.eq(3);
      });
  });

  it('retrieves the correct table cell values', () => {
    cy.get('#simpleTable')
      .scrapeTable()
      .then((table) => {
        expect(table.getData()).to.deep.eq([
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
      .then((table) => {
        expect(table.getData()).to.deep.eq([
          {
            emp_id: '7334324',
            first_name: 'Russell Hobbs',
            last_name: 'Russell Hobbs',
            gender: 'Male',
            age: '50',
          },
          {
            emp_id: '7334324',
            first_name: '7334324',
            last_name: '7334324',
            gender: '7334324',
            age: '7334324',
          },
          {
            emp_id: '7334324',
            first_name: '7334324',
            last_name: 'Russell Hobbs',
            gender: 'Male',
            age: 'Male',
          },
        ]);
      });
  });

  it('handles blank column name', () => {
    cy.get('#blankColumnName')
      .scrapeTable()
      .then((table) => {
        expect(table.propertyNames).to.deep.eq([
          'first_name',
          'last_name',
          'column_name_2',
          'age',
        ]);
        expect(table.getData()).to.deep.eq([
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
      .then((table) => {
        expect(table.getData()).to.deep.eq([]);
        expect(table.rowCount()).to.eq(0);
      });
  });

  it('returns no records when a table only contains the header row', () => {
    cy.get('#onlyHeaders')
      .scrapeTable()
      .then((table) => {
        expect(table.rowCount()).to.eq(0);
        expect(table.getData()).to.deep.eq([]);
        expect(table.propertyNames).to.deep.eq([
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
      .then((table) => {
        expect(table.propertyNames).to.deep.eq([
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
