Cypress.Commands.add('scrapeElements', (elements) => {
  let texts = [];

  cy.get(elements[0].locator)
    .its('length')
    .then((numberOfIterations) => {
      for (let i = 0; i < numberOfIterations; i++) {
        let o = {};

        for (let k = 0; k < elements.length; k++) {
          cy.get(elements[k].locator, { log: false })
            .eq(i, { log: false })
            .then((e) => {
              o[elements[k].label] = e[0].textContent;
            });
        }

        texts.push(o);
      }
      return cy.wrap(texts);
    });
});
