import { graphql, Link } from 'gatsby'
import * as React from 'react'
import { GatsbyComponent } from 'util/types'
import { IndexPageQuery } from '@restia-gql'
import Layout from '@components/Layout'
import { style } from 'typestyle'
import { quote } from 'csx'
import Img from 'gatsby-image'
import { contentImageStyle } from '@util/constants'

export const query = graphql`
    query IndexPage {
        allMarkdownRemark(limit: 5, sort: { fields: [frontmatter___date], order: DESC }) {
            totalCount
            edges {
                node {
                    id
                    frontmatter {
                        title
                        date(formatString: "YYYY-MM-DD")
                        category
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

const postEntryClassName = style({
    $nest: {
        '& .gatsby-image-wrapper': {
            ...contentImageStyle,
        },
    },
})

const postInfoClassName = style({
    $nest: {
        '&>span:not(:last-child)::after': {
            content: quote(', '),
        },
    },
})

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
                <article key={post.node.id} className={postEntryClassName}>
                    <h1>{slug ? <Link to={slug}>{title}</Link> : title}</h1>
                    <p className={postInfoClassName}>
                        <span>{post.node.frontmatter?.date}</span>
                        <span>{post.node.frontmatter?.category}</span>
                    </p>
                    {cover && <Img fluid={cover} />}
                    <p>{post.node.excerpt}</p>
                </article>
            )
        })}
    </Layout>
)

export default Page
