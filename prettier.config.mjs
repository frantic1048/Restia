/** @type {import("prettier").Config} */
const config = {
    printWidth: 120,
    endOfLine: 'lf',
    semi: false,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'all',
    overrides: [
        {
            files: ['*.yml', '*.yaml'],
            options: {
                tabWidth: 2,
            },
        },
    ],
}

export default config
