/// <reference types="cypress" />

context('Support for multiple elements', () => {
  beforeEach(() => {
    cy.visit('./cypress/fixtures/multiple_elements.html');
  });

  it('simple table assertions', () => {
    cy.scrapeElements([
      { label: 'title', locator: '.title' },
      { label: 'location', locator: '.link' },
    ]).then(cy.log);
  });
});
