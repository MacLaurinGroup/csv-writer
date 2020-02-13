## csv-writer

A fast, lean CSV-WRITER for node that gives enough flexibility to create CSV files quickly and painlessly without too many hoops.

Features:

* Optional CSV file write
* Pagable results
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
  header: true,
  quoted: false,
  lineSep : "\n",
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

csv.writeHeader();

csv.write(stockData);  // can be a single row; or an array of rows
csv.write(stockData2);  // multiple calls will add to the file
```


## Updates

* 2020-02-13 Added quoted attribute
* 2019-03-08 Initial Release
