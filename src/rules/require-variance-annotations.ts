import { createRule } from '../utils'
import { ESLintUtils, TSESTree } from '@typescript-eslint/utils'
import * as tsutils from 'tsutils'
import { ObjectFlags } from 'typescript'

export default createRule({
    create: (context) => ({
        ':matches(ClassDeclaration,TSTypeAliasDeclaration,TSInterfaceDeclaration):has(TsTypeParameterDeclaration>TSTypeParameter[in=false][out=false])':
            (
                node:
                    | TSESTree.ClassDeclaration
                    | TSESTree.TSTypeAliasDeclaration
                    | TSESTree.TSInterfaceDeclaration,
            ) => {
                if (node.typeParameters === undefined) {
                    // type aliases to functions with type parameters & interfaces with call signatures with type parameters
                    return
                }
                const parserServices = ESLintUtils.getParserServices(context)
                const checker = parserServices.program.getTypeChecker()

                const originalNode = parserServices.esTreeNodeToTSNodeMap.get(node)

                if (tsutils.isTypeAliasDeclaration(originalNode)) {
                    const nodeType = tsutils.isTypeReferenceNode(originalNode.type)
                        ? checker.getTypeAtLocation(originalNode.type.typeName)
                        : checker.getTypeFromTypeNode(originalNode.type)
                    if (
                        tsutils.isObjectType(nodeType) &&
                        nodeType.objectFlags & (ObjectFlags.Anonymous | ObjectFlags.Mapped)
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
        type: 'suggestion',
        docs: {
            description: 'enforce variance annotations for all generics where they are supported.',
            recommended: 'error',
        },
        schema: [],
        messages: {
            requireVarianceAnnotation:
                'generics must specify the variance (with `in` and/or `out` keywords)',
        },
    },
    name: 'require-variance-annotations',
    defaultOptions: [],
})
