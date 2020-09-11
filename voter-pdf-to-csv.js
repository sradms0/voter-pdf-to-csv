#!/usr/bin/env node

const { writeFile }   = require('fs'),
      { Parser }      = require('json2csv'),
      { PDFExtract }  = require('pdf.js-extract'),
      propMatcher     = require('./lib/property-matcher'),
      propExtractor   = require('./lib/property-extractor');

const pdfExtract  = new PDFExtract(),
      options     = {disableCombineTextItems: true};

const args = process.argv.slice(2),
      [ inFile ] = args;

if (args.length < 1) {
  console.error('pdf input file required');
  process.exit(-1);
} 

const patronKeys = ["first", "last", "phone", "street", "city",  "state", "zip", "sex", "age", "email", "party"];

function extractPDFData() {
  return new Promise((resolve, reject) => {
    pdfExtract.extract(inFile, options, (err, data) => {
      if (err) reject(err);
      resolve(data.pages);
    });
  });
}

function buildString(pages) {
  let dataString = '';
  pages.forEach(p => p.content.forEach(c => {
    // existing typo(s) in name field
    sanitizedStr = c.str.replace(';', '').trim();
    dataString += !sanitizedStr.match(/Sex:|Age:|Email|Party:|:|Page \d+|Generated/) ? sanitizedStr+'\n' : ''
  }));
  return dataString;
}

function parseString(string) {
  const stringSplit = string.split('\n'),
        dataArray = [];
  let patronData = {},
      location = '';

  for (let i = 0; i < stringSplit.length-1; i++) {
    let line = stringSplit[i];
    patronKeys.forEach(k => patronData[k] = '');

    if (propMatcher.isLocation(line)) location = line;
    if (propMatcher.isName(line)) {
      let { last, first } = propExtractor.extractName(line);
      patronData.last = last, patronData.first = first;
      delete patronData.name;

      let j = i+1;
      console.log(`${last}, ${first}`)
      while (j < stringSplit.length && !propMatcher.isName(stringSplit[j]) && !propMatcher.isLocation(stringSplit[j])) {
        line = stringSplit[j];
        if      (propMatcher.isPhone(line))    patronData.phone  = line;
        else if (propMatcher.isCity(line))     patronData.city   = line;
        else if (propMatcher.isStreet(line))   patronData.street = line;
        else if (propMatcher.isSex(line))      patronData.sex    = line;
        else if (propMatcher.isAge(line))      patronData.age    = line;
        else if (propMatcher.isParty(line))    patronData.party  = line;
        else if (propMatcher.isEmail(line))    patronData.email  = line;
        i = j++;
      }
      let { street, city, state, zip } = propExtractor.extractResidency(patronData.street, patronData.city);
      patronData.street = street;
      patronData.city = city;
      patronData.state = state;
      patronData.zip = zip;
      patronData.location = location;

      dataArray.push(patronData);
      patronData = {};
    }
  }
  return dataArray;
}

try {
  (async _ => {
    try {
      const pages     = await extractPDFData(),
            string    = buildString(pages),
            data      = parseString(string);
            parser    = new Parser(),
            csv       = parser.parse(data),
            outFile   = inFile.split(/\//).pop().replace('pdf','csv')
            filePath  = `./data/csv/${outFile}`;

      await writeFile(filePath, csv, err => {
        if (err) throw err;
        console.log(`Data successfully written to: ${filePath}`);
      })
    } catch (err) { console.log(err); }
  })();
} catch (err) { console.log(err); }
