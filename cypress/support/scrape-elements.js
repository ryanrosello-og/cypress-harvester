Cypress.Commands.add('scrapeElements', (elements) => {
  let texts = []

  cy.get(elements[0].locator).its('length').then(numberOfIterations => {
    for (let i = 0; i < numberOfIterations; i++) {
      let o = {}

      elements.forEach((element, index) => {
        cy.get(element.locator).then(e => {
          o[element.label] = e[0].textContent
        })
      });
      // cy.get(elements[0].locator).eq(i).then(e => {
      //   o[elements[0].label] = e[0].textContent
      // })
      // cy.get(elements[1].locator).eq(i).then(e => {
      //   o[elements[1].label] = e[0].textContent
      // })

      texts.push(o)
    }
    return cy.wrap(texts)
  })
})
