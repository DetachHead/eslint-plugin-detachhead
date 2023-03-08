# eslint-plugin-detachhead

detachhead&#39;s eslint rules

## Installation

## method 1 - `@detachhead/eslint-config`

it's recommended to use my [`@detachhead/eslint-config`](https://github.com/detachhead/eslint-config) as it includes all of the eslint plugins & rules that i recommend. this plugin only contains rules i made myself and is intended to be used along with my config

```sh
npm install @detachhead/eslint-config --save-dev
```

## method 2 - just the plugin

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-detachhead`:

```sh
npm install eslint-plugin-detachhead --save-dev
```

### Usage

(this is handled by `@detachhead/eslint-config`, you only need to do this if you installed the plugin using method 2)

Add `detachhead` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": ["detachhead"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "detachhead/rule-name": "error"
    }
}
```

## Rules

<!-- begin auto-generated rules list -->

| Name                                                                       | Description                                                             |
| :------------------------------------------------------------------------- | :---------------------------------------------------------------------- |
| [require-variance-annotations](docs/rules/require-variance-annotations.md) | enforce variance annotations for all generics where they are supported. |

<!-- end auto-generated rules list -->
