Cypress.Commands.add('scrapeElements', (elements) => {
  let texts = [];

  cy.get(elements[0].locator)
    .its('length')
    .then((numberOfIterations) => {
      for (let i = 0; i < numberOfIterations; i++) {
        let o = {};

        elements.forEach((element, index) => {
          cy.get(element.locator).then((e) => {
            o[element.label] = e[0].textContent;
          });
        });

        for (let k = 0; k < elements.length; k++) {
          cy.get(elements[k].locator)
            .eq(i)
            .then((e) => {
              o[elements[k].label] = e[0].textContent;
            });
        }

        texts.push(o);
      }
      return cy.wrap(texts);
    });
});
