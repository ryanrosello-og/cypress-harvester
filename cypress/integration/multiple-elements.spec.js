/// <reference types="cypress" />

context('Support for multiple elements', () => {
  it('handles missing element', () => {
    cy.visit('./cypress/fixtures/multiple_elements.html');

    cy.scrapeElements([
      { label: 'title', locator: '#missing-element .title' },
      { label: 'location', locator: '#missing-element .link' },
    ]).then((scrapedData) => {

      // TODO: index still getting messed up
      expect(scrapedData.data).to.deep.eq([
        {
          title: 'Pineapple',
          location: 'https://pineapple.com',
        },
        {
          title: 'Apple'
        },
        {
          title: 'pen',
          location: 'https://pen.com'
        },
      ]);
    });
  });

  it('scrapes all element text when all elements exists', () => {
    cy.visit('./cypress/fixtures/multiple_elements.html');

    cy.scrapeElements([
      { label: 'title', locator: '#all-elements-present .title' },
      { label: 'location', locator: '#all-elements-present .link' },
    ]).then((scrapedData) => {
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

  it('scarpe single repeating element', () => {
    cy.visit('./cypress/fixtures/multiple_elements.html');

    cy.scrapeElements([
      { label: 'title', locator: '#all-elements-present .title' },
    ]).then((scrapedData) => {
      expect(scrapedData.data).to.deep.eq([
        {
          title: 'Pineapple',
        },
        {
          title: 'Apple',
        },
        {
          title: 'pen',
        },
      ]);
    });
  });
});
