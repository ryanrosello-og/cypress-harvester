context('repeating elements', () => {
  beforeEach(() => {
    cy.visit('https://docs.cypress.io/plugins/directory');
  });

  it('scrape', () => {
    cy.contains('h1', 'Plugins').should('be.visible');
    const suppressLog = { log: false }
    const parentLocator = 'li.m-3';
    const elems = [
      { label: 'name', locator: 'h3' },
      { label: 'description', locator: 'p' },
      { label: 'keywords', locator: '.break-words' },
      { label: 'badge', locator: '[class*=pluginBadge]' },
    ];
    
    let res = [];
    cy.get(parentLocator, suppressLog).each(($el, index, $list) => {
      cy.wrap($el, suppressLog).then(($body) => {
        let obj = {};
        cy.wrap(elems, suppressLog).each(($e, i, $elms) => {
          let loc = elems[i].locator;
          if ($body.find(loc).length > 0) {
            cy.get($el, suppressLog).within(() => {
              cy.get(loc, suppressLog)
                .invoke('text')
                .then((txt) => {
                  obj[elems[i].label] = txt;
                });
              
            });
          } else {
            obj[elems[i].label] = '';
          }
        });

        res.push(obj);
      });
    });
    cy.log(res);
  });
});
