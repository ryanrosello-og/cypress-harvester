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

## Example - Web scraping records


## Configuration


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