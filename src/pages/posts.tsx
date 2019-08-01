import { graphql, Link } from 'gatsby'
import * as React from 'react'
import { oc } from 'ts-optchain'
import { GatsbyComponent } from 'util/types'
import { AllPostsQuery } from '../../types/graphql-types'

export const query = graphql`
    query allPosts {
        allMarkdownRemark {
            totalCount
            edges {
                node {
                    id
                    frontmatter {
                        title
                        date(formatString: "YYYY-MM-DD")
                    }
                    excerpt
                }
            }
        }
    }
`

const Page: GatsbyComponent<AllPostsQuery> = ({ data }) => {
    return (
        <div>
            <h1>Pyon Pyon Posts</h1>
            <Link to="/">Pyon</Link>
            <ul>
                {oc(data)
                    .allMarkdownRemark.edges([])
                    .map(post => (
                        <li key={post.node.id}>
                            {oc(post).node.frontmatter.date('')},{oc(post).node.frontmatter.title('')}
                        </li>
                    ))}
            </ul>
        </div>
    )
}
export default Page
