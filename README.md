# cypress-harvester

A life enhancing plug-in for Cypress allowing you to easliy work with html `<table>`, whether it be for testing or for web scarping purposes. 

## Installing

Using npm:

```bash
$ npm install cypress-harvester --save-dev
```

`cypress-harvester` makes use of the Cypress `cy` command.
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
    expect(table.numberOfRecords).to.eq(3);
    expect(table.data).to.deep.eq([
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
        balance: '-22.98',
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
    expect(table.info).to.contain('Data table successfully saved');
  });
```
A json representation of the html table is then saved to a json file within the `cypress/downloads` folder:



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


## More advanced examples

* Table contains a specific record
* Sorting
* Aggregate column
* Large dataset via fixture
* Large dataset using snapshot





TODO :-


[] rowspan - rowspan + colspan combo
[] update doco
[] create npm package
[] pair of repeating elements
✅ as chain command
✅ handle duplicate columns
✅ merged cells
✅ infer integers
✅ conf.appendTimestamp
✅ handle duplicate webtables
[] config:
    ✅ jsonify column headings
    ✅ remove new line char from heading
    
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |
