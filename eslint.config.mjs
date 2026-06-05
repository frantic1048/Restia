import eslint from '@eslint/js'
import eslintPluginAstro from 'eslint-plugin-astro'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'

export default tseslint.config(
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
    ...tseslint.config({
        files: ['**/*.{ts,cts,mts,tsx}'],
        extends: [...tseslint.configs.recommendedTypeChecked],
        languageOptions: {
            parserOptions: {
                projectService: true,
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
                { selector: 'function', format: ['camelCase', 'PascalCase', 'UPPER_CASE'] },
                { selector: 'variable', types: ['function'], format: ['camelCase', 'PascalCase'] },
                { selector: 'typeParameter', format: ['PascalCase'], prefix: ['T'] },
                { selector: 'parameter', format: ['camelCase'], leadingUnderscore: 'allow' },
                { selector: 'import', format: null },
                { selector: 'property', format: null, leadingUnderscore: 'allow' },
            ],
        },
    }),
    ...eslintPluginAstro.configs.recommended,
    ...tseslint.config({
        files: ['**/*.{js,mjs,cjs}'],
        extends: [eslint.configs.recommended],
    }),
    {
        // MEMO: Do not put any extra keys here otherwise it will not work.
        // https://eslint.org/docs/latest/use/configure/configuration-files-new#globally-ignoring-files-with-ignores
        ignores: ['dist/*', '.astro/*'],
    },
)
