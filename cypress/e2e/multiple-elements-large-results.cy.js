import * as expectedData from '../fixtures/multiple_elements_large_result.json';

context('numerous repeating elements', () => {
  beforeEach(() => {
    cy.visit('./cypress/fixtures/test_html_repeating_elements.html');
  });

  it('scrapes all elements and returns correct data table', () => {
    cy.contains('h1', 'Plugins').should('be.visible');
    cy.get('li.m-3')
      .scrapeElements({
        elementsToScrape: [
          { label: 'name', locator: 'h3' },
          { label: 'description', locator: 'p' },
          { label: 'keywords', locator: '.break-words' },
          { label: 'badge', locator: '[class*=pluginBadge]' },
        ],
      })
      .then((scrapedData) => {
        expect(scrapedData.data).to.deep.eq(expectedData.data);
      });
  });
});
