const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
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

exports.createPages = ({ graphql, actions }) => {
    const { createPage } = actions
    return graphql(`
        {
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
    `).then(result => {
        result.data.allMarkdownRemark.edges.forEach(({ node }) => {
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
    })
}
