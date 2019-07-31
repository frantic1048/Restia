module.exports = {
    plugins: [
        {
            resolve: 'gatsby-plugin-ts',
            options: {
                fileName: 'types/graphql-types.ts',
            },
        },
    ],
    siteMetadata: {
        title: 'Pyon Pyon Today',
    },
}
