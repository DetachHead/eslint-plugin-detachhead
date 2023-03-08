import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";
import * as ts from "typescript";
import * as tsutils from "tsutils";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://example.com/rule/${name}`
);

export const rule = createRule({
  create(context) {
    return {
      ":matches(ClassDeclaration,TSTypeAliasDeclaration,TSInterfaceDeclaration):has(TsTypeParameterDeclaration>TSTypeParameter[in=false][out=false])"(
        node:
          | TSESTree.ClassDeclaration
          | TSESTree.TSTypeAliasDeclaration
          | TSESTree.TSInterfaceDeclaration
      ) {
        // 1. Grab the TypeScript program from parser services
        const parserServices = ESLintUtils.getParserServices(context);
        const checker = parserServices.program.getTypeChecker();

        // 2. Find the backing TS node for the ES node, then that TS type
        const originalNode = parserServices.esTreeNodeToTSNodeMap.get(node);

        if (tsutils.isTypeAliasDeclaration(originalNode)) {
          const nodeType = tsutils.isTypeReferenceNode(originalNode.type)
            ? checker.getTypeAtLocation(originalNode.type.typeName)
            : checker.getTypeFromTypeNode(originalNode.type);
          if (
            tsutils.isObjectType(nodeType) &&
            (
              nodeType.objectFlags &
              (ts.ObjectFlags.Anonymous | ts.ObjectFlags.Mapped)
            )
          ) {
            context.report({
              messageId: "requireVarianceAnnotation",
              node: node,
            });
          }
          return;
        }

        // 3. Check the TS node type using the TypeScript APIs
        if (
          tsutils.isInterfaceDeclaration(originalNode) ||
          tsutils.isClassDeclaration(originalNode)
        ) {
          context.report({
            messageId: "requireVarianceAnnotation",
            node: node,
          });
        }
      },
    };
  },
  meta: {
    docs: {
      description: "Avoid looping over enums.",
      recommended: "error",
    },
    messages: {
      requireVarianceAnnotation:
        "generics must specify the variance (with `in` and/or `out` keywords)",
    },
    type: "suggestion",
    schema: [],
  },
  name: "require-variance-annotations",
  defaultOptions: [],
});
