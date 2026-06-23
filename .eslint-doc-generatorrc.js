import { readFileSync } from 'fs';

const { createContext } = require('@dprint/formatter');

const formatter = createContext(JSON.parse(readFileSync('./dprint.json', 'utf8')));

/** @type {import('eslint-doc-generator').GenerateOptions} */
const config = {
  ignoreConfig: ['all'],
  postprocess: (fileText, filePath) => {
    return formatter.formatText({ fileText, filePath });
  },
};

module.exports = config;
