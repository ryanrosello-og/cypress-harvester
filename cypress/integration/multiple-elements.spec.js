/// <reference types="cypress" />

context('Support for multiple elements', () => {
  it('simple table assertions', () => {
    cy.visit('./cypress/fixtures/multiple_elements.html');

    cy.scrapeElements([
      { label: 'title', locator: '.title' },
      { label: 'location', locator: '.link' },
    ]).then(cy.log);
  });

  it.only('seabreeze elements', () => {
    cy.visit(
      'https://www.seabreeze.com.au/Classifieds/Search/Stand-Up-Paddle/Surfing-and-Cruising-Boards'
    );

    cy.scrapeElements([
      { label: 'heading', locator: '.hidden-xs h1.clsListHead' },
      { label: 'blurb', locator: '.hidden-xs .clsListText' },
    ]).then(cy.log);
  });

  it('scarpe single repeating element', () => {
    cy.visit(
      'https://www.seabreeze.com.au/Classifieds/Search/Stand-Up-Paddle/Surfing-and-Cruising-Boards'
    );

    cy.scrapeElements([
      { label: 'price', locator: '.hidden-xs .clsListPrice' },
    ]).then(cy.log);
  });
});
