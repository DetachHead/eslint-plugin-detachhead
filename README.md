# eslint-plugin-detachhead

> [!IMPORTANT]
> 
> **ARCHIVED**
> 
> since i created this plugin, eslint completely changed how their config files work (while somehow not solving any of the problems that made eslint config such a nightmare in the first place). i gave up trying to get my plugin to work with this new system, and i now use oxlint instead.
>
> if you are looking for alternatives to these rules:
> - `suggestions-as-errors` - i think all the typescript compiler suggestions i relied on this rule for are covered by existing rules:
>   - [`typescript/no-deprecated`](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-deprecated.html)
>   - [`typescript/no-require-imports`](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-require-imports.html)
> - `require-variance-annotations` - https://github.com/oxc-project/oxc/issues/23804

detachhead&#39;s eslint rules

## Installation & Usage

### method 1 (recommended) - `@detachhead/eslint-config`

it's recommended to use my [`@detachhead/eslint-config`](https://github.com/detachhead/eslint-config) as it includes all of the eslint plugins & rules that i recommend. this plugin only contains rules i made myself and is intended to be used along with my config

```sh
npm install @detachhead/eslint-config --save-dev
```

then extend the config in your `.eslintrc` file:

```json
{
    "extends": ["@detachhead/eslint-config"]
}
```

### method 2 - just the plugin

```sh
npm install eslint-plugin-detachhead --save-dev
```

Add `detachhead` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": ["detachhead"]
}
```

then enable all rules by extending the "all" config:

```json
{
    "extends": ["detachhead/all"]
}
```

or configure individual rules you want to use under the rules section:

```json
{
    "rules": {
        "detachhead/require-variance-annotations": "error"
    }
}
```

## Rules

<!-- begin auto-generated rules list -->

| Name                                                                       | Description                                                             |
| :------------------------------------------------------------------------- | :---------------------------------------------------------------------- |
| [require-variance-annotations](docs/rules/require-variance-annotations.md) | enforce variance annotations for all generics where they are supported. |
| [suggestions-as-errors](docs/rules/suggestions-as-errors.md)               | report typescript suggestions as errors                                 |

<!-- end auto-generated rules list -->
