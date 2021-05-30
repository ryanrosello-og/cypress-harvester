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

Cypress.Commands.add(
  'scrapeTable',
  {
    prevSubject: true,
  },
  (subject, options) => {
    const conf = { ...defaultConfig(), ...options };
    let scrapped = [];
    let propertyNames = [];
    let columnLabels = [];
    const tableElement = subject[0];
    var trows = tableElement.rows;

    let dataTable = {
      data: scrapped,
      propertyNames: propertyNames,
      columnLabels: columnLabels,
      numberOfRecords: scrapped.length,
      info: '',
    };

    let d = new DataTable();

    if (!isTableElement(tableElement)) {
      dataTable.info = '!!! The element encountered was not a <table>';
      return dataTable;
    }

    Cypress.$.each(trows, (rowIndex, row) => {
      let o = new Object();
      let mergeCellOffest = 0;

      Cypress.$.each(row.cells, (cellIndex, cell) => {
        if (rowIndex == conf.rowIndexForHeadings) {
          columnLabels[cellIndex] = cell.textContent; // unmodified column labels
          // extract column headings
          const columName = extractColumnName(
            cell.textContent,
            conf.propertyNameConvention,
            cellIndex
          );

          propertyNames[cellIndex] = propertyNames.includes(columName)
            ? `${columName}_${cellIndex}`
            : columName;
        } else {
          let cellValue = conf.removeAllNewlineCharacters
            ? removeAllNewlineChars(cell.textContent)
            : cell.textContent;
          // if merged cell
          if (cell.hasAttribute('colspan')) {
            let numCellSpan = parseInt(cell.getAttribute('colspan'));
            for (let i = 0; i < numCellSpan; i++) {
              o[propertyNames[cellIndex + mergeCellOffest + i]] =
                applyDataConversion(conf.decimalColumns, i, cellValue);
            }
            mergeCellOffest = mergeCellOffest + (numCellSpan - 1);
          } else {
            o[propertyNames[cellIndex + mergeCellOffest]] = applyDataConversion(
              conf.decimalColumns,
              cellIndex,
              cellValue
            );
          }
        }
      });

      if (rowIndex !== conf.rowIndexForHeadings) {
        scrapped.push(o);
        d.addItem(o);
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
    dataTable.propertyNames = propertyNames;
    dataTable.columnLabels = columnLabels;
    dataTable.numberOfRecords = scrapped.length;
    dataTable.info = moreThanOneTable(subject);

    // save to file?
    if (conf.exportFilePath && conf.exportFileName) {
      dataTable.info = `${dataTable.info}\n ${exportTable(
        conf,
        dataTable.data
      )}`;
      d.flagAsExported(
        `${dataTable.info}\n ${exportTable(conf, dataTable.data)}`
      );
    }
    // return cy.wrap(dataTable);
    d.columnLabels = columnLabels;
    return cy.wrap(d);
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
