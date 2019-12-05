import { graphql, Link } from 'gatsby'
import * as React from 'react'
import { GatsbyComponent } from 'util/types'
import { AllPostsQuery } from '../../types/graphql-types'

export const query = graphql`
    query allPosts {
        allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
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

const Page: GatsbyComponent<AllPostsQuery> = ({ data }) => (
    <div>
        <h1>Pyon Pyon Posts</h1>
        <Link to="/">Pyon</Link>
        <ul>
            {(data.allMarkdownRemark?.edges ?? []).map(post => {
                const title = `${post.node.frontmatter?.date ?? ''},${post.node.frontmatter?.title ?? ''}`
                const slug = post.node.fields?.slug ?? ''
                return <li key={post.node.id}>{slug ? <Link to={slug}>{title}</Link> : title}</li>
            })}
        </ul>
    </div>
)

export default Page
