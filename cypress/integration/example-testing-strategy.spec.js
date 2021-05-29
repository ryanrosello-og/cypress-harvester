/// <reference types="cypress" />

context('Harvester', () => {
  beforeEach(() => {
    cy.visit('./cypress/fixtures/example.html');
  });

  it('finding a specific record within the table', () => {
    cy.get('#example')
      .scrapeTable()
      .then((table) => {
        const expectedAccountHolder = {
          account_holder: 'Christian A. Lavalle',
        };
        expect(
          Cypress._.find(table.data, expectedAccountHolder)
        ).to.be.truthy();
      });
  });

  it('ensuring a record does not exist in the table', () => {
    cy.get('#example')
      .scrapeTable()
      .then((table) => {
        const nonExistentAccountHolder = { account_holder: 'John Babs' };
        expect(
          Cypress._.find(table.data, nonExistentAccountHolder)
        ).to.be.falsy();
      });
  });

  it('validating whether the table is sorted by a particular column', () => {
    cy.get('#example')
      .scrapeTable()
      .then((table) => {
        var expectedTableSort = _.orderBy(
          table.data,
          ['account_holder'],
          ['desc']
        );
        expect(table.data).to.deep.eq([expectedTableSort]);
      });
  });

  it('aggregating a numeric column', () => {
    cy.get('#example')
      .scrapeTable({ decimalColumns: [3] })
      .then((table) => {
        const balance = table.data.map((c) => c.balance);
        expect(Cypress._.sum(balance)).to.eq(60.52);
      });
  });

  it('using a fixture to compare against', () => {
    cy.get('#example')
      .scrapeTable()
      .then((table) => {
        cy.fixture('expected_table_values').then(expectedTableData => {
          expect(expectedTableData).to.deep.eq(table.data);
        });
      });
  });

  it('dealing with dynamic data', () => {
    cy.get('#example')
      .scrapeTable()
      .then((table) => {
        cy.log(table);
      });
  });
});
