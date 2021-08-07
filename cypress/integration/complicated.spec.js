context('repeating elements', () => {
  beforeEach(() => {
    cy.visit('./cypress/fixtures/test_html_repeating_elements.html');
  });

  it('scrape', () => {
    cy.contains('h1', 'Plugins').should('be.visible');
    const suppressLog = { log: false }
    const parentLocator = 'li.m-3';
    const elementsToScrape = [
      { label: 'name', locator: 'h3' },
      { label: 'description', locator: 'p' },
      { label: 'keywords', locator: '.break-words' },
      { label: 'badge', locator: '[class*=pluginBadge]' },
    ];
    
    let data = [];
    cy.get(parentLocator, suppressLog).each(($el, index, $list) => {
      cy.wrap($el, suppressLog).then(($body) => {
        let scrappedObject = {};
        cy.wrap(elementsToScrape, suppressLog).each(($e, i, $elms) => {
          let childElementLocator = elementsToScrape[i].locator;
          if ($body.find(childElementLocator).length > 0) {
            cy.get($el, suppressLog).within(suppressLog, () => {
              cy.get(childElementLocator, suppressLog)
                .invoke(suppressLog, 'text')
                .then((txt) => {
                  scrappedObject[elementsToScrape[i].label] = txt;
                });
            });
          } else {
            scrappedObject[elementsToScrape[i].label] = '';
          }
        });

        data.push(scrappedObject);
      });
    });
    cy.log(data);
  });
});
