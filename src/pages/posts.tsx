import { graphql, Link } from 'gatsby'
import * as React from 'react'
import { GatsbyComponent } from 'util/types'
import { ArchiveListQuery } from '../../types/graphql-types'
import Layout from '../components/Layout'
import { style } from 'typestyle'
import { groupBy } from '../util/util'
import { em, quote } from 'csx'

export const query = graphql`
    query ArchiveList {
        allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
            totalCount
            edges {
                node {
                    id
                    frontmatter {
                        title
                        date(formatString: "YYYY-MM-DD")
                        shortDate: date(formatString: "MMM D")
                        year: date(formatString: "YYYY")
                        category
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

const postsClassName = style({
    listStyle: 'none',
})

const postEntryClassName = style({
    display: 'block',
})

const postEntryInfoClassName = style({
    $nest: {
        '&>span::after': {
            content: quote(' | '),
        },
    },
})

const Page: GatsbyComponent<ArchiveListQuery> = ({ data }) => {
    const posts = data.allMarkdownRemark.edges ?? []

    /**
     * group posts by year, DESC
     *
     * NOTE: assuming all posts have proper date field(with year)
     */
    const postGroupsByYear = groupBy(posts, (post) => post.node.frontmatter?.year ?? '')
    const groupNames = Object.keys(postGroupsByYear).sort((a, b) => parseInt(b, 10) - parseInt(a, 10))

    return (
        <Layout pageTitle="Pyon Pyon Posts" pageUrl="/posts">
            {groupNames.map((groupName) => (
                <section key={groupName}>
                    <h2>{groupName}</h2>
                    <ul className={postsClassName}>
                        {postGroupsByYear[groupName].map((post) => {
                            /**
                             * TODO: responsiveness, better styling for date and category
                             */
                            const slug = post.node.fields?.slug ?? ''
                            const title = (
                                <span className={postEntryClassName}>
                                    <span className={postEntryInfoClassName}>
                                        <span>{post.node.frontmatter?.shortDate}</span>
                                        <span>{post.node.frontmatter?.category}</span>
                                    </span>
                                    <span>{post.node.frontmatter?.title}</span>
                                </span>
                            )
                            return <li key={post.node.id}>{slug ? <Link to={slug}>{title}</Link> : { title }}</li>
                        })}
                    </ul>
                </section>
            ))}
        </Layout>
    )
}

export default Page
