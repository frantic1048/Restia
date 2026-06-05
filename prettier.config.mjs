/** @type {import("prettier").Config} */
const config = {
    printWidth: 120,
    endOfLine: 'lf',
    semi: false,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'all',
    plugins: ['prettier-plugin-astro'],
    overrides: [
        {
            files: ['*.yml', '*.yaml'],
            options: {
                tabWidth: 2,
            },
        },
        {
            files: ['*.astro'],
            options: {
                parser: 'astro',
            },
        },
    ],
}

export default config
