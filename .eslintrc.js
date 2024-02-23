/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
    root: true,
    reportUnusedDisableDirectives: true,
    overrides: [
        { files: ['*.js'], extends: ['@rabbithouse/eslint-config/node'], parserOptions: { ecmaVersion: 'latest' } },
        {
            files: ['*.ts', '*.tsx'],
            extends: ['@rabbithouse/eslint-config/react-app', 'plugin:import/recommended', 'plugin:import/typescript'],
            parserOptions: { tsconfigRootDir: __dirname, EXPERIMENTAL_useSourceOfProjectReferenceRedirect: true },
            settings: {
                'import/resolver': {
                    typescript: {
                        project: __dirname,
                    },
                },
            },
            rules: {
                '@typescript-eslint/naming-convention': [
                    'error',
                    { selector: 'default', format: ['camelCase'] },
                    { selector: 'typeLike', format: ['PascalCase'] },
                    { selector: 'variable', types: ['function'], format: ['camelCase', 'PascalCase'] },
                    { selector: 'typeParameter', format: ['PascalCase'], prefix: ['T'] },
                    { selector: 'parameter', format: ['camelCase'], leadingUnderscore: 'allow' },
                    { selector: 'import', format: null },

                    // typestyle does not play well with this rule.
                    { selector: 'property', format: null, leadingUnderscore: 'allow' },
                ],
            },
        },
    ],
}
