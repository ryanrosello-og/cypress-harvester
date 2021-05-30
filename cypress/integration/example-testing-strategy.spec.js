/// <reference types="cypress" />

context('Harvester', () => {
  beforeEach(() => {
    cy.visit('./cypress/fixtures/example.html');
  });

  it('very simple web scraping example', () => {
    cy.get('#example')
      .scrapeTable({
        exportFileName: 'scrapedData.json',
        exportFilePath: 'cypress/downloads',
      })
      .then((table) => {
        expect(table.info).to.contain('Data table successfully saved to');
      });
  });

  it('very simple example', () => {
    cy.get('#example')
      .scrapeTable()
      .then((table) => {
        expect(table.numberOfRecords).to.eq(3);
        expect(table.data).to.deep.eq([
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
            balance: '-22.98',
          },
        ]);
      });
  });

  it('finding a specific record within the table', () => {
    cy.get('#example')
      .scrapeTable()
      .then((table) => {
        const expectedAccountHolder = Cypress._.find(table.data, {
          account_holder: 'Christian A. Lavalle',
        });
        expect(expectedAccountHolder).to.have.property(
          'account_id',
          'UA-10346-1'
        );
      });
  });

  it('ensuring a record does not exist in the table', () => {
    cy.get('#example')
      .scrapeTable()
      .then((table) => {
        const nonExistentAccountHolder = Cypress._.find(table.data, {
          account_holder: 'John Babs',
        });
        expect(nonExistentAccountHolder).to.be.undefined;
      });
  });

  it('validating whether the table is sorted by a particular column', () => {
    cy.get('#example')
      .scrapeTable()
      .then((table) => {
        var expectedTableSort = Cypress._.orderBy(
          table.data,
          ['account_id'],
          ['desc']
        );
        expect(table.data).to.deep.eq(expectedTableSort);
      });
  });

  it('aggregating a numeric column', () => {
    cy.get('#example')
      .scrapeTable({ decimalColumns: [3] })
      .then((table) => {
        const balance = table.data.map((c) => c.balance);
        const expecteSum = Cypress._.sum(balance);
        expect(Cypress._.round(expecteSum, 2)).to.eq(60.52);
      });
  });

  it('using a fixture to compare against', () => {
    cy.get('#example')
      .scrapeTable()
      .then((table) => {
        cy.fixture('expected_table_values').then((expectedTableData) => {
          expect(table.data).to.deep.eq(expectedTableData);
        });
      });
  });
});
