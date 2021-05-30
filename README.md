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
|---------------------|:----------:|----------------------|--------:|
| 10-04-2021 12:00:17 | UA-10876-1 | James L. Silver      |   $50.5 |
| 10-04-2021 13:00:17 | UA-10346-1 | Christian A. Lavalle |  $-22.98 |
| 10-04-2021 13:40:17 | UA-11876-3 | Terrell E. Evert     |     $33 |

When table is passed through the Cypress harvester:



Then Cypress is able to easily work with the json representation of the table:



## Example - Web scraping records

This plugin also allows for scraping of data from tables which can be persisted to a json file:



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
