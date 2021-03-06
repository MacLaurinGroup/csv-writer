'use strict;';

const CsvFileWriter = require('./index.js');

var stockData = [{
  Symbol: 'AAPL',
  Company: 'Apple Inc.',
  Price: 132.5,
  TradeDt: new Date()
},
{
  Symbol: 'INTC',
  Company: 'Intel Corporation',
  Price: 33.45,
  TradeDt: new Date()
},
{
  Symbol: 'GOOG',
  Company: 'Google Inc',
  Price: 554.52,
  TradeDt: new Date()
},
{
  Symbol: 'TLSA',
  Price: 554.52,
  TradeDt: new Date()
}
];

const main = async () => {
  try {
    const csv = new CsvFileWriter({
      outfile: '/tmp/output.csv',
      header: true,
      delimiter: ',',
      columns: [{
        id: 'Symbol',
        title: 'Company Name',
        fnFormat: function (colData, colId, rowData) {
          return 'susan';
        }
      },
      { id: 'Company', title: 'Id', defaultValue: 'no name' },
      { id: 'Price', title: 'Is Microsite', dataType: 'int', prefix: '$' },
      { id: 'TradeDt', title: 'Microsite URL', dataType: 'date', dateMask: '' }
      ]
    });

    csv.writeHeader();
    csv.write(stockData);
    csv.write(stockData);
  } catch (e) {
    console.log(e);
  }
};

main();
