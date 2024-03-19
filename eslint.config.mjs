import eslint from '@eslint/js'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'

/** @type {import("eslint").Linter.FlatConfig} */
const config = [
    {
        linterOptions: {
            reportUnusedDisableDirectives: 'error',
        },
        plugins: {
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
        },
    },
    ...tseslint.configs.recommendedTypeChecked.map((conf) => ({
        ...conf,
        files: ['**/*.{ts,cts,mts,tsx}'],
    })),
    {
        files: ['**/*.{ts,cts,mts,tsx}'],
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
                EXPERIMENTAL_useSourceOfProjectReferenceRedirect: true,
            },
        },
        rules: {
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/consistent-type-exports': 'error',
            '@typescript-eslint/no-import-type-side-effects': 'error',
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
    {
        ...eslint.configs.recommended,
        files: ['**/*.{js,mjs,cjs}'],
    },
    {
        files: ['*.{js,cjs}'],
        languageOptions: {
            globals: {
                module: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
            },
        },
    },
    {
        files: ['plugins/**/gatsby-browser.js'],
        languageOptions: {
            globals: {
                document: 'readonly',
            },
        },
    },
    {
        // MEMO: Do not put any extra keys here otherwise it will not work.
        // https://eslint.org/docs/latest/use/configure/configuration-files-new#globally-ignoring-files-with-ignores
        ignores: ['public/*', '.cache/*'],
    },
]
export default config
