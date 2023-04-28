export {}

declare module 'typescript' {
    export const computeSuggestionDiagnostics: (
        sourceFile: SourceFile,
        program: Program,
        cancellationToken: CancellationToken,
    ) => DiagnosticWithLocation[]
}
