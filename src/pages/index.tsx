import { graphql, Link, PageProps } from 'gatsby'
import * as React from 'react'
import { IndexPageQuery } from '@restia-gql'
import Layout from '@components/Layout'
import { paginationClassName } from 'templates/postList'
import PostEntryList from '@components/PostEntryList'

/**
 * MEMO:
 * unify pageSize(limit) setting?
 *
 * see gatsby-node.js for post list pageSize
 */
export const query = graphql`
    query IndexPage {
        allMarkdownRemark(limit: 9, sort: { fields: [frontmatter___date], order: DESC }) {
            totalCount
            edges {
                node {
                    id
                    frontmatter {
                        title
                        date(formatString: "YYYY-MM-DD")
                        cover {
                            childImageSharp {
                                gatsbyImageData(
                                    quality: 93
                                    placeholder: BLURRED
                                    transformOptions: { fit: COVER }
                                    layout: CONSTRAINED
                                    width: 800
                                )
                            }
                        }
                    }
                    fields {
                        slug
                    }
                    excerpt
                }
            }
        }
    }
`

export default ({ data }: PageProps<IndexPageQuery>) => (
    <Layout>
        <PostEntryList
            postList={(data.allMarkdownRemark?.edges ?? []).map((post) => {
                const title = post.node.frontmatter?.title
                const slug = post.node.fields?.slug
                const cover = post.node.frontmatter?.cover?.childImageSharp?.gatsbyImageData
                return {
                    id: post.node.id,
                    title,
                    slug,
                    cover,
                    excerpt: post.node.excerpt,
                    date: post.node.frontmatter?.date,
                }
            })}
        />

        <nav aria-label="pagination" className={paginationClassName}>
            <Link to={'/page/2'}>More ➠</Link>
        </nav>
    </Layout>
)
