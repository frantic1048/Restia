import { graphql, Link } from 'gatsby'
import * as React from 'react'
import { GatsbyComponent } from 'util/types'
import { IndexPageQuery } from '@restia-gql'
import Layout from '@components/Layout'
import PostEntry from '@components/PostEntry'
import { paginationClassName } from 'templates/postList'

export const query = graphql`
    query IndexPage {
        allMarkdownRemark(limit: 6, sort: { fields: [frontmatter___date], order: DESC }) {
            totalCount
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

const Page: GatsbyComponent<IndexPageQuery> = ({ data }) => (
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
            <Link to={'/page/2'}>More ➠</Link>
        </nav>
    </Layout>
)

export default Page
