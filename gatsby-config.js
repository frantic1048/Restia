module.exports = {
    plugins: [
        {
            resolve: 'gatsby-plugin-typestyle', // local plugin
            options: {
                styleTargetId: 'pyonpyon-style',
            },
        },
        'gatsby-plugin-catch-links',
        'gatsby-plugin-react-helmet',
        {
            resolve: 'gatsby-plugin-ts',
            options: {
                fileName: 'types/graphql-types.ts',
                documentPaths: [
                    /**
                     * gatsby-plugin-graphql-codegen seems loading some incorrect content as
                     * graphql document from default paths, which causes codegen error.
                     * TODO: investigate later
                     */
                    // default: './src/**/*.{ts,tsx}',
                    './src/{pages,templates,components}/!(*.d).{ts,tsx}',

                    './.cache/fragments/*.js',
                    './node_modules/gatsby-*/**/*.js',
                ],
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/static/photo`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/static/image`,
            },
        },
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name: 'posts',
                path: `${__dirname}/posts`,
            },
        },
        'gatsby-transformer-sharp',
        'gatsby-plugin-sharp',
        {
            resolve: 'gatsby-transformer-remark',
            options: {
                plugins: [
                    {
                        resolve: 'gatsby-remark-highlights',
                        options: {
                            scopePrefix: 'syntax--',
                        },
                    },
                    {
                        resolve: 'gatsby-remark-images',
                        options: {
                            maxWidth: 1200,
                            linkImagesToOriginal: true,
                            backgroundColor: 'none',
                            loading: 'auto',
                            quality: 90,
                            withWebp: { quality: 93 },

                            /**
                             * MEMO: NOT TODAY...
                             *
                             * mobile firefox/chrome loading
                             * avif but show nothing (¯ . ¯٥)
                             */
                            withAvif: false,
                        },
                    },
                ],
            },
        },
        {
            resolve: 'gatsby-plugin-feed',
            options: {
                query: `
                    {
                        site {
                            siteMetadata {
                                title
                                description
                                siteUrl
                                site_url: siteUrl
                            }
                        }
                    }
                `,
                feeds: [
                    {
                        serialize: ({ query: { site, allMarkdownRemark } }) => {
                            return allMarkdownRemark.edges.map((edge) => {
                                return Object.assign({}, edge.node.frontmatter, {
                                    description: edge.node.excerpt,
                                    date: edge.node.frontmatter.date,
                                    url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                                    guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                                    custom_elements: [{ 'content:encoded': edge.node.html }],
                                })
                            })
                        },
                        query: `
                        {
                            allMarkdownRemark(
                              sort: { order: DESC, fields: [frontmatter___date] },
                            ) {
                              edges {
                                node {
                                  excerpt
                                  html
                                  fields { slug }
                                  frontmatter {
                                    title
                                    date
                                  }
                                }
                              }
                            }
                          }            
                        `,
                        output: '/rss.xml',
                        title: "Pyon Pyon Today's RSS Feed",
                    },
                ],
            },
        },
    ],
    siteMetadata: {
        title: 'Pyon Pyon Today',
        description: 'Pyon Pyon Today',
        siteUrl: `https://pyonpyon.today`,
        image: '/favicon.png',
    },
}
