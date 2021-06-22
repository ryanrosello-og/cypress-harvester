Cypress.Commands.add(
  'scrapeElements',
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
