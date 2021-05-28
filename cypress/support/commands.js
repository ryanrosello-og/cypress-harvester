// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
var path = require('path');

Cypress.Commands.add(
  'scrapeTable',
  {
    prevSubject: true,
  },
  (subject, options) => {
    const conf = { ...defaultConfig(), ...options };
    let scrapped = [];
    let columnHeadings = [];
    const tableElement = subject[0];
    var trows = tableElement.rows;

    let dataTable = {
      data: scrapped,
      columnHeadings: columnHeadings,
      numberOfRecords: scrapped.length,
      info: '',
    };

    if (!isTableElement(tableElement)) {
      dataTable.info = '!!! The element encountered was not a <table>';
      return dataTable;
    }

    Cypress.$.each(trows, (rowIndex, row) => {
      let o = new Object();

      let skippableColumns = [];
      let mergeCellOffest = 0;
      Cypress.$.each(row.cells, (cellIndex, cell) => {
        if (rowIndex == conf.rowIndexForHeadings) {
          // extract column headings
          const columName = extractColumnName(
            cell.textContent,
            conf.propertyNameConvention,
            cellIndex
          );

          columnHeadings[cellIndex] = columnHeadings.includes(columName)
            ? `${columName}_${cellIndex}`
            : columName;
        } else {
          // if merged cell

          if (cell.hasAttribute('colspan')) {
            debugger;
            let numCellSpan =
              parseInt(cell.getAttribute('colspan')) + cellIndex;
            //mergeCellOffest = numCellSpan - 1;
            for (let i = cellIndex; i <= numCellSpan - 1; i++) {
              o[columnHeadings[i]] = cell.textContent;
              skippableColumns.push(i);
              mergeCellOffest++;
            }
          } else if (!skippableColumns.includes(cellIndex)) {
            // o[columnHeadings[mergeCellOffest + cellIndex ]] =
            //   cell.textContent;
            o[columnHeadings[cellIndex + mergeCellOffest]] = cell.textContent;
          }
        }
      });

      if (rowIndex !== conf.rowIndexForHeadings) {
        scrapped.push(o);
      }
    });

    Cypress.log({
      name: 'scrapeTable',
      message: tableElement,
      $el: subject,
      consoleProps: () => {
        return {
          tableElement,
          options,
          dataTable,
        };
      },
    });

    dataTable.data = scrapped;
    dataTable.columnHeadings = columnHeadings;
    dataTable.numberOfRecords = scrapped.length;
    dataTable.info = moreThanOneTable(subject);

    // save to file?
    if (conf.exportFilePath && conf.exportFileName) {
      dataTable.info = `${dataTable.info}\n ${exportTable(
        conf,
        dataTable.data
      )}`;
    }
    return cy.wrap(dataTable);
  }
);

const exportTable = (config, jsonData) => {
  let fileName = config.exportFileName;
  if (config.includeTimestamp) {
    fileName = `${new Date().toISOString().replaceAll(':', '')}_${fileName}`;
  }
  cy.writeFile(path.join(config.exportFilePath, fileName), jsonData);
  return `Data table successfully saved to [${path.join(
    config.exportFilePath,
    fileName
  )}]`;
};

const defaultConfig = () => {
  return {
    rowIndexForHeadings: 0,
    exportFileName: null,
    exportFilePath: null,
    includeTimestamp: false,
    propertyNameConvention: 'snakeCase',
    applyDataTypeConversion: false,
  };
};

const validateConfig = () => {};

const isTableElement = (subject) => {
  return subject.tagName === 'TABLE';
};

const extractColumnName = (
  rawColumnName,
  propertyNameConvention,
  columnIndex
) => {
  let colName = removeAllSpecialChars(rawColumnName);

  if (colName === '') return `column_name_${columnIndex}`;

  if (propertyNameConvention.toLowerCase() === 'snakecase') {
    return Cypress._.snakeCase(colName);
  } else if (propertyNameConvention.toLowerCase() === 'camelcase') {
    return Cypress._.camelCase(colName);
  } else {
    return colName;
  }
};

const removeAllSpecialChars = (rawString) => {
  return rawString.replace(/[^a-zA-Z ]/g, '');
};

const moreThanOneTable = (table) => {
  const message =
    '!!! More than one table found - data extracted from the first table.  Ensure your table locator produces exactly 1 unique table.';

  if (table.length !== 1) {
    Cypress.log({
      name: 'scrapeTable',
      message: message,
      $el: table,
      consoleProps: () => {
        return {
          message,
        };
      },
    });
    return message;
  }

  return '';
};
