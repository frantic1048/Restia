import { graphql } from 'gatsby'
import * as React from 'react'
import { oc } from 'ts-optchain'
import { GatsbyComponent } from 'util/types'
import { PostDetailQuery } from '../../types/graphql-types'

export const query = graphql`
    query postDetail($slug: String!) {
        markdownRemark(fields: { slug: { eq: $slug } }) {
            html
            frontmatter {
                title
                date
            }
        }
    }
`

const Page: GatsbyComponent<PostDetailQuery> = ({ data }) => {
    const title = oc(data).markdownRemark.frontmatter.title('')
    const date = oc(data).markdownRemark.frontmatter.date('')
    const html = oc(data).markdownRemark.html('')
    return (
        <div>
            <h1>{title}</h1>
            <p>{date}</p>
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    )
}

export default Page
