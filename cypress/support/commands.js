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
          o[columnHeadings[cellIndex]] = cell.textContent;
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

    return dataTable;
  }
);

const defaultConfig = () => {
  return {
    rowIndexForHeadings: 0,
    exportFileName: '',
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
