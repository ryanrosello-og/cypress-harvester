/// <reference types="cypress" />

context('Various examples', () => {
  beforeEach(() => {
    cy.visit('./cypress/fixtures/example.html');
  });

  it('simple table assertions', () => {
    cy.get('#example')
      .scrapeTable()
      .then((table) => {
        expect(table.rowCount(), 'correct number of rows').to.eq(3);
        expect(
          table.hasItem({
            account_holder: 'Christian A. Lavalle',
          }),
          'valid account exist'
        ).to.have.property('account_id', 'UA-10346-1');

        expect(
          table.hasItem({
            account_holder: 'John Babs',
          }),
          'non-existent account holder should not be present'
        ).to.be.undefined;

        expect(table.columnLabels, 'correct column labels shown').to.deep.eq([
          'Created',
          'Account Id',
          'Account Holder',
          'Balance',
        ]);

        expect(
          table.isPropertySorted(['account_id'], ['desc']),
          'account_id sorted in desc order'
        ).to.be.true;

        // find records matching a search term for a given property
        expect(table.containsItem('account_holder', 'ver')).to.deep.eq([
          {
            created: '10-04-2021 13:40:17',
            account_id: 'UA-11876-3',
            account_holder: 'Terrell E. Evert',
            balance: '$33',
          },
          {
            created: '10-04-2021 12:00:17',
            account_id: 'UA-10876-1',
            account_holder: 'James L. Silver',
            balance: '$50.5',
          },
        ]);
      });
  });

  // deeply assert the data in the table
  it('deeply assert the data in the table', () => {
    cy.get('#example')
      .scrapeTable()
      .then((table) => {
        expect(table.getData()).to.deep.eq([
          {
            created: '10-04-2021 13:40:17',
            account_id: 'UA-11876-3',
            account_holder: 'Terrell E. Evert',
            balance: '$33',
          },
          {
            created: '10-04-2021 12:00:17',
            account_id: 'UA-10876-1',
            account_holder: 'James L. Silver',
            balance: '$50.5',
          },
          {
            created: '10-04-2021 13:00:17',
            account_id: 'UA-10346-1',
            account_holder: 'Christian A. Lavalle',
            balance: '$-22.98',
          },
        ]);
      });
  });

  // choose to only return certain properties you wish to validate against
  it('choose to only return certain properties you wish to validate against', () => {
    cy.get('#example')
      .scrapeTable()
      .then((table) => {
        let mappedProperties = table.getData().map((d) => {
          return {
            account_id: d.account_id,
            balance: d.balance,
          };
        });
        expect(mappedProperties).to.deep.eq([
          {
            account_id: 'UA-11876-3',
            balance: '$33',
          },
          {
            account_id: 'UA-10876-1',
            balance: '$50.5',
          },
          {
            account_id: 'UA-10346-1',
            balance: '$-22.98',
          },
        ]);
      });
  });

  // using fixture as baseline
  it('using a fixture to compare against', () => {
    cy.get('#example')
      .scrapeTable()
      .then((table) => {
        cy.fixture('expected_table_values').then((expectedTableData) => {
          expect(table.getData()).to.deep.eq(expectedTableData);
        });
      });
  });

  // infer data types and aggregate columns
  it('aggregating a numeric column', () => {
    cy.get('#example')
      .scrapeTable({ decimalColumns: [3] })
      .then((table) => {
        expect(table.sumOfColumn('balance', 2)).to.eq(60.52);
      });
  });

  it('web scraping', () => {
    cy.get('#example')
      .scrapeTable({
        exportFileName: 'scrapedData.json',
        exportFilePath: 'cypress/downloads',
      })
      .then((table) => {
        expect(table.exportStatus).to.contain('Data table successfully saved');
      });
  });
});
