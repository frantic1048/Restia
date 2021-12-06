import { graphql, PageProps } from 'gatsby'
import * as React from 'react'
import { PostDetailQuery } from '@restia-gql'
import Layout from '@components/Layout'
import { em, percent, px, quote, rgb } from 'csx'
import { style, cssRaw } from 'typestyle'
import { contentImageStyle } from '@util/constants'
import Comments from '@components/Comments'
import { getSrc } from 'gatsby-plugin-image'

/**
 * Atom Base16 Tomorrow Light Syntax theme
 * https://github.com/atom/atom/tree/master/packages/base16-tomorrow-light-theme
 *
 * MEMO: removed background rules
 */
cssRaw(`
.syntax--comment {
    color: #969896;
  }
  .syntax--comment .syntax--markup.syntax--link {
    color: #969896;
  }
  .syntax--entity.syntax--name.syntax--type {
    color: #f0c674;
  }
  .syntax--entity.syntax--other.syntax--inherited-class {
    color: #b5bd68;
  }
  .syntax--keyword {
    color: #b294bb;
  }
  .syntax--keyword.syntax--control {
    color: #b294bb;
  }
  .syntax--keyword.syntax--operator {
    color: #1d1f21;
  }
  .syntax--keyword.syntax--other.syntax--special-method {
    color: #81a2be;
  }
  .syntax--keyword.syntax--other.syntax--unit {
    color: #de935f;
  }
  .syntax--storage {
    color: #b294bb;
  }
  .syntax--constant {
    color: #de935f;
  }
  .syntax--constant.syntax--character.syntax--escape {
    color: #8abeb7;
  }
  .syntax--constant.syntax--numeric {
    color: #de935f;
  }
  .syntax--constant.syntax--other.syntax--color {
    color: #8abeb7;
  }
  .syntax--constant.syntax--other.syntax--symbol {
    color: #8abeb7;
  }
  .syntax--variable {
    color: #cc6666;
  }
  .syntax--variable.syntax--interpolation {
    color: #a3685a;
  }
  .syntax--variable.syntax--parameter.syntax--function {
    color: #1d1f21;
  }
  .syntax--invalid.syntax--illegal {
    background-color: #cc6666;
    color: #ffffff;
  }
  .syntax--string {
    color: #b5bd68;
  }
  .syntax--string.syntax--regexp {
    color: #8abeb7;
  }
  .syntax--string.syntax--regexp .syntax--source.syntax--ruby.syntax--embedded {
    color: #f0c674;
  }
  .syntax--string.syntax--other.syntax--link {
    color: #cc6666;
  }
  .syntax--punctuation.syntax--definition.syntax--parameters,
  .syntax--punctuation.syntax--definition.syntax--array {
    color: #1d1f21;
  }
  .syntax--punctuation.syntax--definition.syntax--heading,
  .syntax--punctuation.syntax--definition.syntax--identity {
    color: #81a2be;
  }
  .syntax--punctuation.syntax--definition.syntax--bold {
    color: #f0c674;
    font-weight: bold;
  }
  .syntax--punctuation.syntax--definition.syntax--italic {
    color: #b294bb;
    font-style: italic;
  }
  .syntax--punctuation.syntax--section.syntax--embedded {
    color: #a3685a;
  }
  .syntax--punctuation.syntax--section.syntax--method,
  .syntax--punctuation.syntax--section.syntax--class,
  .syntax--punctuation.syntax--section.syntax--inner-class {
    color: #1d1f21;
  }
  .syntax--support.syntax--class {
    color: #f0c674;
  }
  .syntax--support.syntax--function {
    color: #8abeb7;
  }
  .syntax--support.syntax--function.syntax--any-method {
    color: #81a2be;
  }
  .syntax--entity.syntax--name.syntax--function {
    color: #81a2be;
  }
  .syntax--entity.syntax--name.syntax--class,
  .syntax--entity.syntax--name.syntax--type.syntax--class {
    color: #f0c674;
  }
  .syntax--entity.syntax--name.syntax--section {
    color: #81a2be;
  }
  .syntax--entity.syntax--name.syntax--tag {
    color: #cc6666;
  }
  .syntax--entity.syntax--other.syntax--attribute-name {
    color: #de935f;
  }
  .syntax--entity.syntax--other.syntax--attribute-name.syntax--id {
    color: #81a2be;
  }
  .syntax--meta.syntax--class {
    color: #f0c674;
  }
  .syntax--meta.syntax--class.syntax--body {
    color: #1d1f21;
  }
  .syntax--meta.syntax--link {
    color: #de935f;
  }
  .syntax--meta.syntax--method-call,
  .syntax--meta.syntax--method {
    color: #1d1f21;
  }
  .syntax--meta.syntax--require {
    color: #81a2be;
  }
  .syntax--meta.syntax--selector {
    color: #b294bb;
  }
  .syntax--meta.syntax--separator {
    color: #1d1f21;
  }
  .syntax--meta.syntax--tag {
    color: #1d1f21;
  }
  .syntax--none {
    color: #1d1f21;
  }
  .syntax--markup.syntax--bold {
    color: #de935f;
    font-weight: bold;
  }
  .syntax--markup.syntax--changed {
    color: #b294bb;
  }
  .syntax--markup.syntax--deleted {
    color: #cc6666;
  }
  .syntax--markup.syntax--italic {
    color: #b294bb;
    font-style: italic;
  }
  .syntax--markup.syntax--heading {
    color: #cc6666;
  }
  .syntax--markup.syntax--heading .syntax--punctuation.syntax--definition.syntax--heading {
    color: #81a2be;
  }
  .syntax--markup.syntax--link {
    color: #81a2be;
  }
  .syntax--markup.syntax--inserted {
    color: #b5bd68;
  }
  .syntax--markup.syntax--quote {
    color: #de935f;
  }
  .syntax--markup.syntax--raw {
    color: #b5bd68;
  }
  .syntax--source.syntax--gfm .syntax--markup {
    -webkit-font-smoothing: auto;
  }
  .syntax--source.syntax--gfm .syntax--link .syntax--entity {
    color: #8abeb7;
  }
  .syntax--source.syntax--cs .syntax--keyword.syntax--operator {
    color: #b294bb;
  }
  .syntax--source.syntax--json .syntax--meta.syntax--structure.syntax--dictionary.syntax--json > .syntax--string.syntax--quoted.syntax--json {
    color: #cc6666;
  }
  .syntax--source.syntax--json .syntax--meta.syntax--structure.syntax--dictionary.syntax--json > .syntax--string.syntax--quoted.syntax--json > .syntax--punctuation.syntax--string {
    color: #cc6666;
  }
  .syntax--source.syntax--json .syntax--meta.syntax--structure.syntax--dictionary.syntax--json > .syntax--value.syntax--json > .syntax--string.syntax--quoted.syntax--json,
  .syntax--source.syntax--json .syntax--meta.syntax--structure.syntax--array.syntax--json > .syntax--value.syntax--json > .syntax--string.syntax--quoted.syntax--json,
  .syntax--source.syntax--json .syntax--meta.syntax--structure.syntax--dictionary.syntax--json > .syntax--value.syntax--json > .syntax--string.syntax--quoted.syntax--json > .syntax--punctuation,
  .syntax--source.syntax--json .syntax--meta.syntax--structure.syntax--array.syntax--json > .syntax--value.syntax--json > .syntax--string.syntax--quoted.syntax--json > .syntax--punctuation {
    color: #b5bd68;
  }
  .syntax--source.syntax--json .syntax--meta.syntax--structure.syntax--dictionary.syntax--json > .syntax--constant.syntax--language.syntax--json,
  .syntax--source.syntax--json .syntax--meta.syntax--structure.syntax--array.syntax--json > .syntax--constant.syntax--language.syntax--json {
    color: #8abeb7;
  }
`)

