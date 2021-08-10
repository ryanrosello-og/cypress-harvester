declare namespace Cypress {
    interface ScrapeTableOptions {
        rowIndexForHeadings?: number,
        exportFileName?: string
        exportFilePath?: string,
        includeTimestamp?: boolean,
        propertyNameConvention?: string,
        applyDataTypeConversion?: boolean,
        removeAllNewlineCharacters?: boolean,
        decimalColumns?: string[]
    }

    interface DataTableI {
        rowCount(): number
        addItem(data: any): any[]
        getData(): any[]
        hasItem(item: any): any
        containsItem(property: any, searchTerm: any): any
        flagAsExported(downloadPath: string): void
        isPropertySorted(properties: any, sortOrders: any): boolean
        sumOfColumn(columnName: string, decimalPlaces = 2): number
        data: any[];
        propertyNames: any[];
        columnLabels: any[];
        exportStatus: string;
        info?: string
    }

    interface Chainable {
        /**
         * Command to scrape \<table \/> and return a json
         * @param options configurable options for table scraped
         */
        scrapeTable(options: ScrapeTableOptions = null): Chainable<DataTableI>;
    }
}
