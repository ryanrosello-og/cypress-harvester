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
var dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
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
    dateColumns: [],
    dateFormat: 'DD-MM-YYYY HH:MM:SS',
  };
};

Cypress.Commands.add(
  'scrapeElements',
  {
    prevSubject: true,
  },
  (subject, options) => {
    const suppressLog = { log: false };
    let baseConfig = { config: defaultConfig() };
    baseConfig.config.removeAllNewlineCharacters = true;

    const conf = { ...baseConfig.config, ...options.config };
    let dataTable = new DataTable();
    dataTable.info = '';
    const elementsToScrape = options.elementsToScrape;

    cy.wrap(subject, suppressLog).each(($el, index, $list) => {
      cy.wrap($el, suppressLog).then(($body) => {
        let scrappedObject = {};
        cy.wrap(elementsToScrape, suppressLog).each(($e, i, $elms) => {
          let childElementLocator = elementsToScrape[i].locator;
          if ($body.find(childElementLocator).length > 0) {
            cy.get($el, suppressLog).within(suppressLog, () => {
              cy.get(childElementLocator, suppressLog)
                .invoke(suppressLog, 'text')
                .then((rawText) => {
                  let cellValue = conf.removeAllNewlineCharacters
                    ? removeAllNewlineChars(rawText)
                    : rawText;

                  scrappedObject[elementsToScrape[i].label] =
                    applyDataConversion({
                      decimalCols: conf.decimalColumns,
                      dateColumns: conf.dateColumns,
                      dateFormal: conf.dateFormat,
                      columnIndex: i,
                      rawCellValue: cellValue,
                    });
                });
            });
          } else {
            scrappedObject[elementsToScrape[i].label] = '';
          }
        });
        dataTable.addItem(scrappedObject);
      });
    });

    Cypress.log({
      name: 'scrapeElements',
      message: subject,
      $el: subject,
      consoleProps: () => {
        return {
          subject,
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
    dataTable.propertyNames = elementsToScrape.map((e) => e.label);
    dataTable.columnLabels = dataTable.propertyNames;

    return cy.wrap(dataTable);
  }
);

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
        o[propertyNames[index]] = applyDataConversion({
          decimalCols: conf.decimalColumns,
          dateColumns: conf.dateColumns,
          dateFormat: conf.dateFormat,
          columnIndex: index,
          rawCellValue: cellValue,
        });
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

const applyDataConversion = (options) => {
  if (options.decimalCols.length === 0 && options.dateColumns.length === 0)
    return options.rawCellValue;

  if (options.decimalCols.includes(options.columnIndex)) {
    return Number(options.rawCellValue.replace(/[^0-9\.-]+/g, ''));
  } else if (options.dateColumns.includes(options.columnIndex)) {
    debugger
    return dayjs(options.rawCellValue, options.dateFormat);
  } else {
    return options.rawCellValue;
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
