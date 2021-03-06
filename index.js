'use strict;';

const fs = require('fs');
const dateFormat = require('dateformat');

// -------------------------------------------------------------

module.exports = class CsvFileWriter {
  constructor (options) {
    this.options = options || {};
    this.options.outfile = this.options.outfile ? this.options.outfile : '/tmp/outfile.csv';
    this.options.lineSep = this.options.lineSep ? this.options.lineSep : '\n';
    this.options.delimiter = this.options.delimiter ? this.options.delimiter : ',';
    this.options.header = this.options.header ? this.options.header : false;
    this.options.quoted = this.options.quoted ? this.options.quoted : false;
  }

  writeHeader () {
    if (!this.options.header) { return; }

    const outCols = [];
    for (const col of this.options.columns) {
      outCols.push(this._value(col.title));
    }

    this._write(outCols.join(this.options.delimiter) + this.options.lineSep);
  }

  write (data) {
    data = !Array.isArray(data) ? [data] : data;

    for (const row of data) {
      this._write(this._formatRow(row) + this.options.lineSep);
    }
  }

  // ---------------------------------------------------------------------
  // Internal functions

  _formatRow (row) {
    const outCols = [];

    for (const col of this.options.columns) {
      if (typeof row[col.id] !== 'undefined') {
        if (this._isFunction(col.fnFormat)) {
          outCols.push(col.fnFormat(row[col.id], col.id, row));
        } else if (col.dataType) {
          if (col.dataType === 'date') {
            outCols.push(this._valueDate(row[col.id], col.dateMask));
          } else if (col.dataType === 'int') {
            outCols.push(this._valueInt(row[col.id]));
          } else {
            outCols.push(this._value(row[col.id])); // unknown dataType; so just treat as normal
          }
        } else {
          outCols.push(this._value(row[col.id]));
        }
      } else if ('defaultValue' in col) {
        outCols.push(this._value(col.defaultValue));
      }
    }

    return outCols.join(this.options.delimiter);
  }

  _write (string) {
    fs.appendFileSync(this.options.outfile, string);
  }

  _isFunction (functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
  }

  _valueInt (value, dateMask) {
    if (typeof value === 'undefined' || value === null) { return ''; }
    return value;
  }

  _valueDate (value, dateMask) {
    if (typeof value === 'undefined' || value === null) { return ''; } else if (Object.prototype.toString.call(value) !== '[object Date]') { return this._value(value); }

    dateMask = (typeof dateMask === 'undefined' || dateMask === null || dateMask === '') ? 'isoDateTime' : dateMask;
    return `${dateFormat(value, dateMask)}`;
  }

  _value (value) {
    if (typeof value === 'undefined' || value === null) { return ''; }

    const str = String(value);
    return this._needsQuoted(str) ? `"${str.replace(/"/g, '""')}"` : str;
  }

  _needsQuoted (str) {
    return this.options.quoted || str.includes(this.options.delimiter) || str.includes('\n') || str.includes('"');
  }
};
