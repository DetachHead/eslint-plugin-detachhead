import { RuleModule } from '@typescript-eslint/utils/dist/ts-eslint'
import { readdirSync } from 'fs'
import path from 'path'

const rulesDir = path.join(__dirname, 'rules')
const rules: Record<string, RuleModule<string>> = {}

for (const fileName of readdirSync(rulesDir)) {
    if (path.extname(fileName).toLocaleLowerCase() === '.js') {
        // eslint-disable-next-line @typescript-eslint/no-var-requires -- can't use await import here because top level
        rules[path.parse(fileName).name] = require(path.join(
            rulesDir,
            fileName,
        )) as RuleModule<string>
    }
}

export { rules }
