import { graphql } from 'gatsby'
import * as React from 'react'
import { GatsbyComponent } from 'util/types'
import { PostDetailQuery } from '../../types/graphql-types'
import Layout from '../components/Layout'
import { percent, viewHeight, rgb, quote, px } from 'csx'
import { style } from 'typestyle'

const postClassName = style({
    $nest: {
        '& img': {
            maxHeight: viewHeight(70),
            maxWidth: percent(100),
            boxShadow: `${px(3)} ${px(3)} ${px(3)} #aaa`,
        },
        /**
         * MEMO: just works, tune later
         */
        '& .footnotes>ol>li>p': {
            display: 'inline',
        },
    },
})

export const query = graphql`
    query PostDetail($slug: String!) {
        markdownRemark(fields: { slug: { eq: $slug } }) {
            html
            frontmatter {
                title
                date
            }
            fields {
                slug
            }
        }
    }
`

const Page: GatsbyComponent<PostDetailQuery> = ({ data }) => {
    const title = data.markdownRemark?.frontmatter?.title ?? ''
    const date = data.markdownRemark?.frontmatter?.date ?? ''
    const html = data.markdownRemark?.html ?? ''
    const url = data.markdownRemark?.fields?.slug ?? ''
    return (
        <Layout className={postClassName} pageTitle={title} pageUrl={url}>
            <h1>{title}</h1>
            <p>{date}</p>
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </Layout>
    )
}

export default Page