const postClassName = style({
    wordBreak: 'break-word',
    $nest: {
        '& .gatsby-resp-image-wrapper': {
            ...contentImageStyle,
            marginTop: em(0.5),
            marginBottom: em(0.5),
        },
        '& :not(.gatsby-resp-image-wrapper) img': {
            maxWidth: percent(100),
        },
        /**
         * MEMO: just works, tune later
         */
        '& .footnotes>ol>li>p': {
            display: 'inline',
        },

        /**
         * code block,
         * `.editor` className is generated by gatsby-remark-highlights
         */
        '& .editor': {
            overflow: 'auto',
            paddingLeft: em(0.7),
            borderLeft: `${em(0.3)} double ${rgb(0, 149, 255, 0.5)}`,
            background: `#FAFAFA`,
            paddingTop: em(0.5),
            paddingBottom: em(0.5),
        },
        /**
         * TODO: special styles for special links
         */
        '& a[href^="https://archlinux.org/packages/"]::after': {
            content: quote('pkg'),
            fontSize: 'smaller',
            verticalAlign: 'super',
            display: 'inline-block',
        },
        '& table': {
            borderCollapse: 'collapse',
        },
        '& tr': {
            borderStyle: 'solid',
            borderWidth: px(1),
            borderColor: rgb(197, 203, 207).toString(),
        },
        '& td, & th': {
            padding: `${em(0.5)} ${em(1)}`,
        },
    },
})

const contentClassName = style({
    /**
     * FIXME: only limit width on text-only paragraph
     */
    maxWidth: em(70),
    margin: 'auto',
})

export const query = graphql`
    query PostDetail($slug: String!) {
        markdownRemark(fields: { slug: { eq: $slug } }) {
            html
            frontmatter {
                title
                date(formatString: "YYYY-MM-DD")
                category
                cover {
                    childImageSharp {
                        gatsbyImageData(
                            quality: 93
                            placeholder: BLURRED
                            transformOptions: { fit: COVER }
                            layout: FULL_WIDTH
                        )
                    }
                }
            }
            fields {
                slug
            }
            excerpt(format: PLAIN, truncate: true, pruneLength: 80)
        }
    }
`

export default ({ data }: PageProps<PostDetailQuery>) => {
    const title = data.markdownRemark?.frontmatter?.title ?? ''
    const info = `${data.markdownRemark?.frontmatter?.date} ${data.markdownRemark?.frontmatter?.category}`
    const html = data.markdownRemark?.html ?? ''
    const slug = data.markdownRemark?.fields?.slug ?? ''
    const excerpt = data.markdownRemark?.excerpt ?? ''

    /**
     * MEMO:
     *  Twitter card supports webp nice and well.
     *  But some other clients does not support webp :(
     */
    // convert null to undefined since Layout does not like null
    const cover = getSrc(data.markdownRemark?.frontmatter?.cover?.childImageSharp?.gatsbyImageData)

    return (
        <Layout
            className={postClassName}
            contentClassName={contentClassName}
            pageTitle={title}
            pageUrl={slug}
            pageDescription={excerpt}
            pageImage={cover}
        >
            <h1>{title}</h1>
            <p>{info}</p>
            {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
            <div dangerouslySetInnerHTML={{ __html: html }} />
            <Comments slug={slug} title={title} />
        </Layout>
    )
}
