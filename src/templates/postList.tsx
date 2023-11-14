import { em } from 'csx'
import { graphql, Link, PageProps } from 'gatsby'
import * as React from 'react'
import { style } from 'typestyle'

import Layout from '../components/Layout'
import PostEntryList from '../components/PostEntryList'
import { PostListQuery } from '../types/graphql-types'
import { scaleAt } from '../util/constants'

export const query = graphql`
    query PostList($skip: Int!, $limit: Int!) {
        allMarkdownRemark(sort: { frontmatter: { date: DESC } }, limit: $limit, skip: $skip) {
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

// MEMO: extract component ?
export const paginationClassName = style(
    {
        textAlign: 'center',
        marginBottom: em(1),
        display: 'flex',
        justifyContent: 'center',
        $nest: {
            '&>a': {
                margin: `0 ${em(1)}`,
            },
        },
    },
    ...scaleAt(2),
)

const currentPageClassName = style({
    padding: `0 ${em(1)}`,
})

// see gatsby-node.js
interface PageContextType {
    numPages: number
    currentPage: number
}

export default ({ data, pageContext }: PageProps<PostListQuery, PageContextType>) => {
    const { numPages, currentPage } = pageContext

    return (
        <Layout>
            <PostEntryList
                postList={(data.allMarkdownRemark?.edges ?? []).map((post) => {
                    const title = post.node.frontmatter?.title
                    const slug = post.node.fields?.slug ?? ''
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
                <Link to={currentPage === 2 ? '/' : `/page/${currentPage - 1}`}>◃ Prev</Link>
                <Link to={`/page/${currentPage}`} className={currentPageClassName}>
                    {currentPage}
                </Link>
                {currentPage < numPages && <Link to={`/page/${currentPage + 1}`}>Next ▹</Link>}
            </nav>
        </Layout>
    )
}
