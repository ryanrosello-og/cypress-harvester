/// <reference types="cypress" />

context('Support for multiple elements', () => {
  it('handles multiple locators', () => {
    cy.visit('./cypress/fixtures/multiple_elements.html');

    cy.scrapeElements({
      elements: [
        { label: 'title', locator: '.title' },
        { label: 'location', locator: '.link' },
      ],
    }).then((scrapedData) => {
      expect(scrapedData.data).to.deep.eq([
        {
          title: ['Pineapple', 'Apple', 'pen', 'Pineapple', 'Apple', 'pen'],
        },
        {
          location: [
            'https://pineapple.com',
            'https://apple.com',
            'https://pen.com',
            'https://pineapple.com',
            'https://pen.com',
          ],
        },
      ]);
    });
  });

  it('handles single locators', () => {
    cy.visit('./cypress/fixtures/multiple_elements.html');

    cy.scrapeElements({
      elements: [
        { label: 'title', locator: '.title' }
      ],
    }).then((scrapedData) => {
      expect(scrapedData.data).to.deep.eq([
        {
          title: ['Pineapple', 'Apple', 'pen', 'Pineapple', 'Apple', 'pen'],
        }
      ]);
    });
  });

});
