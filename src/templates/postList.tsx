import Layout from '@components/Layout'
import PostEntry from '@components/PostEntry'
import { PostListQuery } from '@restia-gql'
import { scaleAt } from '@util/constants'
import { em } from 'csx'
import { graphql, Link, PageProps } from 'gatsby'
import * as React from 'react'
import { style } from 'typestyle'

export const query = graphql`
    query PostList($skip: Int!, $limit: Int!) {
        allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, limit: $limit, skip: $skip) {
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
                                    layout: FULL_WIDTH
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

// MEMO: extract component ?
export const paginationClassName = style(
    {
        textAlign: 'center',
        marginBottom: em(1),
        $nest: {
            '&>a': {
                padding: `0 ${em(2)}`,
            },
        },
    },
    ...scaleAt(2),
)

// see gatsby-node.js
interface PageContextType {
    numPages: number
    currentPage: number
}

export default ({ data, pageContext }: PageProps<PostListQuery, PageContextType>) => {
    const { numPages, currentPage } = pageContext

    return (
        <Layout>
            {(data.allMarkdownRemark?.edges ?? []).map((post) => {
                const title = post.node.frontmatter?.title
                const slug = post.node.fields?.slug ?? ''
                const cover = post.node.frontmatter?.cover?.childImageSharp?.gatsbyImageData
                return (
                    <PostEntry
                        key={post.node.id}
                        title={title}
                        slug={slug}
                        cover={cover}
                        excerpt={post.node.excerpt}
                        date={post.node.frontmatter?.date}
                    />
                )
            })}
            <nav aria-label="pagination" className={paginationClassName}>
                <Link to={currentPage === 2 ? '/' : `/page/${currentPage - 1}`}>◃ Prev</Link>
                <Link to={`/page/${currentPage}`}>{currentPage}</Link>
                {currentPage < numPages && <Link to={`/page/${currentPage + 1}`}>Next ▹</Link>}
            </nav>
        </Layout>
    )
}
