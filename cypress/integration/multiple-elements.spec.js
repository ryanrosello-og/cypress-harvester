/// <reference types="cypress" />

context('support for multiple elements', () => {
  it('handles multiple locators', () => {
    cy.visit('./cypress/fixtures/multiple_elements.html');

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
    cy.visit('./cypress/fixtures/multiple_elements.html');

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
});
