/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as path from 'node:path'

import { codecovWebpackPlugin } from '@codecov/webpack-plugin'
import type { GatsbyNode } from 'gatsby'
import { createFilePath } from 'gatsby-source-filesystem'

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({ getConfig, actions }) => {
    const config = getConfig()

    config.plugins = [
        ...(Array.isArray(config.plugins) ? config.plugins : []),
        // add your plugins here
        process.env.CODECOV_TOKEN &&
            codecovWebpackPlugin({
                enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
                bundleName: 'main',
                uploadToken: process.env.CODECOV_TOKEN,
            }),
    ].filter(Boolean)

    actions.replaceWebpackConfig(config)
}

export const onCreateNode: GatsbyNode['onCreateNode'] = ({ node, getNode, actions }) => {
    const { createNodeField } = actions
    if (node.internal.type === `MarkdownRemark`) {
        const slug = `/p${createFilePath({ node, getNode, basePath: `posts` })}`
        console.log('slug:', slug)
        createNodeField({
            node,
            name: `slug`,
            value: slug,
        })
    }
}

export const createPages: GatsbyNode['createPages'] = async ({ graphql, actions }) => {
    const { createPage } = actions

    const result = await graphql<Queries.createPagesQuery>(`
        query createPages {
            allMarkdownRemark {
                edges {
                    node {
                        fields {
                            slug
                        }
                    }
                }
            }
        }
    `)

    const posts = result.data?.allMarkdownRemark.edges ?? []
    const pageSize = 9
    const numPages = Math.ceil(posts.length / pageSize)
    Array.from({ length: numPages }).forEach((_, pageIndex) => {
        // skip first page, since we have index page
        if (pageIndex > 0) {
            createPage({
                path: `/page/${pageIndex + 1}`,
                component: path.resolve('./src/templates/postList.tsx'),
                context: {
                    limit: pageSize,
                    skip: pageIndex * pageSize,
                    numPages,
                    currentPage: pageIndex + 1,
                },
            })
        }
    })

    // pages for each post
    posts.forEach(({ node }) => {
        const slug = node.fields.slug
        createPage({
            path: slug,
            component: path.resolve(`./src/templates/post.tsx`),
            context: {
                // Data passed to context is available
                // in page queries as GraphQL variables.
                slug: slug,
            },
        })
    })
}
