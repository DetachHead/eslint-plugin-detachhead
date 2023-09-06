import { createRule } from '../utils'
import { ESLintUtils, TSESTree } from '@typescript-eslint/utils'
import os from 'os'
import path from 'path'
import { throwIfUndefined } from 'throw-expression'
import { CancellationToken, DiagnosticWithLocation, computeSuggestionDiagnostics } from 'typescript'

const cancellationToken: CancellationToken = {
    isCancellationRequested: () => false,
    throwIfCancellationRequested: () => undefined,
}

const getPosition = (location: DiagnosticWithLocation): TSESTree.Position => {
    const lines = location.file.text.substring(0, location.start).split(/\r\n|\r|\n/u)
    return {
        line: lines.length,
        column: throwIfUndefined(lines.at(-1), 'failed to get position for suggestion diagnostic')
            .length,
    }
}

const normalizePath = (filePath: string) =>
    path.resolve(os.platform() === 'linux' ? filePath : filePath.toLowerCase())

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
            // eslint-disable-next-line eslint-plugin/require-meta-docs-description -- sounds better like this
            description: 'report typescript suggestions as errors',
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
