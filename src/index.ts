// eslint-disable-next-line import/no-extraneous-dependencies -- type inpurt only & not exposed
import { HasDefaultExport } from '@detachhead/ts-helpers/dist/types/misc'
import { RuleModule } from '@typescript-eslint/utils/dist/ts-eslint'
import { readdirSync } from 'fs'
import path from 'path'

const rulesDir = path.join(__dirname, 'rules')
const rules: Record<string, RuleModule<string>> = {}

for (const fileName of readdirSync(rulesDir)) {
    if (path.extname(fileName).toLocaleLowerCase() === '.js') {
        rules[path.parse(fileName).name] =
            // eslint-disable-next-line @typescript-eslint/no-var-requires -- can't use await import here because top level
            (require(path.join(rulesDir, fileName)) as HasDefaultExport<RuleModule<string>>).default
    }
}

export { rules }
