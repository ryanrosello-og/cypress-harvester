export default class DataTable {
  constructor() {
    this.data = [];
    this.propertyNames = [];
    this.columnLabels = [];
    this.exportStatus = '';
  }

  rowCount() {
    return this.data.length;
  }

  addItem(data) {
    this.data.push(data);
  }

  getData() {
    return this.data;
  }

  hasItem(item) {
    return Cypress._.find(this.data, item);
  }

  flagAsExported(downloadPath) {
    this.exportStatus = downloadPath;
  }

  isPropertySorted(properties, sortOrders) {
    var expectedTableSort = Cypress._.orderBy(
      this.data,
      properties,
      sortOrders
    );

    return Cypress._.isEqual(this.data, expectedTableSort);
  }

  sumOfColumn(columnName, decimalPlaces = 2) {
    const balance = this.data.map((c) => c[columnName]);
    const expecteSum = Cypress._.sum(balance);
    return Cypress._.round(expecteSum, decimalPlaces);
  }
}
