# cypress-harvester

A life enhancing plug-in for Cypress allowing you to easliy work with html tables, whether it be for testing or for web scarping purposes. 

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

## Example - Testing static <table>

| Created             | Account Id | Account Holder       | Balance |
|---------------------|:----------:|----------------------|--------:|
| 10-04-2021 12:00:17 | UA-10876-1 | James L. Silver      |   $50.5 |
| 10-04-2021 13:00:17 | UA-10346-1 | Christian A. Lavalle |  -22.98 |
| 10-04-2021 13:40:17 | UA-11876-3 | Terrell E. Evert     |     $33 |


## Example - Web scraping records


## Configuration

| Property                   | Default Value | Type    | Purpose |
|----------------------------|---------------|---------|---------|
| rowIndexForHeadings        | 0             | int     | TODO    |
| exportFileName             |               | string  | TODO    |
| exportFilePath             |               | string  | TODO    |
| includeTimestamp           | false         | boolean | TODO    |
| propertyNameConvention     | snakeCase     | string  | TODO    |
| applyDataTypeConversion    | false         | boolean | TODO    |
| removeAllNewlineCharacters | false         | boolean | TODO    |
| decimalColumns             | []            | array   | TODO    |


## More advanced examples

* Table contains a specific record
* Sorting
* Aggregate column
* Large dataset via fixture
* Large dataset using snapshot





TODO :-


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