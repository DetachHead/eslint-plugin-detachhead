import { RuleTester } from '@typescript-eslint/rule-tester';
import path from 'path';
import rule from '../../src/rules/suggestions-as-errors';

const jsFile = path.resolve(__dirname, '../fixtures/jsfile.js');

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      project: './tsconfig.json',
      tsconfigRootDir: path.join(__dirname, '../fixtures'),
    },
  },
});

ruleTester.run('suggestions-as-errors', rule, {
  valid: [
    'console.log(1)',
    {
      filename: jsFile,
      code: "/** @type {import('eslint').Linter.Config} */\nconst config = {}",
    },
    {
      filename: jsFile,
      code: "/** @type {Partial<import('@trivago/prettier-plugin-sort-imports').PrettierConfig>} */\nconst config = {}",
    },
    /* eslint-disable eslint-plugin/require-test-case-name  -- TODO */
    {
      code: 'async () => await 1',
      options: [{ exclude: [80007] }],
    },
    {
      code: 'async () => await 1',
      options: [{ include: [] }],
    },
    {
      code: 'async () => await 1',
      options: [{ include: [80007], exclude: [80007] }],
    },
    /* eslint-enable eslint-plugin/require-test-case-name */
  ],
  invalid: [
    {
      code: 'async () => await 1',
      errors: [{ messageId: 'tsSuggestionMessage' }],
    },
    {
      code: "import * as ts from 'typescript'",
      errors: [{ messageId: 'tsSuggestionMessage' }],
    },
    {
      code: "import * as ts from 'typescript';async () => await 1",
      errors: [{ messageId: 'tsSuggestionMessage' }, { messageId: 'tsSuggestionMessage' }],
    },
    /* eslint-disable eslint-plugin/require-test-case-name -- TODO */
    {
      code: "import * as ts from 'typescript';async () => await 1",
      options: [{ include: [80007] }],
      errors: [{ messageId: 'tsSuggestionMessage' }],
    },
    {
      code: "import * as ts from 'typescript';async () => await 1",
      options: [{ include: [80003] }],
      errors: [{ messageId: 'tsSuggestionMessage' }],
    },
    {
      code: 'console.log(1)\nasync () => await 1',
      errors: [{ messageId: 'tsSuggestionMessage', line: 2, column: 13 }],
    },
    /* eslint-enable eslint-plugin/require-test-case-name */
  ],
});
