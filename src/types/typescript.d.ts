// eslint-disable-next-line detachhead/suggestions-as-errors -- https://github.com/microsoft/TypeScript/issues/54042
import { CancellationToken, DiagnosticWithLocation, Program, SourceFile } from 'typescript'

declare module 'typescript' {
    export const computeSuggestionDiagnostics: (
        sourceFile: SourceFile,
        program: Program,
        cancellationToken: CancellationToken,
    ) => DiagnosticWithLocation[]
}
