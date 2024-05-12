/// <reference types="cypress" />

context('Harvester', () => {
  beforeEach(() => {
    cy.visit('./cypress/fixtures/example.html');
  });

  it('determines if a date property is sorted asc', () => {
    cy.get('#date-columns')
      .should('have.length.above', 0)
      .scrapeTable({ dateColumns: [0, 1, 2, 3] })
      .then((table) => {
        expect(
          table.isPropertySorted(['created'], ['asc']),
          'created sorted in asc order'
        ).to.be.true;
        expect(
          table.isPropertySorted(['modified'], ['desc']),
          'modified sorted in desc order'
        ).to.be.true;
        expect(
          table.isPropertySorted(['invalid_date'], ['asc']),
          'invalid_date sorted in asc order'
        ).to.be.true;
        expect(
          table.isPropertySorted(['deleted'], ['desc']),
          'deleted sorted in desc order'
        ).to.be.false;
      });
  });
  
  it('fails when date format cannot be determined', () => {
    cy.get('#date-columns')
      .should('have.length.above', 0)
      .scrapeTable({ dateColumns: [2] })
      .then((scrapedData) => {
        expect(scrapedData.data).to.deep.eq([
          {
            created: '10-04-2021 13:40:17',
            modified: '2012-10-11',
            invalid_date: 'Unabled to parse date',
            deleted: '15-May-2011 10:20 AM',
          },
          {
            created: '10-05-2021 13:40:17',
            modified: '2012-10-10',
            invalid_date: 'Unabled to parse date',
            deleted: '13-May-2011 8:15 PM',
          },
          {
            created: '10-06-2021 13:40:17',
            modified: '2012-10-09',
            invalid_date: 'Unabled to parse date',
            deleted: '17-May-2011 9:20 AM',
          },
        ]);
      });
  });

  it('able to parse date column as unix epoch format', () => {
    cy.get('#date-columns')
      .should('have.length.above', 0)
      .scrapeTable({ dateColumns: [0] })
      .then((scrapedData) => {
        expect(scrapedData.data).to.deep.eq([
          {
            created: 1633354817000,
            modified: '2012-10-11',
            invalid_date: '15-May-2011 10:20AM',
            deleted: '15-May-2011 10:20 AM',
          },
          {
            created: 1633441217000,
            modified: '2012-10-10',
            invalid_date: '13-May-2011 8:15PM',
            deleted: '13-May-2011 8:15 PM',
          },
          {
            created: 1633527617000,
            modified: '2012-10-09',
            invalid_date: '17-May-2011 9:20AM',
            deleted: '17-May-2011 9:20 AM',
          },
        ]);
      });
  });
});
