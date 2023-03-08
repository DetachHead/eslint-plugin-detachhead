# eslint-plugin-detachhead

detachhead&#39;s eslint rules

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-detachhead`:

```sh
npm install eslint-plugin-detachhead --save-dev
```

## Usage

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
