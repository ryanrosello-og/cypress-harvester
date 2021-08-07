context('gh bug', () => {
  beforeEach(() => {
    cy.visit('https://www.seabreeze.com.au/Classifieds/Search/Stand-Up-Paddle/Surfing-and-Cruising-Boards?search=uQNVTXNc1pWhjfFr%2B0%2FS5w%3D%3D&page=9');
  });

  it('scrape', ()=>{
    cy.contains('a', 'Sell Your Gear').should('be.visible');
    const parentLocator = 'tr[class*=clsList][id]'
    const elems = [{label:'description', locator:'.clsListText'}, {label:'price', locator:'.clsListPrice'} ]

    let res =[]
    cy.get('tr[class*=clsList][id]').each(($el, index, $list) => {
      cy.get("body").then($body => {
        let obj = {}
        cy.wrap(elems).each(($e, i, $elms) =>{
          let loc = `${parentLocator}:nth-child(${index}) ${elems[i].locator}`
          if ($body.find(loc).length > 0) {   
            cy.get(loc).invoke('text').then(txt =>{
              obj[elems[i].label] = txt
            })
            cy.log('>>>> true')
          } else {
            cy.log('false')
          }
        })

        res.push(obj)
      });
    }) 
    cy.log(res)
  })

  xit('table assertions', () => {
    cy.get('#dataTable')
      .should('have.length', 2)
      .scrapeTable()
      .then((table) => {
        expect(table.isPropertySorted(['task'], ['asc'])).to.be.true;
      });
  });
});
