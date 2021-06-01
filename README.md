# cypress-harvester

![Biulds](https://github.com/ryanrosello-og/cypress-harvester/actions/workflows/main.yml/badge.svg)

A life enhancing plug-in for Cypress allowing you to easliy work with html `<table>`, whether it be for testing or for web scarping purposes. 

## Installing

Using npm:

```bash
$ npm install cypress-harvester --save-dev
```

Enable this plugin by adding this line to your project's `cypress/support/commands.js`:

```javascript
import 'cypress-harvester'
```

## Example - Testing static

Given a simple html table below:

| Created             | Account Id | Account Holder       | Balance |
|---------------------|------------|----------------------|--------:|
| 10-04-2021 13:40:17 | UA-11876-3 | Terrell E. Evert     |     $33 |
| 10-04-2021 12:00:17 | UA-10876-1 | James L. Silver      |   $50.5 |
| 10-04-2021 13:00:17 | UA-10346-1 | Christian A. Lavalle | $-22.98 |


```
<table id="example" border="1">
<tr>
    <td>Created</td>
    <td>Account Id</td>
    <td>Account Holder</td>
    <td>Balance</td>
</tr>
<tr>
    <td>10-04-2021 13:40:17</td>
    <td>UA-11876-3</td>
    <td>Terrell E. Evert</td>
    <td>$33</td>
</tr>    
<tr>
    <td>10-04-2021 12:00:17</td>
    <td>UA-10876-1</td>
    <td>James L. Silver</td>
    <td>$50.5</td>
</tr>
<tr>
    <td>10-04-2021 13:00:17</td>
    <td>UA-10346-1</td>
    <td>Christian A. Lavalle</td>
    <td>$-22.98</td>
</tr>
</table>
```


When table is passed through the Cypress harvester, Cypress is able to easily extract data and convert to a json representation of the table:

```
cy.get('#example')
  .scrapeTable()
  .then((table) => {
    expect(table.getData()).to.deep.eq([
      {
        created: '10-04-2021 13:40:17',
        account_id: 'UA-11876-3',
        account_holder: 'Terrell E. Evert',
        balance: '$33',
      },
      {
        created: '10-04-2021 12:00:17',
        account_id: 'UA-10876-1',
        account_holder: 'James L. Silver',
        balance: '$50.5',
      },
      {
        created: '10-04-2021 13:00:17',
        account_id: 'UA-10346-1',
        account_holder: 'Christian A. Lavalle',
        balance: '$-22.98',
      },
    ]);
  });
```

## Example - Web scraping records

This plugin also allows for scraping of data from tables which can be persisted to a json file:

```
cy.get('#example')
  .scrapeTable({
    exportFileName: 'scrapedData.json',
    exportFilePath: 'cypress/downloads',
  })
  .then((table) => {
    expect(table.exportStatus).to.contain(
      'Data table successfully saved'
    );
  });
```
A json representation of the html table is then saved to a json file within the `cypress/downloads` folder:

## Other Useful assertions

```
cy.get('#example')
  .scrapeTable()
  .then((table) => {
    // assert the number of records in the table
    expect(table.rowCount()).to.eq(3);

    // validate a record exists in the table
    expect(
      table.hasItem({
        account_holder: 'Christian A. Lavalle',
      })
    ).to.have.property('account_id', 'UA-10346-1');

    // validate a record does not exist in the table
    expect(
      table.hasItem({
        account_holder: 'John Babs',
      })
    ).to.be.undefined;

    // check the tables' column labels
    expect(table.columnLabels).to.deep.eq([
      'Created',
      'Account Id',
      'Account Holder',
      'Balance',
    ]);

    // test whether column(s) are sorted
    expect(
      table.isPropertySorted(['account_id'], ['desc']),
      'account_id sorted in desc order'
    ).to.be.true;

    // find records matching a search term for a given property
    // the example below return only 2 records where the account holder contains 'ver'
    // it will find [Terrell E. Evert and James L. Silver]
    expect(
      table.containsItem(
        'account_holder', 'ver')
    ).to.deep.eq([
      {
        created: '10-04-2021 13:40:17',
        account_id: 'UA-11876-3',
        account_holder: 'Terrell E. Evert',
        balance: '$33',
      },
      {
        created: '10-04-2021 12:00:17',
        account_id: 'UA-10876-1',
        account_holder: 'James L. Silver',
        balance: '$50.5',
      }
    ]);
  
    // choose to only return certain properties you wish to validate against
    let mappedProperties = table.getData().map((d) => {
      return {
        account_id: d.account_id,
        balance: d.balance,
      };
    });

    expect(mappedProperties).to.deep.eq([
      {
        account_id: 'UA-11876-3',
        balance: '$33',
      },
      {
        account_id: 'UA-10876-1',
        balance: '$50.5',
      },
      {
        account_id: 'UA-10346-1',
        balance: '$-22.98',
      },
    ]);   
  });
```

## Use fixture as baseline

Take advantage to the fixtures within Cypress when dealing with large datasets.
```
cy.get('#example')
  .scrapeTable()
  .then((table) => {
    cy.fixture('expected_table_values').then((expectedTableData) => {
      expect(table.getData()).to.deep.eq(expectedTableData);
    });
  });
```

## Infer data types and aggregate columns

Provide the index of numeric columns (starting at zero), in the example above. The balance column index is 3, when this value is supplied to the plug-in, we are able to validate the total sum of the column against an expected value.
```
cy.get('#example')
  .scrapeTable({ decimalColumns: [3] })
  .then((table) => {
    expect(table.sumOfColumn('balance', 2)).to.eq(60.52);
  });
```


## Configuration

| Property                   | Default Value | Type    | Purpose |
|----------------------------|---------------|---------|---------|
| exportFileName             |               | string  | The name of the exported file.  Both the [exportFileName] and the [exportFilePath] properties must be specified in order to export the scrapted data to a file.   |
| exportFilePath             |               | string  | Where the exported files are to be saved.    |
| includeTimestamp           | false         | boolean | Add a unique timestamp to the generated file    |
| propertyNameConvention     | snakeCase     | string  | Controls the naming convention of the resultant data table json representation.  The value can either be 'snakeCase' or 'camleCase'    |
| removeAllNewlineCharacters | false         | boolean | Instructs the plugin to remove all new line characters from the table cell values    |
| applyDataTypeConversion    | false         | boolean | Converts the column values to integers for the columns specified in the [decimalColumns] property.     |
| decimalColumns             | []            | array   | This configuration is applied only when the applyDataTypeConversion flag is set to true.  Expects an array of intergers, these numbers map to the column index (starting at zero) of each of columns in the table.  The values contained in the columns will be converted to integers.    |

## Merge cells

When the scraper encounters merge cells, whether it be (colspan or rowspan attributes).  It will normalize cell values such that the colspan are filled across columns from left to right, rowspans are filled down.

In the example table below:


This treated as 

<screenshot of console output>

    
## License

[MIT][mit]

[cypress]: https://cypress.io
[mit]: https://opensource.org/licenses/MIT
[npm]: https://www.npmjs.com/
