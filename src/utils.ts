import { ESLintUtils } from '@typescript-eslint/utils'

export const createRule = ESLintUtils.RuleCreator(
    (name) =>
        `https://github.com/DetachHead/eslint-plugin-detachhead/blob/master/docs/rules/${name}.md`,
)
