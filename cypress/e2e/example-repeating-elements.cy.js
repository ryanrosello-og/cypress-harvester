/// <reference types="cypress" />

context('repeating elements example', () => {
  beforeEach(() => {
    cy.visit('./cypress/fixtures/example.html');
  });

  it('simple scraping', () => {
    cy.get('#sale-items .product')
      .scrapeElements({
        elementsToScrape: [
          { label: 'product_name', locator: '.product-name' },
          { label: 'product_model', locator: '.model' },
          { label: 'item_price', locator: '.price' },
        ],
      })
      .then((scrapedData) => {
        expect(scrapedData.data).to.deep.eq([
          {
            product_name: 'iPad Pro',
            product_model: '11-inch Liquid Retina Display',
            item_price: '$829.99',
          },
          {
            product_name: 'iPad Air',
            product_model: '64 GB  Wi-Fi + Cellular',
            item_price: '$599.99',
          },
          {
            product_name: 'iPad mini',
            product_model: '256 GB  Wi-Fi + Cellular',
            item_price: '$399',
          },
        ]);
      });
  });
});
