## csv-writer

A fast, lean CSV-WRITER for node that gives enough flexibility to create CSV files quickly and painlessly without too many hoops.

Features:

* Optional CSV file write
* Pagable results
* Delete file prior to creation
* async / await ready
* Customizable delimiter
* Customizable column control
  * Date formating
  * Type overriding
  * Value escaping
  * Callback function for ultimate control on formatting

## Installation

```
npm install mg-csv-writer
```

## Usage

```
var stockData = [{
		Symbol: "AAPL",
		Company: "Apple Inc.",
		Price: 132.5,
		TradeDt: new Date()
	},
	{
		Symbol: "INTC",
		Company: "Intel Corporation",
		Price: 33.45,
		TradeDt: new Date()
	},
	{
		Symbol: "GOOG",
		Company: "Google Inc",
		Price: 554.52,
		TradeDt: new Date()
	},
	{
		Symbol: "TLSA",
		Price: 554.52,
		TradeDt: new Date()
	}
];

const mgCsvWriter = require("mg-csv-writer");

const csvOut = new mgCsvWriter({
  outfile: "/tmp/output.csv",
  deleteFile : true,
  header: true,
  delimiter: ",",
  columns: [{
      id: "Symbol",
      title: "Company Name",
      fnFormat: function(colData, colId, rowData) {
        // so something special!
        return colData;
      }
    },
    { id: "Company",
      title: "Id",
      defaultValue: "no name" },
    { id: "Price",
      title: "Price",
      dataType: "int",
      prefix: "$" },
    { id: "TradeDt",
      title: "Trade Date",
      dataType: "date",
      dateMask: "yyyy-mm-dd"
    }
  ]
});

await csv.writeHeader();

await csv.write(stockData);  // can be a single row; or an array of rows
await csv.write(stockData2);  // multiple calls will add to the file
```


## Updates

* 2019-03-08 Initial Release
