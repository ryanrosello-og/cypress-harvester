/// <reference types="cypress" />

context('Support for multiple elements', () => {
  beforeEach(() => {
    cy.visit('./cypress/fixtures/multiple_elements.html');
  });

  it('simple table assertions', () => {
    cy.scrapeElements([
      { element: 'article_name', locator: 'a[href*="encodedna"]' },
      { element: 'article_name', locator: 'a[href*="encodedna"]' },
    ]);
  });
});
