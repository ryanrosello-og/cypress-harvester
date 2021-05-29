# cypress-harvester

cypress-harvester is command based plug-in for Cypress allowing you to easliy work with html tables, whether it be for testing or for web scarping purposes. 

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






TODO :-

[] merged cells
✅ infer integers

✅ conf.appendTimestamp
[] update doco
[] create npm package

[] pair of repeating elements
✅ as chain command
✅ handle duplicate columns
✅ handle duplicate webtables
[] config:
    ✅ jsonify column headings
    ✅ remove new line char from heading
    
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |