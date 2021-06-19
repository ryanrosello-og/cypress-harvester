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

  containsItem(property, searchTerm) {
    return Cypress._.filter(this.data, (i) => {
      return i[property].includes(searchTerm);
    });
  }

  flagAsExported(downloadPath) {
    this.exportStatus = downloadPath;
  }

  isPropertySorted(properties, sortOrders) {
    if (!properties || properties.length === 0) {
      return new Error('No column names provided for assertion');
    }

    if (
      !sortOrders ||
      sortOrders.length === 0 ||
      !Cypress._.values(sortOrders).every(
        (sort) => sort === 'asc' || sort === 'desc'
      )
    ) {
      return new Error(
        'Sort order is required, this value can either be "asc" or "desc"'
      );
    }

    if (
      properties.length !==
      Cypress._.intersection(this.propertyNames, properties).length
    ) {
      return new Error(
        `Unexpected columns names encountered [${properties}], expected columns name to be one of [${this.propertyNames}]`
      );
    }

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
