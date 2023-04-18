import { createRule } from '../utils'
import { as, narrow } from '@detachhead/ts-helpers/dist/functions/misc'
import { ESLintUtils, TSESTree } from '@typescript-eslint/utils'
import ts from 'typescript'

const getPosition = (location: ts.DiagnosticWithLocation): TSESTree.Position => ({
    line: location.file.text.substring(0, location.start).split(/\r\n|\r|\n/u).length,
    column: location.length,
})

export default createRule({
    create: (context) => ({
        'Program:exit': () => {
            const diagnostics = ts.getPreEmitDiagnostics(
                ESLintUtils.getParserServices(context).program,
            )
            return diagnostics.forEach((diagnostic) => {
                if (diagnostic.category === ts.DiagnosticCategory.Suggestion) {
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
            })
        },
    }),
    meta: {
        type: 'suggestion',
        docs: {
            description: 'disallow typescript suggestion messages',
            recommended: 'error',
        },
        schema: [],
        messages: {
            tsSuggestionMessage: 'Typescript suggestion ({{ code }}): {{ message }}',
        },
    },
    name: 'suggestions-as-errors',
    defaultOptions: [],
})
