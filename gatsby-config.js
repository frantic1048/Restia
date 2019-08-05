module.exports = {
    plugins: [
        {
            resolve: 'gatsby-plugin-ts',
            options: {
                fileName: 'types/graphql-types.ts',
            },
        },
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name: 'posts',
                path: `${__dirname}/src/posts`,
            },
        },
        'gatsby-transformer-remark',
    ],
    siteMetadata: {
        title: 'Pyon Pyon Today',
    },
}
