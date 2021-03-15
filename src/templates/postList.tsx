import Layout from '@components/Layout'
import PostEntry from '@components/PostEntry'
import { PostListQuery } from '@restia-gql'
import { scaleAt } from '@util/constants'
import { GatsbyComponentRenderProps } from '@util/types'
import { em } from 'csx'
import { graphql, Link } from 'gatsby'
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
                                fluid(maxWidth: 800, fit: COVER, quality: 93) {
                                    ...GatsbyImageSharpFluid_withWebp
                                }
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

class Page extends React.Component<GatsbyComponentRenderProps<PostListQuery>> {
    public render() {
        const { data } = this.props

        // see gatsby-node.js
        const { numPages, currentPage } = this.props.pageContext as { numPages: number; currentPage: number }

        return (
            <Layout>
                {(data.allMarkdownRemark?.edges ?? []).map((post) => {
                    const title = post.node.frontmatter?.title
                    const slug = post.node.fields?.slug ?? ''

                    /**
                     * FIXME:
                     *
                     * gatsby-image and ImageSharpFluid does not have exactly same
                     * type interface, on base64 field,
                     * string|undefined|null (ImageSharpFluid) !== string|undefined (gatsby-image)
                     */
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const cover: any = post.node.frontmatter?.cover?.childImageSharp?.fluid
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
}

export default Page
