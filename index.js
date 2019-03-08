"use strict;"

const fs = require("fs");
var dateFormat = require("dateformat");
const util = require("util");

//-------------------------------------------------------------

class mgCsvWriter {

  constructor(options) {
    this.options = options ? options : {};
    this.options.outfile = this.options.outfile ? this.options.outfile : "/tmp/outfile.csv";
    this.options.lineSep = this.options.lineSep ? this.options.lineSep : "\n";
    this.options.delimiter = this.options.delimiter ? this.options.delimiter : ",";
    this.options.header = this.options.header ? this.options.header : false;
  }

  writeHeader() {
    if (!this.options.header)
      return;

    let str = "";
    for (let col of this.options.columns) {
      str += this._value(col.title);
      str += this.options.delimiter;
    }

    if (str.length > 0) {
      str = str.substring(0, str.lastIndexOf(this.options.delimiter));
    }

    this._write(str + this.options.lineSep);
  }

  write(data) {
    data = !Array.isArray(data) ? [data] : data;

    for (let row of data) {
      this._write(this.formatRow(row) + this.options.lineSep);
    }
  }

  formatRow(row) {
    let str = "";

    for (let col of this.options.columns) {
      if (typeof row[col.id] != "undefined") {

        if (this._isFunction(col.fnFormat)) {
          str += col.fnFormat(row[col.id], col.id, row);
        } else if (col.dataType) {
          if (col.dataType == "date") {
            str += this._valueDate(row[col.id], col.dateMask);
          } else if (col.dataType == "int") {
            str += this._valueInt(row[col.id]);
          } else {
            str += this._value(row[col.id]); // unknown dataType; so just treat as normal
          }
        } else {
          str += this._value(row[col.id]);
        }

      } else if (typeof col.defaultValue != "undefined") {
        str += this._value(col.defaultValue);
      }

      str += this.options.delimiter;
    }

    if (str.length > 0) {
      str = str.substring(0, str.lastIndexOf(this.options.delimiter));
    }
    return str;
  }

  //---------------------------------------------------------------------
  // Internal functions

  _write(string) {
    fs.appendFileSync(this.options.outfile, string);
  }

  _isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
  }

  _valueInt(value, dateMask) {
    if (typeof value === "undefined" || value === null)
      return "";
    return value;
  }

  _valueDate(value, dateMask) {
    if (typeof value === "undefined" || value === null)
      return "";

    if (Object.prototype.toString.call(value) !== '[object Date]')
      return this._value(value);

    dateMask = (typeof dateMask === "undefined" || dateMask === null || dateMask === "") ? "isoDateTime" : dateMask;
    return dateFormat(value, dateMask);
  }

  _value(value) {
    if (typeof value === "undefined" || value === null)
      return "";

    const str = String(value);
    return this._needsQuoted(str) ? `"${str.replace(/"/g, '""')}"` : str;
  }

  _needsQuoted(str) {
    return str.includes(this.options.delimiter) || str.includes('\n') || str.includes('"');
  }
}

module.exports = mgCsvWriter;
