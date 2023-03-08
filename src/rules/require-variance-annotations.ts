import { ESLintUtils, TSESTree } from '@typescript-eslint/utils'
import tsutils from 'tsutils'
import ts from 'typescript'

const createRule = ESLintUtils.RuleCreator((name) => `https://example.com/rule/${name}`)

export default createRule({
    create: (context) => ({
        ':matches(ClassDeclaration,TSTypeAliasDeclaration,TSInterfaceDeclaration):has(TsTypeParameterDeclaration>TSTypeParameter[in=false][out=false])':
            (
                node:
                    | TSESTree.ClassDeclaration
                    | TSESTree.TSTypeAliasDeclaration
                    | TSESTree.TSInterfaceDeclaration,
            ) => {
                const parserServices = ESLintUtils.getParserServices(context)
                const checker = parserServices.program.getTypeChecker()

                const originalNode = parserServices.esTreeNodeToTSNodeMap.get(node)

                if (tsutils.isTypeAliasDeclaration(originalNode)) {
                    const nodeType = tsutils.isTypeReferenceNode(originalNode.type)
                        ? checker.getTypeAtLocation(originalNode.type.typeName)
                        : checker.getTypeFromTypeNode(originalNode.type)
                    if (
                        tsutils.isObjectType(nodeType) &&
                        nodeType.objectFlags & (ts.ObjectFlags.Anonymous | ts.ObjectFlags.Mapped)
                    ) {
                        context.report({
                            messageId: 'requireVarianceAnnotation',
                            node: node,
                        })
                    }
                    return
                }

                if (
                    tsutils.isInterfaceDeclaration(originalNode) ||
                    tsutils.isClassDeclaration(originalNode)
                ) {
                    context.report({
                        messageId: 'requireVarianceAnnotation',
                        node: node,
                    })
                }
            },
    }),
    meta: {
        docs: {
            description: 'Avoid looping over enums.',
            recommended: 'error',
        },
        messages: {
            requireVarianceAnnotation:
                'generics must specify the variance (with `in` and/or `out` keywords)',
        },
        type: 'suggestion',
        schema: [],
    },
    name: 'require-variance-annotations',
    defaultOptions: [],
})
