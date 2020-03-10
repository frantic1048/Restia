import { graphql, Link } from 'gatsby'
import * as React from 'react'
import { GatsbyComponent } from 'util/types'
import { IndexPageQuery } from '../../types/graphql-types'
import Layout from '../components/Layout'

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
        <h1>Recent Posts</h1>
        <ul>
            {(data.allMarkdownRemark?.edges ?? []).map(post => {
                const title = `${post.node.frontmatter?.date ?? ''} | ${post.node.frontmatter?.title ?? ''}`
                const slug = post.node.fields?.slug ?? ''
                return <li key={post.node.id}>{slug ? <Link to={slug}>{title}</Link> : title}</li>
            })}
        </ul>
    </Layout>
)

export default Page
