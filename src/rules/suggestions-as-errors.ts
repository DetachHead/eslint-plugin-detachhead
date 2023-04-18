import { createRule } from '../utils'
import { as, narrow } from '@detachhead/ts-helpers/dist/functions/misc'
import { ESLintUtils, TSESTree } from '@typescript-eslint/utils'
import os from 'os'
import path from 'path'
import { throwIfUndefined } from 'throw-expression'
import ts from 'typescript'

const computeSuggestionDiagnostics: (
    sourceFile: ts.SourceFile,
    program: ts.Program,
    cancellationToken: ts.CancellationToken,
) => ts.DiagnosticWithLocation[] =
    // @ts-expect-error internal function that they tried to hide from me
    ts.computeSuggestionDiagnostics as never

const cancellationToken: ts.CancellationToken = {
    isCancellationRequested: () => false,
    throwIfCancellationRequested: () => undefined,
}

const getPosition = (location: ts.DiagnosticWithLocation): TSESTree.Position => ({
    line: location.file.text.substring(0, location.start).split(/\r\n|\r|\n/u).length,
    column: location.length,
})

const normalizePath = (filePath: string) =>
    path.resolve(os.platform() === 'win32' ? filePath.toLowerCase() : filePath)

export type Options = [
    {
        include?: number[]
        exclude?: number[]
    },
]

const messageId = 'tsSuggestionMessage'

export default createRule<Options, typeof messageId>({
    create: (context, [options]) => ({
        'Program:exit': () => {
            const program = ESLintUtils.getParserServices(context).program
            const fileName = normalizePath(context.getFilename())
            const sourceFile = throwIfUndefined(
                program.getSourceFiles().find((file) => normalizePath(file.fileName) === fileName),
                'failed to find source file to check for suggestion diagnostics',
            )
            computeSuggestionDiagnostics(sourceFile, program, cancellationToken).forEach(
                (diagnostic) => {
                    if (
                        (!options.include || options.include.includes(diagnostic.code)) &&
                        (!options.exclude || !options.exclude.includes(diagnostic.code))
                    ) {
                        narrow(diagnostic, as<ts.DiagnosticWithLocation>)
                        context.report({
                            messageId: 'tsSuggestionMessage',
                            loc: getPosition(diagnostic),
                            data: {
                                message: diagnostic.messageText,
                                code: diagnostic.code,
                            },
                        })
                    }
                },
            )
        },
    }),
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'disallow typescript suggestion messages which are usually only displayed in IDEs',
            recommended: 'error',
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
})
