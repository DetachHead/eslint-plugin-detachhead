import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';
import os from 'os';
import path from 'path';
import { throwIfUndefined } from 'throw-expression';
import { createLanguageService, DiagnosticWithLocation, getDefaultLibFilePath, ScriptSnapshot, sys } from 'typescript';
import { createRule } from '../utils';

const getPosition = (location: DiagnosticWithLocation): TSESTree.Position => {
  const lines = location.file.text.substring(0, location.start).split(/\r\n|\r|\n/u);
  return {
    line: lines.length,
    column: throwIfUndefined(lines.at(-1), 'failed to get position for suggestion diagnostic')
      .length,
  };
};

const normalizePath = (filePath: string) => path.resolve(os.platform() === 'linux' ? filePath : filePath.toLowerCase());

export type Options = [
  {
    include?: number[];
    exclude?: number[];
  },
];

const messageId = 'tsSuggestionMessage';

export default createRule<Options, typeof messageId>({
  create: (context, [options]) => ({
    'Program:exit': () => {
      const program = ESLintUtils.getParserServices(context).program;
      const fileName = normalizePath(context.filename);
      const sourceFile = throwIfUndefined(
        program.getSourceFiles().find((file) => normalizePath(file.fileName) === fileName),
        'failed to find source file to check for suggestion diagnostics',
      );
      const languageServer = createLanguageService({
        getCompilationSettings: () => program.getCompilerOptions(),
        getDefaultLibFileName: getDefaultLibFilePath,
        readFile: sys.readFile,
        readDirectory: sys.readDirectory,
        fileExists: sys.fileExists,
        getScriptFileNames: () => program.getSourceFiles().map((file) => file.fileName),
        getScriptVersion: () => '0',
        getScriptSnapshot: () => ScriptSnapshot.fromString(context.sourceCode.getText()),
        getCurrentDirectory: () => context.cwd,
      });
      try {
        program;
        languageServer
          .getSuggestionDiagnostics(sourceFile.fileName)
          .forEach((diagnostic) => {
            if (
              (!options.include || options.include.includes(diagnostic.code))
              && (!options.exclude || !options.exclude.includes(diagnostic.code))
            ) {
              context.report({
                messageId: 'tsSuggestionMessage',
                loc: getPosition(diagnostic),
                data: {
                  message: diagnostic.messageText,
                  code: diagnostic.code,
                },
              });
            }
          });
      } catch (e) {
        throw new Error(
          'the following typescript crash occurred in the `detachhead/suggestions-as-errors` rule. you likely have two different versions of'
            + ' typescript installed due to conflicting dependencies. see the docs here for more information and potential fixes:'
            + ' https://github.com/DetachHead/eslint-plugin-detachhead/blob/master/docs/rules/suggestions-as-errors.md#troubleshooting\n\n'
            + String(e),
        );
      }
    },
  }),
  meta: {
    type: 'suggestion',
    docs: {
      // eslint-disable-next-line eslint-plugin/require-meta-docs-description -- sounds better like this
      description: 'report typescript suggestions as errors',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          include: {
            type: 'array',
            items: { type: 'number' },
          },
          exclude: {
            type: 'array',
            items: { type: 'number' },
          },
        },
      },
    ],
    messages: {
      [messageId]: 'Typescript suggestion ({{ code }}): {{ message }}',
    },
  },
  name: 'suggestions-as-errors',
  defaultOptions: [{}],
});
