import * as React from 'react'
import useIsInViewport from 'use-is-in-viewport'
import { CommentsQuery } from '@restia-gql'
import { graphql, useStaticQuery } from 'gatsby'
import { DiscussionEmbed } from 'disqus-react'
import { style } from 'typestyle'
import { px } from 'csx'

const disqusClassName = style({
    // make it easier to tirgger
    minHeight: px(300),
})

interface Props {
    slug: string
    title: string
}

export default ({ slug, title }: Props) => {
    const data = useStaticQuery<CommentsQuery>(graphql`
        query Comments {
            site {
                siteMetadata {
                    siteUrl
                }
            }
        }
    `)
    const siteUrl = data.site?.siteMetadata?.siteUrl ?? ''
    const fullUrl = siteUrl && `${siteUrl}${slug}`

    const [isInViewport, targetRef] = useIsInViewport()
    const [commentsLoaded, setCommentsLoaded] = React.useState(false)

    React.useEffect(() => {
        if (isInViewport && fullUrl) {
            setCommentsLoaded(true)
        }
    }, [isInViewport, commentsLoaded, fullUrl])

    return (
        <>
            <div id="disqus_thread" ref={targetRef} className={disqusClassName} />
            {commentsLoaded && (
                <DiscussionEmbed
                    shortname="pyonpyontoday"
                    config={{
                        url: fullUrl,
                        identifier: slug,
                        title,
                    }}
                />
            )}
        </>
    )
}
