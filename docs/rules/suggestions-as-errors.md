# Report typescript suggestions as errors (`detachhead/suggestions-as-errors`)

<!-- end auto-generated rule header -->

## Rule Details

this rule reports suggestions from the typescript compiler as errors.

example of a typescript compiler suggestion:

![](./images/suggestions-as-errors.png)

Examples of **incorrect** code for this rule:

```ts
// Import may be converted to a default import.
import * as ts from 'typescript'

// 'await' has no effect on the type of this expression.
const foo = await 1
```

Examples of **correct** code for this rule:

```ts
import ts from 'typescript'

const foo = 1
```

### troubleshooting

this rule can potentially cause eslint to crash. for example:

```
Oops! Something went wrong! :(

ESLint: 8.57.0

TypeError: program.getImpliedNodeFormatForEmit is not a function
Occurred while linting /project/.eslintrc.js:2
Rule: "detachhead/suggestions-as-errors"
```

the most common cause is when your project depends on a pre-release version of typescript, because of [npm's shitty dependency resolution system](https://github.com/npm/node-semver/issues/605) which causes transient dependencies that also depend on typescript to incorrectly resolve to and install a release version of typescript as well.

this results in multiple versions of the `typescript` package being installed at the same time, and that causes the `suggestions-as-errors` rule to use a different version of typescript to the version being used by `@typescript-eslint`.

to work around this, add an `overrides` section to your `package.json` to force all dependencies that depend on typescript to resolve to the pre-release version you're using:

```json
{
    "overrides": {
        "typescript": {
            ".": "5.5.0-dev.20240429"
        }
    }
}
```

if you are not relying on on a pre-release version of typescript and are still experiencing eslint crashes caused by this rule, try the following steps:

1. run `npm cache clean --force`
2. delete `node_modules`
3. delete `package-lock.json`
4. run `npm install` again

if the issue persists, please [raise an issue](https://github.com/DetachHead/eslint-plugin-detachhead/issues/new).

## Options

```js
// .eslintrc.js
const config = {
    // ...
    rules: {
        'detachhead/suggestions-as-errors': [
            'error',
            {
                exclude: [80001], // File is a CommonJS module; it may be converted to an ES module
            },
        ],
    },
}
```

### `include`

suggestion codes to include. defaults to all codes

### `exclude`

suggestion codes to exclude. if a code is included in both `include` and `exclude`, the code is excluded.
