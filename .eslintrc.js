/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
    root: true,
    reportUnusedDisableDirectives: true,
    overrides: [
        { files: ['*.js'], extends: ['@rabbithouse/eslint-config/node'] },
        {
            files: ['*.ts', '*.tsx'],
            extends: ['@rabbithouse/eslint-config/react-app', 'plugin:import/recommended', 'plugin:import/typescript'],
            parserOptions: { tsconfigRootDir: __dirname },
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

                    // typestyle does not play well with this rule.
                    { selector: 'property', format: null, leadingUnderscore: 'allow' },
                ],
            },
        },
    ],
}
