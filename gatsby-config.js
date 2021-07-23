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
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/static/lilypond`,
            },
        },
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name: 'posts',
                path: `${__dirname}/posts`,
            },
        },
        'gatsby-plugin-image',
        'gatsby-plugin-sharp',
        'gatsby-transformer-sharp',
        {
            resolve: 'gatsby-transformer-remark',
            options: {
                plugins: [
                    {
                        resolve: 'gatsby-remark-autolink-headers',
                        options: {},
                    },
                    {
                        resolve: 'gatsby-remark-highlights',
                        options: {
                            scopePrefix: 'syntax--',
                            additionalLangs: [
                                /** in markdown: lilypond */
                                'linter-lilypond',
                            ],
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
                    {
                        resolve: 'gatsby-remark-audio',
                        options: {
                            preload: 'auto',
                            loop: false,
                            controls: true,
                            muted: false,
                            autoplay: false,
                        },
                    },
                    {
                        resolve: 'gatsby-remark-copy-linked-files',
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
        {
            resolve: 'gatsby-plugin-sitemap',
            options: {
                query: `
                {
                    site {
                      siteMetadata {
                        siteUrl
                      }
                    }
                    allSitePage {
                      nodes {
                        path
                      }
                    }
                    allMarkdownRemark {
                      edges {
                        node {
                          fields {
                            slug
                          }
                          frontmatter {
                            date
                          }
                        }
                      }
                    }
                  }                  
            `,
                resolvePages: ({ allSitePage: { nodes: allPages }, allMarkdownRemark: { edges } }) => {
                    const markdownPageLastmodMap = edges.reduce((acc, { node }) => {
                        const uri = node.fields.slug
                        acc[uri] = { lastmod: node.frontmatter.date }

                        return acc
                    }, {})

                    return allPages.map((page) => {
                        return { ...page, ...markdownPageLastmodMap[page.path] }
                    })
                },
                serialize: ({ path, lastmod }) => {
                    return {
                        url: path,
                        lastmod,
                    }
                },
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
