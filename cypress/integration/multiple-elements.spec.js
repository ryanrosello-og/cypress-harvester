/// <reference types="cypress" />

context('support for multiple elements', () => {
  beforeEach(() => {
    cy.visit('./cypress/fixtures/multiple_elements.html');
  });
  
  it('handles multiple locators', () => {
    cy.get('#all-elements-present .category')
      .scrapeElements({
        elementsToScrape: [
          { label: 'title', locator: '.title' },
          { label: 'location', locator: '.link' },
        ],
      })
      .then((scrapedData) => {
        expect(scrapedData.data).to.deep.eq([
          {
            title: 'Pineapple',
            location: 'https://pineapple.com',
          },
          {
            title: 'Apple',
            location: 'https://apple.com',
          },
          {
            title: 'pen',
            location: 'https://pen.com',
          },
        ]);
      });
  });

  it('handles missing elements', () => {
    cy.get('#missing-element .category')
      .scrapeElements({
        elementsToScrape: [
          { label: 'title', locator: '.title' },
          { label: 'location', locator: '.link' },
        ],
      })
      .then((scrapedData) => {
        expect(scrapedData.data).to.deep.eq([
          {
            title: 'Pineapple',
            location: 'https://pineapple.com',
          },
          {
            location: '',
            title: 'Apple',
          },
          {
            title: 'pen',
            location: 'https://pen.com',
          },
        ]);
      });
  });

  it('writes the content of the dataTable to file', () => {
    cy.get('#all-elements-present .category')
      .scrapeElements({
        elementsToScrape: [
          { label: 'title', locator: '.title' },
          { label: 'location', locator: '.link' },
        ],
        config: {
          exportFileName: 'repeatingElemsScrapedData.json',
          exportFilePath: 'cypress/downloads',
        },
      })
      .then((table) => {
        expect(table.exportStatus).to.contain('Data table successfully saved');
      });
  });

  it('determines if a property is sorted desc when dataset property is sorted desc', () => {
    cy.get('#all-elements-present .category')
      .scrapeElements({
        elementsToScrape: [
          { label: 'title', locator: '.title' },
          { label: 'location', locator: '.link' },
        ],
      })
      .then((table) => {
        expect(
          table.isPropertySorted(['title'], ['desc']),
          'title sorted in desc order'
        ).to.be.false;
      });
  });
});
