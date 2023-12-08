import * as path from 'node:path'

import type { GatsbyNode } from 'gatsby'
import { createFilePath } from 'gatsby-source-filesystem'

export const onCreateNode: GatsbyNode['onCreateNode'] = ({ node, getNode, actions }) => {
    const { createNodeField } = actions
    if (node.internal.type === `MarkdownRemark`) {
        // eslint-disable-next-line sonarjs/no-nested-template-literals
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

    const result = await graphql(`
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

    const posts = result.data.allMarkdownRemark.edges
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
