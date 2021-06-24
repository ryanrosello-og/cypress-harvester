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
import DataTable from '../support/data-table';
import { getTableMatrix } from '../support/table-slots';

const defaultConfig = () => {
  return {
    rowIndexForHeadings: 0,
    exportFileName: null,
    exportFilePath: null,
    includeTimestamp: false,
    propertyNameConvention: 'snakeCase',
    applyDataTypeConversion: false,
    removeAllNewlineCharacters: false,
    decimalColumns: [],
  };
};

Cypress.Commands.add('scrapeElements', (elements) => {
  let dataTable = new DataTable();
  const suppressLogs = { log: false };
  dataTable.columnLabels = elements.map((e) => e.label);
  dataTable.propertyNames = elements.map((e) => e.label);

  // TODO: find max Iterations

  cy.get(elements[0].locator)
    .its('length')
    .then((numberOfIterations) => {
      for (let i = 0; i < numberOfIterations; i++) {
        let o = new Object();

        for (let k = 0; k < elements.length; k++) {
          cy.get('body', suppressLogs).then(($body) => {
            if ($body.find(elements[k].locator, suppressLogs)[i]) {
              cy.get(elements[k].locator, suppressLogs)
                .eq(i, suppressLogs)
                .then((e) => {
                  o[elements[k].label] = e[0].textContent;
                });
            } else {
              o[elements[k].label] = '';
            }
          });
        }
        dataTable.addItem(o);
      }
      return cy.wrap(dataTable);
    });
});

Cypress.Commands.add(
  'scrapeTable',
  {
    prevSubject: true,
  },
  (subject, options) => {
    const conf = { ...defaultConfig(), ...options };
    let dataTable = new DataTable();
    const tableElement = subject[0];

    if (!isTableElement(tableElement)) {
      dataTable.info = '!!! The element encountered was not a <table>';
      return dataTable;
    }

    const tableMatrix = getTableMatrix(tableElement);
    if (tableMatrix.length === 0) {
      return dataTable;
    }

    const columnHeaders = tableMatrix[conf.rowIndexForHeadings].map(
      (cell) => cell.textContent
    );
    let propertyNames = columnNameAsProperty(conf, columnHeaders);

    for (let i = conf.rowIndexForHeadings + 1; i < tableMatrix.length; i++) {
      let o = new Object();
      tableMatrix[i].forEach((cell, index) => {
        let cellValue = conf.removeAllNewlineCharacters
          ? removeAllNewlineChars(cell.textContent)
          : cell.textContent;
        o[propertyNames[index]] = applyDataConversion(
          conf.decimalColumns,
          index,
          cellValue
        );
      });
      dataTable.addItem(o);
    }

    Cypress.log({
      name: 'scrapeTable',
      message: tableElement,
      $el: subject,
      consoleProps: () => {
        return {
          tableElement,
          conf,
          dataTable,
        };
      },
    });

    // save to file?
    if (conf.exportFilePath && conf.exportFileName) {
      dataTable.flagAsExported(
        `${dataTable.info}\n ${exportTable(conf, dataTable)}`
      );
    }

    dataTable.info = moreThanOneTable(subject);
    dataTable.columnLabels = columnHeaders;
    dataTable.propertyNames = propertyNames;
    return cy.wrap(dataTable);
  }
);

const columnNameAsProperty = (conf, columnHeaders) => {
  let propertyNames = [];
  columnHeaders.forEach((column, cellIndex) => {
    const columName = extractColumnName(
      column,
      conf.propertyNameConvention,
      cellIndex
    );

    propertyNames[cellIndex] = propertyNames.includes(columName)
      ? `${columName}_${cellIndex}`
      : columName;
  });
  return propertyNames;
};

/**
 * Saves json object to a file using cy.writefile
 * @param {object} config - configuration contain options for the export
 * @param {Array} jsonData - data for export
 * @returns message where the exported file is saved into
 */
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

const isTableElement = (subject) => {
  return subject.tagName.toLowerCase() === 'table';
};

const applyDataConversion = (columnsToConvert, columnIndex, rawCellValue) => {
  if (columnsToConvert.length === 0) return rawCellValue;

  if (columnsToConvert.includes(columnIndex)) {
    return Number(rawCellValue.replace(/[^0-9\.-]+/g, ''));
  } else {
    return rawCellValue;
  }
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
  return rawString.replace(/[^a-zA-Z0-9 ]/g, '');
};

const removeAllNewlineChars = (rawString) => {
  return rawString.replace(/(\r\n|\n|\r)/gm, '').trim();
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
